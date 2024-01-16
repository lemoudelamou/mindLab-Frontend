import React, {useState, useEffect, useCallback} from 'react';
import {getPatientByFullnameAndId} from '../../Api/Api';
import Navbar from '../Navbar/Navbar';
import Spinner from '../../utils/Spinner';
import '../../style/Data.css';
import {Bar, Line, Pie} from "react-chartjs-2";
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
    const [correctnessData, setCorrectnessData] = useState({ correct: 0, incorrect: 0});


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


                    // Count correct and incorrect reactions using reduce
                    setCorrectnessData(  rawData.reduce((acc, curr) => {
                        acc[curr.category] = (acc[curr.category] || 0) + 1;
                        return acc;
                    }, {}));



                    console.log("correctness", correctnessData);

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

    const preparePieChartData = () => {
        return {
            labels: ['Correct', 'Incorrect'],
            datasets: [
                {
                    data: [correctnessData.correct, correctnessData.incorrect],
                    backgroundColor: ['#36A2EB', '#FF6384', '#7C7F7E'],
                    hoverBackgroundColor: ['#36A2EB', '#FF6384', '#7C7F7E'],
                },
            ],
        };
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

    const renderContent = useCallback(() => {
        if (loading) {
            return (
                <div className='text-center mt-5'>
                    <Spinner />
                </div>
            );
        }

        if (Array.isArray(data) && data.length > 0) {
            return (
                <>
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
                    <Row>
                        <Col md={6}>
                    <div>
                        <h2>Chart Type</h2>
                        <select className='form-select' value={chartType} onChange={(e) => setChartType(e.target.value)}>
                            <option value='bar'>Bar Chart</option>
                            <option value='line'>Line Chart</option>
                        </select>
                    </div>

                    <div className='chart-container-wrapper'>
                        <div
                            id='chart-container'
                            className={`diag-box ${isFullscreen ? 'fullscreen' : ''}`}
                            onClick={(e) => toggleFullscreen(e)}
                        >
                            {renderChart()}
                        </div>
                    </div>
                        </Col>
                        <Col md={6}>
                            <div className="pie-chart-container">
                                <h2>Response Distribution</h2>
                                <Pie data={preparePieChartData()} />
                            </div>
                        </Col>
                    </Row>
                </>
            );
        }

        return <p className='no-data-message'>No data available for the selected gender</p>;
    }, [loading, data, isFullscreen, chartType, xAxisMin, xAxisMax, yAxisMin, yAxisMax]);


    return (
        <div className='data-container'>
            <Navbar />
            <h1 className='title-data'>Visualisation {fullname}</h1>
            <div className='sec'>
                <Row>
                    <Col>
                        <div>
                            <label htmlFor='genderSelect' className='form-label'>
                                Select Gender:
                            </label>
                            <select
                                id='genderSelect'
                                className='form-select narrow-select'
                                value={selectedGender}
                                onChange={(e) => setSelectedGender(e.target.value)}
                            >
                                <option value='all'>All</option>
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                                <option value='Other'>Other</option>
                            </select>
                        </div>

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

                        {renderContent()}
                    </Col>
                </Row>
            </div>
        </div>
    );
};
export default PatientResults;
