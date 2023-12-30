import React, { useState, useEffect } from 'react';
import { deletePatientById, getAllPatients, updatePatientById } from '../../Api/Api';
import Navbar from '../Navbar/Navbar';
import '../../style/PatientList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from "../../utils/Pagination";
import { useNavigate } from "react-router-dom";
import Spinner from "../../utils/Spinner";

const PatientList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [collapsedItems, setCollapsedItems] = useState([]);
    const [filterDate, setFilterDate] = useState(null);
    const [searchClicked, setSearchClicked] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedIndex, setEditedIndex] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [editedGroupe, setEditedGroupe] = useState('');
    const [originalIndices, setOriginalIndices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [groupsPerPage] = useState(5);
    const navigate = useNavigate();
    const [expandedMap, setExpandedMap] = useState(new Map());
    const [isEditingMap, setIsEditingMap] = useState(new Map());
    const [loading, setLoading] = useState(true);

    const groupPatientsByGroupe = () => {
        const groupedPatients = {};
        searchResults.forEach((patient) => {
            const group = patient.groupe || 'Other';
            if (!groupedPatients[group]) {
                groupedPatients[group] = [];
            }
            groupedPatients[group].push(patient);
        });
        return groupedPatients;
    };

    const totalPages = Math.ceil(Object.keys(groupPatientsByGroupe()).length / groupsPerPage);

    useEffect(() => {
        fetchData();
    }, []); // Moved fetchData outside of setCollapsedItems to fetch data as soon as the component is mounted

    useEffect(() => {
        handleSearch();
    }, [filterDate, currentPage, groupsPerPage]);

    const fetchData = async () => {
        try {
            const patientsData = await getAllPatients();
            const initialCollapsedState = Array(patientsData.length).fill(true);

            setCollapsedItems(initialCollapsedState);
            setOriginalData(patientsData);
            setSearchResults(patientsData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };



    const handleViewDetails = (fullname , patientById) => {

        localStorage.setItem("fullname", fullname);
        localStorage.setItem("patientById", patientById)

        navigate(`/patient-results`);
    };

    const handleModifyData = (fullname , patientById) => {

        localStorage.setItem("fullname", fullname);
        localStorage.setItem("patientById", patientById)

        navigate(`/modify-patient-data`);
    };

    const mapSearchResultsToOriginalIndices = (searchResults, originalData) => {
        const indexMapping = searchResults.map((result) =>
            originalData.findIndex((item) => item.id === result.id)
        );
        return indexMapping;
    };

    const handleSearch = () => {
        const filteredItems = originalData.filter(
            (item) =>
                item.fullname.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (!filterDate || item.expDate === filterDate)
        );

        setSearchResults(filteredItems);
        setSearchClicked(true);

        const originalIndices = filteredItems.map((result) => originalData.indexOf(result));
        setOriginalIndices(originalIndices);
    };

    useEffect(() => {
        const indexMapping = mapSearchResultsToOriginalIndices(searchResults, originalData);
        setCollapsedItems(indexMapping.map(() => true));
    }, [searchResults, originalData]);

    const toggleCollapse = (patientId) => {
        setExpandedMap((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set(patientId, !newMap.get(patientId));
            return newMap;
        });
    };

    const handleEditPatient = (patientId) => {
        setIsEditingMap((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set(patientId, !prevMap.get(patientId));
            return newMap;
        });

        setEditedIndex(patientId);
        setEditedData(searchResults.find((result) => result.id === patientId) || {});
        setEditedGroupe(searchResults.find((result) => result.id === patientId)?.groupe || '');
    };

    const clearFilters = () => {
        setCollapsedItems([]);
        setSearchResults(originalData);
        setSearchTerm('');
        setFilterDate(null);
        setSearchClicked(false);
    };

    const handleSaveEdit = async () => {
        try {
            const updatedPatient = await updatePatientById(editedData.id, {
                ...editedData,
                groupe: editedGroupe,
            });

            setSearchResults((prevSearchResults) =>
                prevSearchResults.map((patient) =>
                    patient.id === updatedPatient.id ? updatedPatient : patient
                )
            );

            setOriginalData((prevOriginalData) =>
                prevOriginalData.map((patient) =>
                    patient.id === updatedPatient.id ? updatedPatient : patient
                )
            );

            setExpandedMap((prevMap) => {
                const newMap = new Map(prevMap);
                newMap.set(updatedPatient.id, false);
                return newMap;
            });

            setIsEditingMap((prevMap) => {
                const newMap = new Map(prevMap);
                newMap.set(updatedPatient.id, false);
                return newMap;
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    };

    const handleDeletePatient = async (patientId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this patient?');

        if (confirmDelete) {
            try {
                await deletePatientById(patientId);

                const updatedData = searchResults.filter((patient) => patient.id !== patientId);
                setOriginalData(updatedData);
                setSearchResults(updatedData);
            } catch (error) {
                console.error('Error deleting patient:', error);
            }
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCancelEdit = (patientId) => {
        setIsEditingMap((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set(patientId, false);
            return newMap;
        });

        setEditedIndex(null);
        setEditedData({});
        setEditedGroupe('');
    };

    const handleInputChange = (field, value) => {
        if (field === 'groupe') {
            setEditedGroupe(value);
        } else {
            setEditedData((prevData) => ({
                ...prevData,
                [field]: value,
            }));
        }
    };

    const handleGroupDataButtonClick = (groupName) => {
        localStorage.setItem("groupName", groupName);
        navigate("/group-results");
    };

    const renderDetails = (result, index) => (
        <>
            <p className='mb-0'>
                <strong>Additional details for {result.fullname}:</strong>
            </p>
            <p className='mb-0'>Date of Birth: {result.birthDate}</p>
            <p className='mb-0'>Strong hand: {result.strongHand}</p>
            <p className='mb-0'>Groupe: {editedIndex === index ? editedGroupe : result.groupe}</p>
            <p className='mb-0'>Has diseases: {result.hasDiseases ? 'Yes' : 'No'}</p>
            {result.hasDiseases && <p className='mb-0'>Diseases: {result.diseases}</p>}
            <div className='d-flex justify-content-between mt-3'>
                <span className='badge badge-info'>Experiment taken on: {result.expDate}</span>
            </div>
            <div className='mt-3'>
                <button
                    className='btn btn-primary'
                    onClick={() => handleViewDetails(result.fullname, result.id)}
                >
                    View Data
                </button>
            </div>
            <div className='mt-3'>
                <button
                    className='btn btn-primary'
                    onClick={() => handleModifyData(result.fullname, result.id)}
                >
                    Modify/Display Data
                </button>
            </div>
        </>
    );

    const renderEditFields = () => (
        <>
            <input
                type='text'
                value={editedData.fullname || ''}
                onChange={(e) => handleInputChange('fullname', e.target.value)}
                className='form-control mb-2'
                placeholder='Full Name'
            />
            <input
                type='text'
                value={editedData.birthDate || ''}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className='form-control mb-2'
                placeholder='Date of Birth'
            />
            <input
                type='text'
                value={editedData.strongHand || ''}
                onChange={(e) => handleInputChange('strongHand', e.target.value)}
                className='form-control mb-2'
                placeholder='Strong Hand'
            />
            <div className='form-check mb-2'>
                <input
                    type='checkbox'
                    className='form-check-input'
                    checked={editedData.hasDiseases || false}
                    onChange={(e) => handleInputChange('hasDiseases', e.target.checked)}
                />
                <label className='form-check-label ml-2'>Has Diseases</label>
            </div>
            {editedData.hasDiseases && (
                <input
                    type='text'
                    value={editedData.diseases || ''}
                    onChange={(e) => handleInputChange('diseases', e.target.value)}
                    className='form-control mb-2'
                    placeholder='Diseases'
                />
            )}
            <input
                type='text'
                value={editedGroupe || ''}
                onChange={(e) => handleInputChange('groupe', e.target.value)}
                className='form-control mb-2'
                placeholder='Groupe'
            />
        </>
    );

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const renderGroupedPatients = () => {
        const groupedPatients = groupPatientsByGroupe();

        const startIndex = (currentPage - 1) * groupsPerPage;
        const endIndex = startIndex + groupsPerPage;

        const groupsToDisplay = Object.keys(groupedPatients).slice(startIndex, endIndex);

        return groupsToDisplay.map((group, groupIndex) => (
            <div key={groupIndex} className='custom-group'>
                <div className="group-title" style={{ display: 'flex', alignItems: 'center' }}>
                    <h3>{group}</h3>
                    <div style={{ paddingTop: '30px', marginLeft: '80%' }}>
                        <button className='btn btn-dark' onClick={() => handleGroupDataButtonClick(group)}>
                            Group Data
                        </button>
                    </div>
                </div>
                <ul className='list-group m-5'>
                    {groupedPatients[group].map((result, resultIndex) => (
                        <li key={resultIndex} className='list-group-item custom-list-item pb-3 mb-2'>
                            <div className='d-flex w-100 justify-content-between align-items-center'>
                                <h5 className='mb-1'>
                                    {isEditingMap.get(result.id) ? renderEditFields() : result.fullname}
                                </h5>
                                <div className='d-flex'>
                                    {isEditingMap.get(result.id) ? (
                                        <>
                                            <button className='btn btn-success mr-2' onClick={handleSaveEdit}>
                                                Save
                                            </button>
                                            <button
                                                className='btn btn-secondary'
                                                onClick={() => handleCancelEdit(result.id)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className={`btn ${expandedMap.get(result.id) ? 'btn-info' : 'btn-secondary'}`}
                                            aria-expanded={expandedMap.get(result.id)}
                                            onClick={() => toggleCollapse(result.id)}
                                        >
                                            Details
                                        </button>
                                    )}
                                    <button
                                        className='btn btn-warning ml-2'
                                        onClick={() => handleEditPatient(result.id)}
                                        disabled={isEditingMap.get(result.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className='btn btn-danger ml-2'
                                        onClick={() => handleDeletePatient(result.id)}
                                        disabled={isEditingMap.get(result.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div
                                id={`detailsCollapse${result.id}`}
                                className={`collapse ${expandedMap.get(result.id) ? 'show' : ''} collapsed-box`}
                            >
                                {isEditingMap.get(result.id) ? renderEditFields() : renderDetails(result, resultIndex)}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        ));
    };

    return (
        <div className="container-bg">
            <Navbar />
            {loading ? (
                <Spinner />
            ) : (
                <div className='search-container'>
                    <h1 className='title-search'>Patients List</h1>
                    <div className='input-group mb-3'>
                        <input
                            type='text'
                            className='form-control custom-search-input'
                            placeholder='Search...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className='input-group-append'>
                            <button
                                className='btn btn-primary custom-search-button btn-cd'
                                type='button'
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                            <input
                                type='date'
                                className='form-control ml-2'
                                value={filterDate || ''}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                            <button className='btn btn-secondary btn-cd' onClick={clearFilters}>
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className='custom-list'>
                {loading ? (
                    // Show nothing or loading indicator while fetching data
                    null
                ) : searchClicked && searchResults.length === 0 ? (
                    <p className='no-result-text'>No results found.</p>
                ) : (
                    renderGroupedPatients()
                )}

                <div className="bottom-absolute">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default PatientList;
