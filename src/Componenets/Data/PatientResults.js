import React, { useState, useEffect } from 'react';
import {fetchDataByGender, getExperimentsData, getPatientByFullnameAndId} from '../../Api/Api';
import Navbar from '../Navbar/Navbar';
import Spinner from '../../utils/Spinner';
import '../../style/GroupResults.css';
import {Bar, Line} from "react-chartjs-2";
import {Col, Row} from "react-bootstrap";
import crossfilter from "crossfilter";

const PatientResults = () => {
    const fullname = localStorage.getItem('fullname'); // Change 'groupName' to 'fullname'
    const patientId = localStorage.getItem("patientById");
    const [data, setData] = useState([]);
    const [cf, setCrossfilter] = useState(null);
    const [categoryDimension, setCategoryDimension] = useState(null);
    const [correctDimension, setCorrectDimension] = useState(null);
    const [incorrectDimension, setIncorrectDimension] = useState(null);
    const [chartType, setChartType] = useState('bar');
    const [xAxisMin, setXAxisMin] = useState('');
    const [xAxisMax, setXAxisMax] = useState('');
    const [yAxisMin, setYAxisMin] = useState('');
    const [yAxisMax, setYAxisMax] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedGender, setSelectedGender] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                let experimentsData;


                    experimentsData = await getPatientByFullnameAndId(fullname, patientId);


                console.log('fetched data: ', experimentsData);

                if (Array.isArray(experimentsData)) {
                    const rawData = experimentsData.flatMap((item) =>
                        item.reactionTimes.map((reactionTime) => ({
                            category: reactionTime.status,
                            value: reactionTime.time,
                        }))
                    );

                    const crossfilterInstance = crossfilter(rawData);
                    const dimension = crossfilterInstance.dimension((d) => d.category);
                    const correctDimension = crossfilterInstance.dimension((d) => d.category === 'correct');
                    const incorrectDimension = crossfilterInstance.dimension((d) => d.category === 'incorrect');

                    setData(rawData);
                    setCrossfilter(crossfilterInstance);
                    setCategoryDimension(dimension);
                    setCorrectDimension(correctDimension);
                    setIncorrectDimension(incorrectDimension);

                    return () => crossfilterInstance.remove();
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedGender]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = () => {
        const chartContainer = document.getElementById('chart-container');

        if (chartContainer) {
            if (!isFullscreen) {
                if (chartContainer.requestFullscreen) {
                    chartContainer.requestFullscreen();
                } else if (chartContainer.mozRequestFullScreen) {
                    chartContainer.mozRequestFullScreen();
                } else if (chartContainer.webkitRequestFullscreen) {
                    chartContainer.webkitRequestFullscreen();
                } else if (chartContainer.msRequestFullscreen) {
                    chartContainer.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        }
    };

    const filterData = (category) => {
        cf && categoryDimension && categoryDimension.filter(category);
        setData(categoryDimension.top(Infinity));
    };

    const clearFilters = () => {
        cf && categoryDimension && categoryDimension.filterAll();
        setData(categoryDimension.top(Infinity));
    };


    const calculateAverage = () => {
        if (!Array.isArray(data) || data.length === 0) {
            return 0;
        }

        const sum = data.reduce((accumulator, item) => accumulator + item.value, 0);
        return sum / data.length;
    };

    const prepareChartData = () => {
        if (!Array.isArray(data)) {
            return { labels: [], datasets: [] };
        }

        const labels = data.map((item) => item.category);
        const values = data.map((item) => item.value);

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Value',
                    data: values,
                    backgroundColor: 'rgba(75,192,192,0.6)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    const chartOptions = {
        scales: {
            x: {
                type: 'category',
                labels: Array.isArray(data) ? data.map((item) => item.category) : [],
                beginAtZero: true,
                min: xAxisMin !== '' ? parseFloat(xAxisMin) : undefined,
                max: xAxisMax !== '' ? parseFloat(xAxisMax) : undefined,
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                min: yAxisMin !== '' ? parseFloat(yAxisMin) : undefined,
                max: yAxisMax !== '' ? parseFloat(yAxisMax) : undefined,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    stepSize: 10,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                displayColors: false,
            },
        },
        animation: {
            duration: 1500,
        },
    };

    const renderChart = () => {
        if (!Array.isArray(data)) {
            return null;
        }

        switch (chartType) {
            case 'bar':
                return <Bar data={prepareChartData()} options={chartOptions} />;
            case 'line':
                return <Line data={prepareChartData()} options={chartOptions} />;
            default:
                return null;
        }
    };

    const renderTableRows = () => {
        if (!Array.isArray(data)) {
            return null;
        }

        const averageReactionTime = calculateAverage();

        return (
            <>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{item.category}</td>
                        <td>{item.value}</td>
                    </tr>
                ))}
                <tr>
                    <td>
                        <strong>Average Reaction Time</strong>
                    </td>
                    <td>{averageReactionTime.toFixed(2)}</td>
                </tr>
            </>
        );
    };

    return (
        <div className='data-container'>
            <Navbar />
            <h1 className='title-data'>Crossfilter</h1>
            <div className='sec'>
                {loading ? (
                    <div className='text-center mt-5'>
                        <Spinner />
                    </div>
                ) : Array.isArray(data) && data.length > 0 ? (
                    <>
                        <Row>
                            <Col>

                                <div>
                                    <button className='btn btn-primary m-1' onClick={() => filterData('correct')}>
                                        correct
                                    </button>
                                    <button className='btn btn-primary m-1' onClick={() => filterData('incorrect')}>
                                        incorrect
                                    </button>
                                    <button className='btn btn-secondary m-1' onClick={clearFilters}>
                                        Clear Filters
                                    </button>
                                </div>
                                <div>
                                    <h2>Data Table</h2>
                                    <table className='table table-bordered table-container'>
                                        <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Value</th>
                                        </tr>
                                        </thead>
                                        <tbody>{renderTableRows()}</tbody>
                                    </table>
                                </div>

                                <div>
                                    <h2>Chart Type</h2>
                                    <select
                                        className='form-select'
                                        value={chartType}
                                        onChange={(e) => setChartType(e.target.value)}
                                    >
                                        <option value='bar'>Bar Chart</option>
                                        <option value='line'>Line Chart</option>
                                    </select>
                                </div>
                                <div>
                                    <h2>{chartType === 'bar' ? 'Bar Chart' : 'Line Chart'}</h2>
                                    <div
                                        id='chart-container'
                                        className={`diag-box ${isFullscreen ? 'fullscreen' : ''}`}
                                        onClick={toggleFullscreen}
                                    >
                                        {renderChart()}
                                    </div>
                                    <div>
                                        <h2>Manual Scaling</h2>
                                        <div className='form-group'>
                                            <label>X-Axis Min:</label>
                                            <input
                                                type='number'
                                                className='form-control'
                                                value={xAxisMin}
                                                onChange={(e) => setXAxisMin(e.target.value)}
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label>X-Axis Max:</label>
                                            <input
                                                type='number'
                                                className='form-control'
                                                value={xAxisMax}
                                                onChange={(e) => setXAxisMax(e.target.value)}
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label>Y-Axis Min:</label>
                                            <input
                                                type='number'
                                                className='form-control'
                                                value={yAxisMin}
                                                onChange={(e) => setYAxisMin(e.target.value)}
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label>Y-Axis Max:</label>
                                            <input
                                                type='number'
                                                className='form-control'
                                                value={yAxisMax}
                                                onChange={(e) => setYAxisMax(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <p className='no-data-message'>No data available</p>
                )}
            </div>
        </div>
    );
};
export default PatientResults;
