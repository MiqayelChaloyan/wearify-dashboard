import { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


const chartSetting = {
  yAxis: [{ label: '', min: 0, tickInterval: 1 }],
  height: 400,
  margin: { top: 20, right: 30, left: 20, bottom: 30 },
};

const displayNames = {
  All: "All Products",
  NNarev: "Arev",
  NNbow: "Bow",
  NNlialusin: "Lialusin",
  NNsaturday: "Saturday",
  NNwednesday: "Wednesday",
  kateel1: "Kateel"
};

const colorPalette = [
  '#1976d2',   // Blue
  'rgba(255, 167, 38, 0.6)',   // Orange (#FFA726)
  'rgba(255, 238, 88, 0.6)',   // Yellow (#FFEE58)
  'rgba(102, 187, 106, 0.6)',  // Green (#66BB6A)
  'rgba(38, 198, 218, 0.6)',   // Cyan (#26C6DA)
  'rgba(66, 165, 245, 0.6)',   // Blue (#42A5F5)
  'rgba(171, 71, 188, 0.6)',   // Purple (#AB47BC)
  'rgba(236, 64, 122, 0.6)',   // Rose (#EC407A)
];

const Chart = ({ chartData }) => {
  const [currentGrouping, setCurrentGrouping] = useState('week'); // day / week / month
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedItems, setSelectedItems] = useState(['All']);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [chartDataset, setChartDataset] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (chartData) {
      const products = ['All', ...Object.keys(chartData)];
      setAvailableProducts(products);
    }
  }, [chartData]);

  useEffect(() => {
    updateChart();
  }, [chartData, currentGrouping, startDate, endDate, selectedItems]);

  const groupByDay = (timestamps) => {
    const dayMap = {};
    timestamps.forEach(ts => {
      const date = new Date(ts);
      const dayKey = date.toISOString().split('T')[0];
      if (!dayMap[dayKey]) {
        dayMap[dayKey] = { count: 0, start: dayKey, end: dayKey };
      }
      dayMap[dayKey].count++;
    });
    return dayMap;
  };

  const groupByWeek = (timestamps) => {
    const weekMap = {};
    timestamps.forEach(ts => {
      const d = new Date(ts);
      const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

      const dayNum = date.getUTCDay() || 7;
      date.setUTCDate(date.getUTCDate() + 4 - dayNum);
      const year = date.getUTCFullYear();
      const yearStart = new Date(Date.UTC(year, 0, 1));
      const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
      const weekStr = String(weekNo).padStart(2, '0');
      const weekKey = `${year}-W${weekStr}`;

      if (!weekMap[weekKey]) {
        const thursday = new Date(date);
        const monday = new Date(thursday);
        monday.setUTCDate(thursday.getUTCDate() - 3);
        const sunday = new Date(monday);
        sunday.setUTCDate(monday.getUTCDate() + 6);

        weekMap[weekKey] = {
          count: 0,
          start: monday.toISOString().split('T')[0],
          end: sunday.toISOString().split('T')[0]
        };
      }
      weekMap[weekKey].count++;
    });
    return weekMap;
  };

  const groupByMonth = (timestamps) => {
    const monthMap = {};
    timestamps.forEach(ts => {
      const d = new Date(ts);
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const monthKey = `${y}-${m}`;

      if (!monthMap[monthKey]) {
        const startStr = `${y}-${m}-01`;
        const nextMonth = new Date(Date.UTC(y, d.getUTCMonth() + 1, 1));
        nextMonth.setUTCDate(0);
        const lastDay = nextMonth.getUTCDate();
        const endStr = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;
        monthMap[monthKey] = { count: 0, start: startStr, end: endStr };
      }
      monthMap[monthKey].count++;
    });
    return monthMap;
  };

  const getGroupedDataForProduct = (product) => {
    let timestamps = [];

    if (product === 'All') {
      const allKeys = Object.keys(chartData);
      allKeys.forEach(key => {
        timestamps = timestamps.concat(chartData[key] || []);
      });
    } else {
      timestamps = chartData[product] || [];
    }

    // Filter by date range
    let filtered = timestamps;
    if (startDate && endDate) {
      filtered = timestamps.filter(ts => {
        const dt = new Date(ts);
        return dt >= startDate && dt <= endDate;
      });
    }

    // Group by time period
    switch (currentGrouping) {
      case 'day':
        return groupByDay(filtered);
      case 'week':
        return groupByWeek(filtered);
      case 'month':
        return groupByMonth(filtered);
      default:
        return {};
    }
  };

  const formatWeekRange = (startStr, endStr) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const opts = { month: 'short', day: 'numeric' };
    const sPart = start.toLocaleDateString(undefined, opts);
    const ePart = end.toLocaleDateString(undefined, opts);
    return `${sPart} - ${ePart}`;
  };

  const formatMonthRange = (startStr) => {
    const d = new Date(startStr);
    const opts = { month: 'short', year: 'numeric' };
    return d.toLocaleDateString(undefined, opts);
  };

  const updateChart = () => {
    if (!chartData || selectedItems.length === 0) {
      setChartDataset({ labels: [], datasets: [] });
      return;
    }

    const productMaps = {};
    selectedItems.forEach(prod => {
      productMaps[prod] = getGroupedDataForProduct(prod);
    });

    const labelSet = new Set();
    for (let prod of selectedItems) {
      for (let lbl of Object.keys(productMaps[prod])) {
        labelSet.add(lbl);
      }
    }

    const labelWithDates = [];
    labelSet.forEach(lbl => {
      let foundStart = null;
      for (let prod of selectedItems) {
        if (productMaps[prod][lbl]) {
          foundStart = productMaps[prod][lbl].start;
          break;
        }
      }
      labelWithDates.push([lbl, foundStart]);
    });
    labelWithDates.sort((a, b) => a[1].localeCompare(b[1]));

    const sortedLabels = labelWithDates.map(item => item[0]);

    const datasets = selectedItems.map((prod, idx) => {
      const groupingMap = productMaps[prod];
      const color = colorPalette[idx % colorPalette.length];

      return {
        id: prod,
        data: sortedLabels.map(lbl => groupingMap[lbl] ? groupingMap[lbl].count * 4 - 7 : 0),
        label: displayNames[prod] || prod,
        valueFormatter: (value) => Math.round((value + 7) / 4),
        color: color.replace('0.6', '1'),
      };
    });

    const labels = sortedLabels.map(lbl => {
      let info = null;
      for (let p of selectedItems) {
        if (productMaps[p][lbl]) {
          info = productMaps[p][lbl];
          break;
        }
      }

      if (!info) return lbl;

      if (currentGrouping === 'day') {
        return info.start;
      } else if (currentGrouping === 'week') {
        return formatWeekRange(info.start, info.end);
      } else {
        return formatMonthRange(info.start);
      }
    });

    setChartDataset({ labels, datasets });
  };

  const handleProductToggle = (product) => {
    setSelectedItems(prev => {
      if (product === 'All') {
        return prev.includes('All') ? [] : ['All'];
      } else {
        if (prev.includes('All')) {
          return [product];
        } else if (prev.includes(product)) {
          return prev.filter(p => p !== product);
        } else {
          return [...prev, product];
        }
      }
    });
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedItems(['All']);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2,
          alignItems: 'center',
          backgroundColor: 'background.paper',
          p: 2,
          borderRadius: 1,
          // boxShadow: 1
        }}>
          <FormControl size="small">
            <InputLabel>Time Period</InputLabel>
            <Select
              value={currentGrouping}
              label="Time Period"
              onChange={(e) => setCurrentGrouping(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
            </Select>
          </FormControl>

          <FormGroup sx={{ ml: 2 }}>
            <InputLabel sx={{ mb: 1 }}>Products</InputLabel>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availableProducts.map((product) => (
                <FormControlLabel
                  key={product}
                  control={
                    <Checkbox
                      checked={selectedItems.includes(product)}
                      onChange={() => handleProductToggle(product)}
                    />
                  }
                  label={displayNames[product] || product}
                />
              ))}
            </Box>
          </FormGroup>

          <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              slotProps={{ textField: { size: 'small', sx: { minWidth: 150 } } }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              slotProps={{ textField: { size: 'small', sx: { minWidth: 150 } } }}
            />
            <Button variant="contained" onClick={clearFilters}>Clear</Button>
          </Box>
        </Box>
      </LocalizationProvider>

      <Divider />

      <BarChart
        dataset={chartDataset.labels.map((label, index) => ({
          label,
          ...chartDataset.datasets.reduce((acc, dataset) => {
            acc[dataset.id] = dataset.data[index];
            return acc;
          }, {})
        }))}
        xAxis={[{
          dataKey: 'label',
          scaleType: 'band',
          tickLabelStyle: { fontSize: 12, fill: 'text.primary' }
        }]}
        series={chartDataset.datasets.map(dataset => ({
          dataKey: dataset.id,
          label: dataset.label,
          color: dataset.color,
          valueFormatter: dataset.valueFormatter
        }))}
        {...chartSetting}
        sx={{
          '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': {
            stroke: 'text.secondary',
          },
          '& .MuiChartsAxis-tickLabel': {
            fill: 'text.secondary',
          },
        }}
      />
    </Box>
  );
};

export default Chart;