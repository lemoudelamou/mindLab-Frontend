import React, { useState, useEffect } from 'react';
import {deletePatientById, getAllPatientByDoctorId, getAllPatients, updatePatientById} from '../../Api/Api';
import Navbar from '../Navbar/Navbar';
import '../../style/List.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import Spinner from "../../utils/Spinner";
import {useAuth} from "../../utils/AuthContext";


const List = () => {
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
    const { userId, isLoggedIn, jwt, verify } = useAuth();


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
        if(isLoggedIn) {
            fetchData();
        }
    }, [isLoggedIn]); // Moved fetchData outside of setCollapsedItems to fetch data as soon as the component is mounted

    useEffect(() => {
        handleSearch();
    }, [filterDate, currentPage, groupsPerPage]);

    const fetchData = async () => {

        try {
            const patientsData = await getAllPatientByDoctorId(userId);
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



    const clearFilters = () => {
        setCollapsedItems([]);
        setSearchResults(originalData);
        setSearchTerm('');
        setFilterDate(null);
        setSearchClicked(false);
    };









    const renderGroupedPatients = () => {
        const groupedPatients = groupPatientsByGroupe();


        const groupsToDisplay = Object.keys(groupedPatients);

        return groupsToDisplay.map((group, groupIndex) => (
            <div key={groupIndex} className='list-dash'>
                <ul>
                    {groupedPatients[group].map((result, resultIndex) => (
                        <li key={resultIndex} className='list-group-item-dash custom-list-item-dash'>
                            <div>
                                    <strong> Patient: </strong> {result.fullname}

                            </div>
                            <div>
                                {result.expDate}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        ));
    };

    return (
        <div className="centered-container-dash">
            <Navbar />
            {loading ? (
                <Spinner />
            ) : (
                <div className='search-container-dash'>
                    <h1 className='title-search-dash'>Patients List</h1>
                    <div className='input-group mb-3'>
                        <input
                            type='text'
                            className='form-control custom-search-input-dash'
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

            <div className='custom-list-dash'>
                {loading ? (
                    // Show nothing or loading indicator while fetching data
                    null
                ) : searchClicked && searchResults.length === 0 ? (
                    <p className='no-result-text-dash'>No results found.</p>
                ) : (
                    renderGroupedPatients()
                )}


            </div>
        </div>
    );
};

export default List;
