import React, {useEffect, useState} from 'react';
import crossfilter from 'crossfilter';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Bar, Line, Doughnut} from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import {useLocation} from 'react-router-dom';
import Navbar from "../Componenets/Navbar";


import '../style/Data.css';

const DemoData = () => {
    const [data, setData] = useState([]);
    const [cf, setCrossfilter] = useState(null);
    const [categoryDimension, setCategoryDimension] = useState(null);
    const [chartType, setChartType] = useState('bar');
    const [xAxisMin, setXAxisMin] = useState('');
    const [xAxisMax, setXAxisMax] = useState('');
    const [yAxisMin, setYAxisMin] = useState('');
    const [yAxisMax, setYAxisMax] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);


    const location = useLocation();
    const resultData = location.state && location.state.resultData;

    useEffect(() => {
        if (resultData && resultData.reactionTimes) {
            const rawData = resultData.reactionTimes.map((item) => ({
                category: item.status,
                value: item.time,
            }));

            // Initialize Crossfilter
            const crossfilterInstance = crossfilter(rawData);
            console.log('result data in data: ', rawData);

            // Create dimensions and groups
            const dimension = crossfilterInstance.dimension((d) => d.category);

            setData(rawData);
            setCrossfilter(crossfilterInstance);
            setCategoryDimension(dimension);

            // Clean up on unmount
            return () => crossfilterInstance.remove();
        }
    }, [resultData])


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
        // Update state with the filtered data
        setData(categoryDimension.top(Infinity));
    };

    const clearFilters = () => {
        // Clear all filters
        cf && categoryDimension && categoryDimension.filterAll();
        // Update state with the unfiltered data
        setData(categoryDimension.top(Infinity));
    };

    // Function to calculate average reaction times
    const calculateAverage = () => {
        if (!Array.isArray(data) || data.length === 0) {
            return 0; // Return 0 if there is no data
        }

        const sum = data.reduce((accumulator, item) => accumulator + item.value, 0);
        return sum / data.length;
    };

    // Function to prepare data for the chart
    const prepareChartData = () => {
        if (!Array.isArray(data)) {
            return {labels: [], datasets: []}; // Return empty data
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


    // Chart options
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
                    stepSize: 5, // Customize the step size on the y-axis
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
            duration: 1500, // Customize the animation duration
        },
    };

    // Render the selected chart type
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

    // Function to render the table rows
    const renderTableRows = () => {
        if (!Array.isArray(data)) {
            return null;
        }

        // Calculate average reaction times
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
                    <td><strong>Average Reaction Time</strong></td>
                    <td>{averageReactionTime.toFixed(2)}</td>
                </tr>
            </>
        );
    };

    return (
        <div className='data-container'>
            <Navbar/>
            <h1 className='title-data'>Crossfilter</h1>
            <div className='sec'>
                {Array.isArray(data) && data.length > 0 ? (
                    <>
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
                            <h2>{chartType === 'bar' ? 'Bar Chart' : chartType === 'line' ? 'Line Chart' : 'Doughnut Chart'}</h2>
                            <div id='chart-container' className={`diag-box ${isFullscreen ? 'fullscreen' : ''}`}
                                 onClick={toggleFullscreen}>
                                {renderChart()}
                            </div>
                            <div>
                                <h2>Manual Scaling</h2>
                                <div className="form-group">
                                    <label>X-Axis Min:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={xAxisMin}
                                        onChange={(e) => setXAxisMin(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>X-Axis Max:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={xAxisMax}
                                        onChange={(e) => setXAxisMax(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Y-Axis Min:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={yAxisMin}
                                        onChange={(e) => setYAxisMin(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Y-Axis Max:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={yAxisMax}
                                        onChange={(e) => setYAxisMax(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="no-data-message">No data available</p>
                )}
            </div>
        </div>
    );
};

export default DemoData;