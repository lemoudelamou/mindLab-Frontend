import React, { useState, useEffect } from 'react';
import '../style/PatientList.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Navbar from "../Componenets/Navbar";


const DemoPatientList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [collapsedItems, setCollapsedItems] = useState([]);
    const [filterDate, setFilterDate] = useState(null);
    const [searchClicked, setSearchClicked] = useState(false);


    // Dummy data for demonstration
    const dummyData = [
        { fullname: 'John Doe', expDate: '2023-12-15', strongHand: 'Left' },
        { fullname: 'Jane Doe', expDate: '2023-12-18', strongHand: 'Left', hasDiseases: 'Yes', diseases: 'Parkinson, Diabetes' },
        // Add more dummy entries as needed
    ];

    // Fetch data from the server when the component mounts
    useEffect(() => {
        // Comment or remove this block
        /*
        const fetchData = async () => {
            try {
                const patientsData = await getAllPatients();
                const initialCollapsedState = Array(patientsData.length).fill(true);

                setCollapsedItems(initialCollapsedState);
                setSearchResults(patientsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        */

        // Use dummy data for demonstration
        const initialCollapsedState = Array(dummyData.length).fill(true);

        setCollapsedItems(initialCollapsedState);
        setSearchResults(dummyData);
    }, []);

    const handleSearch = () => {
        const filteredItems = searchResults.filter(
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

    const clearFilters = async () => {
        try {
            const patientsData = dummyData
            const initialCollapsedState = Array(patientsData.length).fill(true);

            setCollapsedItems(initialCollapsedState);
            setSearchResults(patientsData);
            setSearchTerm('');
            setFilterDate(null);
            setSearchClicked(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };





    return (
        <div>
            <Navbar />
            <div className='search-container'>
                <h1 className='title-search'>Experiment List</h1>
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
                            max={new Date().toISOString().split('T')[0]}
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
                                        style={{ cursor: 'pointer' }}
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
                                    {/* Additional content or details here */}
                                    <p className='mb-0'>Additional details for {result.fullname}</p>
                                    <p className='mb-0'>Date of Birth: {result.birthDate}</p>
                                    <p className='mb-0'>Strong hand: {result.strongHand}</p>
                                    <p className='mb-0'>Has diseases: {result.hasDiseases ? 'Yes' : 'No'}</p>
                                    {result.hasDiseases && (
                                        <p className='mb-0'>Diseases: {result.diseases}</p>
                                    )}
                                    <div className='d-flex justify-content-between mt-3'>
                                        <span className='badge badge-info'>
                                            Date: {result.expDate}
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

export default DemoPatientList;

