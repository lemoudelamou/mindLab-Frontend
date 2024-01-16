import React, {useState, useEffect, useCallback} from 'react';
import Spinner from '../../utils/Spinner';
import '../../style/GroupResults.css';
import {Bar, Line, Pie} from 'react-chartjs-2';
import {Col, Row} from 'react-bootstrap';
import crossfilter from 'crossfilter';
import Navbar from "../../Components/Navbar/Navbar";

const DemoPatientResults = () => {
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
    const [correctnessData, setCorrectnessData] = useState({ correct: 0, incorrect: 0});
    const demoFullname = localStorage.getItem("demoFullname");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const experimentsData = await import('../json/allData.json');
                console.log('fetched data: ', experimentsData.default);

                if (Array.isArray(experimentsData.default)) {
                    const matchingData = experimentsData.default.find(
                        (item) => item.patient && item.patient.fullname === demoFullname
                    );

                    if (matchingData) {
                        const reactionTimes = matchingData.reactionTimes;

                        // Count correct and incorrect reactions using reduce
                        setCorrectnessData( reactionTimes.reduce((acc, curr) => {
                            acc[curr.status] = (acc[curr.status] || 0) + 1;
                            return acc;
                        }, {}));

                        console.log('Correctness counts:', correctnessData);

                        const rawData = reactionTimes.map((reactionTime) => ({
                            category: reactionTime.status,
                            value: reactionTime.time,
                        }));

                        const crossfilterInstance = crossfilter(rawData);
                        const dimension = crossfilterInstance.dimension((d) => d.category);
                        const correctDimension = crossfilterInstance.dimension((d) => d.category === 'correct');
                        const incorrectDimension = crossfilterInstance.dimension((d) => d.category === 'incorrect');

                        setData(rawData);
                        setCrossfilter(crossfilterInstance);
                        setCategoryDimension(dimension);
                        setCorrectDimension(correctDimension);
                        setIncorrectDimension(incorrectDimension);

                        // Remove the crossfilter instance when the component is unmounted
                        return () => crossfilterInstance.remove();
                    } else {
                        // Patient not found, check local storage for demoResult
                        const storedDemoResult = JSON.parse(localStorage.getItem('DemoResultData'));
                        if (storedDemoResult && storedDemoResult.experiments) {
                            const reactionTimes = [];

                            // Iterate over experiments
                            Object.values(storedDemoResult.experiments).forEach((experiment) => {
                                // Check if the experiment has reactionTimes
                                if (experiment.reactionTimes && Array.isArray(experiment.reactionTimes)) {
                                    // Add each reaction time entry to the array
                                    reactionTimes.push(...experiment.reactionTimes.map((reactionTime) => ({
                                        category: reactionTime.status,
                                        value: reactionTime.time,
                                    })));
                                }
                            });

                            // Count correct and incorrect reactions using reduce
                            setCorrectnessData(  reactionTimes.reduce((acc, curr) => {
                                acc[curr.category] = (acc[curr.category] || 0) + 1;
                                return acc;
                            }, {}));

                            console.log('Correctness counts:', correctnessData);

                            // Set data if reactionTimes are present
                            if (reactionTimes.length > 0) {
                                const crossfilterInstance = crossfilter(reactionTimes);
                                const dimension = crossfilterInstance.dimension((d) => d.category);
                                const correctDimension = crossfilterInstance.dimension((d) => d.category === 'correct');
                                const incorrectDimension = crossfilterInstance.dimension((d) => d.category === 'incorrect');

                                setData(reactionTimes);
                                setCrossfilter(crossfilterInstance);
                                setCategoryDimension(dimension);
                                setCorrectDimension(correctDimension);
                                setIncorrectDimension(incorrectDimension);

                                // Remove the crossfilter instance when the component is unmounted
                                return () => crossfilterInstance.remove();
                            } else {
                                console.error('No reactionTimes found in storedDemoResult:', storedDemoResult);
                            }
                        } else {
                            console.error('Invalid or missing data in storedDemoResult:', storedDemoResult);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [demoFullname]);

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
        if (cf && categoryDimension) {
            categoryDimension.filter(category);
            const filteredData = categoryDimension.top(Infinity);
            setData(filteredData);
        }
    };

    const clearFilters = () => {
        if (cf && categoryDimension) {
            categoryDimension.filterAll();
            const allData = categoryDimension.top(Infinity);
            setData(allData);
        }
    };

    const calculateAverage = () => {
        if (!Array.isArray(data) || data.length === 0) {
            return 0;
        }

        const sum = data.reduce((accumulator, item) => accumulator + item.value, 0);
        return sum / data.length;
    };

    const preparePieChartData = () => {
        console.log('Correctness data:', correctnessData);

        return {
            labels: ['Correct', 'Incorrect'],
            datasets: [
                {
                    data: [correctnessData.correct, correctnessData.incorrect],
                    backgroundColor: ['#36A2EB', '#FF6384'],
                    hoverBackgroundColor: ['#36A2EB', '#FF6384'],
                },
            ],
        };
    };

    const prepareChartData = () => {
        if (!Array.isArray(data)) {
            return {labels: [], datasets: []};
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
                return <Bar data={prepareChartData()} options={chartOptions}/>;
            case 'line':
                return <Line data={prepareChartData()} options={chartOptions}/>;
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

    const renderContent = () => {
        if (loading) {
            return (
                <div className='text-center mt-5'>
                    <Spinner/>
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
                        <select className='form-select' value={chartType}
                                onChange={(e) => setChartType(e.target.value)}>
                            <option value='bar'>Bar Chart</option>
                            <option value='line'>Line Chart</option>
                        </select>
                    </div>

                    <div className='chart-container-wrapper'>
                        <div className={`diag-box ${isFullscreen ? 'fullscreen' : ''}`} onClick={toggleFullscreen}>
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
    };

    return (
        <div className='data-container'>
            <Navbar/>
            <h1 className='title-data'>Visualisation: {demoFullname}</h1>
            <div className='sec'>
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

                        {renderContent()}
                    </Col>
                </Row>
            </div>
        </div>

    );
};

export default DemoPatientResults;
