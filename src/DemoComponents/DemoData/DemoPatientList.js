import React, {useEffect, useState} from 'react';
import '../../style/PatientList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from '../../utils/Pagination';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';

const PatientList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [collapsedItems, setCollapsedItems] = useState([]);
    const [filterDate, setFilterDate] = useState(null);
    const [searchClicked, setSearchClicked] = useState(false);
    const [isEditingMap, setIsEditingMap] = useState(new Map());
    const [editedIndex, setEditedIndex] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [editedGroupe, setEditedGroupe] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [groupsPerPage] = useState(5);
    const navigate = useNavigate();

    const dummyPatients = [
        { id: 1, fullname: 'Johny Depp', birthDate: '1990-01-01', strongHand: 'Left', gender: 'Male', groupe: 's1', expDate: '2023-01-01' },
        { id: 2, fullname: 'Bob Marley', birthDate: '1985-05-15', strongHand: 'Left', gender: 'Male', groupe: 's2', expDate: '2023-01-15' },
        { id: 3, fullname: 'Tom Cruise', birthDate: '1982-09-30', strongHand: 'Left', gender: 'Male', groupe: 's3', expDate: '2023-02-01' },
        // Add more dummy data as needed
    ];

    const setDummyData = () => {
        const initialCollapsedState = Array(dummyPatients.length).fill(true);
        setCollapsedItems(initialCollapsedState);
        setSearchResults(dummyPatients);
    };

    useEffect(() => {
        setDummyData();
    }, []);

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

    const handleDeletePatient = (patientId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this patient?');

        if (confirmDelete) {
            // Assuming you want to update the dummyPatients array
            const updatedData = dummyPatients.filter((patient) => patient.id !== patientId);
            setCollapsedItems([]);
            setSearchResults(updatedData);
        }
    };

    const handleSearch = () => {
        const filteredItems = dummyPatients.filter(
            (item) =>
                item.fullname.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (!filterDate || item.expDate === filterDate)
        );

        setSearchResults(filteredItems);
        setSearchClicked(true);
    };

    const clearFilters = () => {
        setCollapsedItems([]);
        setSearchResults(dummyPatients);
        setSearchTerm('');
        setFilterDate(null);
        setSearchClicked(false);
    };

    const totalPages = Math.ceil(Object.keys(groupPatientsByGroupe()).length / groupsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleInputChange = (field, value) => {
        setEditedData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSaveChanges = () => {
        // Implement the logic to save changes
        // For example, update the dummyPatients array
        const updatedData = dummyPatients.map((patient) =>
            patient.id === editedIndex ? { ...patient, ...editedData, groupe: editedGroupe } : patient
        );

        setCollapsedItems([]);
        setSearchResults(updatedData);
        setIsEditingMap(new Map());
        setEditedIndex(null);
        setEditedData({});
        setEditedGroupe('');
    };

    const handleCancelEdit = () => {
        // Implement the logic to cancel the edit
        setIsEditingMap(new Map());
        setEditedIndex(null);
        setEditedData({});
        setEditedGroupe('');
    };

    const handleModifyData = (fullname , patientById) => {

        localStorage.setItem("DemoFullname", fullname);
        localStorage.setItem("DemoPatientById", patientById)

        navigate(`/demo-modify-patient-data`);
    };

    const handleGroupDataButtonClick = (groupName) => {
        localStorage.setItem("DemoGroup", groupName);
        navigate('/demo-group-results');
    };

    const handleViewDetails = (fullname) => {
        // Store the fullname in localStorage
        localStorage.setItem('demoFullname', fullname);
        // Navigate to the details page
        navigate('/demo-patient-results'); // Replace 'details-page' with the actual path of your details page
    };

    const renderEditFields = (result) => (
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
                value={editedData.strongHand || ''}
                onChange={(e) => handleInputChange('strongHand', e.target.value)}
                className='form-control mb-2'
                placeholder='Strong Hand'
            />
            <input
                type='text'
                value={editedData.groupe || ''}
                onChange={(e) => handleInputChange('groupe', e.target.value)}
                className='form-control mb-2'
                placeholder='Groupe'
            />
            <div className='form-check mb-2'>
                <input
                    type='checkbox'
                    className='form-check-input'
                    id='hasDiseases'
                    checked={editedData.hasDiseases || false}
                    onChange={(e) => handleInputChange('hasDiseases', e.target.checked)}
                />
                <label className='form-check-label' htmlFor='hasDiseases'>
                    Has Diseases
                </label>
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
        </>
    );


    const renderGroupedPatients = () => {
        const groupedPatients = groupPatientsByGroupe();

        const startIndex = (currentPage - 1) * groupsPerPage;
        const endIndex = startIndex + groupsPerPage;

        const groupsToDisplay = Object.keys(groupedPatients).slice(startIndex, endIndex);

        return groupsToDisplay.map((group, groupIndex) => (
            <div key={groupIndex} className='custom-group'>
                <div className='group-title' style={{ display: 'flex', alignItems: 'center' }}>
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
                            {/* Render patient details here */}
                            <div className='d-flex w-100 justify-content-between align-items-center'>
                                <h5 className='mb-1'>
                                    {isEditingMap.get(result.id) ? renderEditFields(result) : result.fullname}
                                </h5>
                                <div className='d-flex'>
                                    <button
                                        className={`btn ${collapsedItems[groupIndex] ? 'btn-secondary' : 'btn-info'}`}
                                        onClick={() => {
                                            const newCollapsedItems = [...collapsedItems];
                                            newCollapsedItems[groupIndex] = !collapsedItems[groupIndex];
                                            setCollapsedItems(newCollapsedItems);
                                        }}
                                    >
                                        {collapsedItems[groupIndex] ? 'Details' : 'Hide'}
                                    </button>
                                    {isEditingMap.get(result.id) ? (
                                        <>
                                            <button
                                                className='btn btn-success ml-2'
                                                onClick={handleSaveChanges}
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                className='btn btn-secondary ml-2'
                                                onClick={handleCancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
                                </div>
                            </div>
                            {!collapsedItems[groupIndex] && (

                                <div className='details-container collapsed-box'>

                                    <p className='mb-0'>
                                        <strong>Additional details for {result.fullname}:</strong>
                                    </p>
                                    <p className='mb-0'>Date of Birth: {result.birthDate}</p>
                                    <p className='mb-0'>Strong hand: {result.strongHand}</p>
                                    <p className='mb-0'>Groupe: {result.groupe}</p>
                                    <p className='mb-0'>Has diseases: {result.hasDiseases ? 'Yes' : 'No'}</p>
                                    {result.hasDiseases && <p className='mb-0'>Diseases: {result.diseases}</p>}
                                    <div className='d-flex justify-content-between mt-3'>
                                        <span className='badge badge-info'>Experiment taken on: {result.expDate}</span>
                                    </div>
                                    <div className='mt-3'>
                                        {/* Pass the fullname to the handleViewDetails function */}
                                        <button
                                            className='btn btn-primary'
                                            onClick={() => handleViewDetails(result.fullname)}
                                        >
                                            View Details
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
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        ));
    };

    return (
        <div className='container-bg'>
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
                        <button className='btn btn-primary custom-search-button btn-cd' type='button' onClick={handleSearch}>
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

                <div className='bottom-absolute'>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            </div>
        </div>
    );
};

export default PatientList;
