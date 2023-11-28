import React, { useEffect, useState } from 'react';
import crossfilter from 'crossfilter';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

import '../style/Data.css';

const Data = () => {
  const [data, setData] = useState([]);
  const [cf, setCrossfilter] = useState(null);
  const [categoryDimension, setCategoryDimension] = useState(null);
  const [chartType, setChartType] = useState('bar'); // Default chart type is bar

  useEffect(() => {
    // Sample data
    const rawData = [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
      { category: 'A', value: 15 },
      { category: 'B', value: 25 },
      // Add more data as needed
    ];

    // Initialize Crossfilter
    const crossfilterInstance = crossfilter(rawData);

    // Create dimensions and groups
    const dimension = crossfilterInstance.dimension((d) => d.category);

    // Set the state
    setData(rawData);
    setCrossfilter(crossfilterInstance);
    setCategoryDimension(dimension);

    // Clean up on unmount
    return () => crossfilterInstance.remove();
  }, []);

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

  // Function to prepare data for the chart
  const prepareChartData = () => {
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

  // Function to prepare data for the doughnut chart
  const prepareDoughnutData = () => {
    return {
      labels: data.map((item) => item.category),
      datasets: [
        {
          data: data.map((item) => item.value),
          backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'],
          hoverBackgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)'],
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    scales: {
      x: {
        type: 'category',
        labels: data.map((item) => item.category),
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
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
    switch (chartType) {
      case 'bar':
        return <Bar data={prepareChartData()} options={chartOptions} />;
      case 'line':
        return <Line data={prepareChartData()} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={prepareDoughnutData()} options={chartOptions} />;
      default:
        return null;
    }
  };

  // Function to render the table rows
  const renderTableRows = () => {
    return data.map((item, index) => (
      <tr key={index}>
        <td>{item.category}</td>
        <td>{item.value}</td>
      </tr>
    ));
  };

  return (
    <div className='data-container'>
      <div className='sec'>
        <h1>Crossfilter(Example)</h1>
        <div>
          <button className='btn btn-primary' onClick={() => filterData('A')}>
            Filter A
          </button>
          <button className='btn btn-primary' onClick={() => filterData('B')}>
            Filter B
          </button>
          <button className='btn btn-secondary' onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
        <div>
          <h2>Data Table</h2>
          <table className='table table-bordered'>
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
            <option value='doughnut'>Doughnut Chart</option>
          </select>
        </div>
        <div>
          <h2>{chartType === 'bar' ? 'Bar Chart' : chartType === 'line' ? 'Line Chart' : 'Doughnut Chart'}</h2>
          {renderChart()}
        </div>
        
      </div>
    </div>
  );
};

export default Data;
