import React, { useState, useEffect } from 'react';
import { getAllPatients, updatePatientById } from '../../Api/Api';
import Navbar from '../Navbar/Navbar';

import '../../style/PatientList.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const PatientList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [collapsedItems, setCollapsedItems] = useState([]);
    const [filterDate, setFilterDate] = useState(null);
    const [searchClicked, setSearchClicked] = useState(false);
    const [filtersConfirmed, setFiltersConfirmed] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedIndex, setEditedIndex] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [originalIndices, setOriginalIndices] = useState([]);


    // Initialize collapsedItems and fetch data on component mount
    useEffect(() => {
        setCollapsedItems([]);
        fetchData();
    }, []);

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
                (filterDate ? item.expDate === filterDate : true)
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
        setCollapsedItems((prevCollapsedItems) => {
            const newCollapsedItems = [...prevCollapsedItems];
            newCollapsedItems[index] = !newCollapsedItems[index];
            return newCollapsedItems;
        });
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
    };

    const handleSaveEdit = async () => {
        try {
            const updatedPatient = await updatePatientById(
                editedData.id,
                editedData
            );

            const updatedData = searchResults.map((patient, index) =>
                index === editedIndex ? updatedPatient : patient
            );

            setOriginalData(updatedData);
            setSearchResults(updatedData);

            setEditedIndex(null);
            setEditedData({});
        } catch (error) {
            console.error('Error updating patient:', error);
            // Handle errors (e.g., show an error message)
        }
    };

    const handleCancelEdit = () => {
        setEditedIndex(null);
        setEditedData({});
    };

    const handleInputChange = (field, value) => {
        setEditedData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const renderDetails = (result, index) => (
        <>
            <p className='mb-0'>
                <strong>Additional details for {result.fullname}:</strong>
            </p>
            <p className='mb-0'>Date of Birth: {result.birthDate}</p>
            <p className='mb-0'>Strong hand: {result.strongHand}</p>
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
        </>
    );


    return (
        <div>
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
                <ul className='list-group m-5'>
                    {searchClicked && searchResults.length === 0 ? (
                        <p className='no-result-text'>No results found.</p>
                    ) : (
                        searchResults.map((result, index) => (
                            <li key={index} className='list-group-item custom-list-item pb-3 mb-2'>
                                <div className='d-flex w-100 justify-content-between align-items-center'>
                                    <h5 className='mb-1'>
                                        {editedIndex === index ? (
                                            renderEditFields()
                                        ) : (
                                            result.fullname
                                        )}
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
                                                className={`btn ${
                                                    collapsedItems[index] ? 'btn-secondary' : 'btn-info'
                                                }`}
                                                onClick={() => toggleCollapse(index)}
                                                style={{ cursor: 'pointer' }}
                                                data-toggle={`#detailsCollapse${index}`}
                                                aria-expanded={!collapsedItems[index]}
                                            >
                                                Details
                                            </button>
                                        )}
                                        <button
                                            className='btn btn-warning ml-2'
                                            onClick={() => {
                                                console.log('Result Object:', result);
                                                handleEditPatient(index, result.id);
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                                <div
                                    id={`detailsCollapse${index}`}
                                    className={`collapse ${collapsedItems[index] ? '' : 'show'} collapsed-box`}
                                >
                                    {editedIndex === index ? renderEditFields() : renderDetails(result, index)}
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default PatientList;
