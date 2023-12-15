import React, { useState, useEffect } from 'react';
import { deletePatientById, getAllPatients, updatePatientById } from '../../Api/Api';
import Navbar from '../Navbar/Navbar';

import '../../style/PatientList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from "../../utils/Pagination";
import { useNavigate } from "react-router-dom";

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
    const [expandedIndex, setExpandedIndex] = useState(null);
    const navigate = useNavigate();

    // Function to group patients by 'groupe' field
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

    // Calculate the total number of pages based on the number of groups
    const totalPages = Math.ceil(Object.keys(groupPatientsByGroupe()).length / groupsPerPage);

    // Initialize collapsedItems and fetch data on component mount
    useEffect(() => {
        setCollapsedItems([]);
        fetchData();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [filterDate, currentPage, groupsPerPage]);

    const fetchData = async () => {
        try {
            const patientsData = await getAllPatients();
            const initialCollapsedState = Array(patientsData.length).fill(true);

            setCollapsedItems(initialCollapsedState);
            setOriginalData(patientsData); // Save the original data
            setSearchResults(patientsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
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

        // Store the original indices of search results
        const originalIndices = filteredItems.map((result) => originalData.indexOf(result));
        setOriginalIndices(originalIndices);
    };

    useEffect(() => {
        // Create a mapping between searchResults indices and originalData indices
        const indexMapping = mapSearchResultsToOriginalIndices(searchResults, originalData);
        setCollapsedItems(indexMapping.map(() => true)); // Initialize collapsed state
    }, [searchResults, originalData]);

    const toggleCollapse = (index) => {
        setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const clearFilters = () => {
        setCollapsedItems([]);
        setSearchResults(originalData); // Reset to the original data
        setSearchTerm('');
        setFilterDate(null);
        setSearchClicked(false);
    };

    const handleEditPatient = (index) => {
        setEditedIndex(index);
        setEditedData({ ...searchResults[index] });
        setEditedGroupe(searchResults[index].groupe || ''); // Set the initial edited value for groupe
    };

    const handleSaveEdit = async () => {
        try {
            const updatedPatient = await updatePatientById(editedData.id, {
                ...editedData,
                groupe: editedGroupe,
            });

            const updatedData = searchResults.map((patient, index) =>
                index === editedIndex ? updatedPatient : patient
            );

            setOriginalData(updatedData);
            setSearchResults(updatedData);

            // Reset edited state
            setEditedIndex(null);
            setEditedData({});
            setEditedGroupe('');
        } catch (error) {
            console.error('Error updating patient:', error);
            // Handle errors (e.g., show an error message)
        }
    };

    const handleDeletePatient = async (patientId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this patient?');

        if (confirmDelete) {
            try {
                await deletePatientById(patientId);

                // After successful deletion, update the state and re-fetch data
                const updatedData = searchResults.filter((patient) => patient.id !== patientId);
                setOriginalData(updatedData);
                setSearchResults(updatedData);
            } catch (error) {
                console.error('Error deleting patient:', error);
                // Handle errors (e.g., show an error message)
            }
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCancelEdit = () => {
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
        console.log(`Clicked on Group Data for group:`, groupName);
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
            {/* New input for editing "groupe" */}
            <input
                type='text'
                value={editedGroupe || ''}
                onChange={(e) => handleInputChange('groupe', e.target.value)}
                className='form-control mb-2'
                placeholder='Groupe'
            />
        </>
    );

    // Logic to display page numbers and handle pagination
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }



    // Rendering function for grouped patients
    const renderGroupedPatients = () => {
        const groupedPatients = groupPatientsByGroupe();

        // Calculate the range of groups to display based on the current page and groupsPerPage
        const startIndex = (currentPage - 1) * groupsPerPage;
        const endIndex = startIndex + groupsPerPage;

        // Slice the groupedPatients object into an array of groups to display
        const groupsToDisplay = Object.keys(groupedPatients).slice(startIndex, endIndex);

        return groupsToDisplay.map((group, groupIndex) => (
            <div key={groupIndex} className='custom-group'>
                <div className="group-title" style={{ display: 'flex', alignItems: 'center' }}>
                    <h3>{group}</h3>
                    <div style={{ paddingTop: '30px', marginLeft: '80%' }}>
                        <button className='btn btn-dark'
                                onClick={() => handleGroupDataButtonClick(group)}
                        >
                            Group Data
                        </button>
                    </div>
                </div>
                <ul className='list-group m-5'>
                    {groupedPatients[group].map((result, index) => (
                        <li key={index} className='list-group-item custom-list-item pb-3 mb-2'>
                            <div className='d-flex w-100 justify-content-between align-items-center'>
                                <h5 className='mb-1'>
                                    {editedIndex === index ? renderEditFields() : result.fullname}
                                </h5>
                                <div className='d-flex'>
                                    {editedIndex === index ? (
                                        <>
                                            <button className='btn btn-success mr-2' onClick={handleSaveEdit}>
                                                Save
                                            </button>
                                            <button className='btn btn-secondary' onClick={handleCancelEdit}>
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className={`btn ${expandedIndex === index ? 'btn-info' : 'btn-secondary'}`}
                                            onClick={() => toggleCollapse(index)}
                                            style={{ cursor: 'pointer' }}
                                            data-toggle={`#detailsCollapse${index}`}
                                            aria-expanded={expandedIndex === index}
                                        >
                                            Details
                                        </button>
                                    )}
                                    <button
                                        className='btn btn-warning ml-2'
                                        onClick={() => handleEditPatient(index, result.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className='btn btn-danger ml-2'
                                        onClick={() => handleDeletePatient(result.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div
                                id={`detailsCollapse${index}`}
                                className={`collapse ${expandedIndex === index ? 'show' : ''} collapsed-box`}
                            >
                                {editedIndex === index ? renderEditFields() : renderDetails(result, index)}
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
            <div className='custom-list'>
                {searchClicked && searchResults.length === 0 ? (
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
