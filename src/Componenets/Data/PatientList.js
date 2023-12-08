import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../../style/PatientList.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import {getAllPatients} from '../../Api/Api';
import Navbar from "../Navbar/Navbar";


const PatientList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [collapsedItems, setCollapsedItems] = useState([]);
    const [filterDate, setFilterDate] = useState(null);
    const [searchClicked, setSearchClicked] = useState(false);
    const [filtersConfirmed, setFiltersConfirmed] = useState(false);


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

    const handleSearch = () => {
        const filteredItems = originalData.filter(
            (item) =>
                item.fullname.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (filterDate ? item.expDate === filterDate : true)
        );

        setSearchResults(filteredItems);
        setSearchClicked(true);
    };

    const toggleCollapse = (index) => {
        setCollapsedItems((prevCollapsedItems) => {
            const newCollapsedItems = [...prevCollapsedItems];
            newCollapsedItems[index] = !newCollapsedItems[index];
            return newCollapsedItems;
        });
    };

    const handleFilterDate = (date) => {
        setFilterDate(date);
    };

    const clearFilters = () => {
        setCollapsedItems([]);
        setSearchResults(originalData); // Reset to the original data
        setSearchTerm('');
        setFilterDate(null);
        setSearchClicked(false);
    };


    return (
        <div>
            <Navbar/>
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
                            onChange={(e) => handleFilterDate(e.target.value)}
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
                                    <h5 className='mb-1'>{result.fullname}</h5>
                                    <button
                                        className={`btn ${collapsedItems[index] ? 'btn-secondary' : 'btn-info'}`}
                                        onClick={() => toggleCollapse(index)}
                                        style={{cursor: 'pointer'}}
                                        data-toggle={`#detailsCollapse${index}`}
                                        aria-expanded={!collapsedItems[index]}
                                    >
                                        Details
                                    </button>
                                </div>
                                <div
                                    id={`detailsCollapse${index}`}
                                    className={`collapse ${collapsedItems[index] ? '' : 'show'} collapsed-box`}
                                >
                                    <p className='mb-0'>
                                        <strong>Additional details for {result.fullname}:</strong>
                                    </p>
                                    <p className='mb-0'>Date of Birth: {result.birthDate}</p>
                                    <p className='mb-0'>Strong hand: {result.strongHand}</p>
                                    <p className='mb-0'>Has diseases: {result.hasDiseases ? 'Yes' : 'No'}</p>
                                    {result.hasDiseases && (
                                        <p className='mb-0'>Diseases: {result.diseases}</p>
                                    )}
                                    {/* Add more patient information as needed */}
                                    <div className='d-flex justify-content-between mt-3'>
                                        <span className='badge badge-info'>
                                            Experiment taken on: {result.expDate}
                                        </span>
                                    </div>
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