import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

// Sample dataset for the last 6 months
const dataset = [
  { month: 'Jan', value: 420 },
  { month: 'Feb', value: 350 },
  { month: 'Mar', value: 280 },
  { month: 'Apr', value: 520 },
  { month: 'May', value: 600 },
  { month: 'Jun', value: 450 },
];

const chartSetting = {
  yAxis: [
    {
      label: '', // Empty label as in your image
      min: 0,
      max: 600,
      tickInterval: 150, // Shows ticks at 0, 150, 300, 450, 600
    },
  ],
  height: 400,
  margin: { top: 20, right: 30, left: 20, bottom: 30 },
};

const Chart = () => {
  return (
    <div style={{ width: '100%' }}>
      {/* <h3>Last 6 months</h3> */}
      <BarChart
        dataset={dataset}
        xAxis={[
          { 
            dataKey: 'month',
            scaleType: 'band',
          }
        ]}
        series={[
          { 
            dataKey: 'value',
            color: '#1976d2', // MUI primary color
            label: '', // No series label needed
          }
        ]}
        {...chartSetting}
      />
    </div>
  );
}

export default Chart;