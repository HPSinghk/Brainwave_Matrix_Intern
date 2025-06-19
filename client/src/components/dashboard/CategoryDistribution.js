import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import '../../utils/chartConfig'; // Import Chart.js configuration

const CategoryDistribution = () => {
  const { transactions, categories } = useSelector((state) => state.cashflow);

  console.log('CategoryDistribution - transactions:', transactions);
  console.log('CategoryDistribution - categories:', categories);

  // Calculate expense distribution
  const expenseData = React.useMemo(() => {
    const expenseTotal = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    console.log('Expense total:', expenseTotal);

    const categoryTotals = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const categoryId = t.category?._id || t.category;
        if (categoryId) {
          categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + Number(t.amount);
        }
      });

    console.log('Category totals for expenses:', categoryTotals);

    const result = Object.entries(categoryTotals).map(([categoryId, amount]) => {
      const category = categories.find(c => c._id === categoryId);
      return {
        name: category?.name || 'Uncategorized',
        value: amount,
        percentage: expenseTotal > 0 ? ((amount / expenseTotal) * 100).toFixed(1) : '0',
        color: category?.color || '#f44336'
      };
    });

    console.log('Expense data result:', result);
    return result;
  }, [transactions, categories]);

  // Calculate income distribution
  const incomeData = React.useMemo(() => {
    const incomeTotal = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    console.log('Income total:', incomeTotal);

    const categoryTotals = {};
    transactions
      .filter(t => t.type === 'income')
      .forEach(t => {
        const categoryId = t.category?._id || t.category;
        if (categoryId) {
          categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + Number(t.amount);
        }
      });

    console.log('Category totals for income:', categoryTotals);

    const result = Object.entries(categoryTotals).map(([categoryId, amount]) => {
      const category = categories.find(c => c._id === categoryId);
      return {
        name: category?.name || 'Uncategorized',
        value: amount,
        percentage: incomeTotal > 0 ? ((amount / incomeTotal) * 100).toFixed(1) : '0',
        color: category?.color || '#4caf50'
      };
    });

    console.log('Income data result:', result);
    return result;
  }, [transactions, categories]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        onClick: null, // Disable legend click functionality
        labels: {
          usePointStyle: true,
          padding: 8,
          font: {
            size: 10,
            family: '"Inter", "Roboto", sans-serif'
          },
          color: '#2d3748',
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                
                // Truncate long labels to prevent overflow
                const displayLabel = label.length > 15 ? label.substring(0, 12) + '...' : label;
                
                return {
                  text: `${displayLabel} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.backgroundColor[i],
                  lineWidth: 0,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          family: '"Poppins", "Roboto", sans-serif',
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: '"Inter", "Roboto", sans-serif',
          size: 12
        },
        callbacks: {
          title: function(context) {
            // Show full category name in tooltip
            const dataIndex = context[0].dataIndex;
            return context[0].chart.data.labels[dataIndex];
          },
          label: function(context) {
            const label = context.label || '';
            const value = Number(context.raw) || 0;
            const total = context.dataset.data.reduce((a, b) => Number(a) + Number(b), 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  const renderPieChart = (data, title, color) => {
    console.log(`Rendering ${title} with data:`, data);
    
    if (!data || data.length === 0) {
      return (
        <Box sx={{ 
          height: 400, 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid rgba(102, 126, 234, 0.1)'
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#718096',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
            }}
          >
            No data available
          </Typography>
        </Box>
      );
    }

    const chartData = {
      labels: data.map(item => item.name),
      datasets: [{
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };

    console.log(`Chart data for ${title}:`, chartData);

    return (
      <Box sx={{ height: 400, width: '100%' }}>
        <Typography 
          variant="h6" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: '#2d3748',
            mb: 2,
            fontFamily: '"Poppins", "Roboto", sans-serif'
          }}
        >
          {title}
        </Typography>
        <Box sx={{ height: 320, width: '100%' }}>
          <Pie data={chartData} options={chartOptions} />
        </Box>
      </Box>
    );
  };

  return (
    <Paper sx={{ 
      p: 4, 
      borderRadius: 4,
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(102, 126, 234, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      }
    }}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 700,
          color: '#2d3748',
          mb: 3,
          fontFamily: '"Poppins", "Roboto", sans-serif',
          textAlign: 'center'
        }}
      >
        Category Distribution
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderPieChart(expenseData, 'Expenses', '#f44336')}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderPieChart(incomeData, 'Income', '#4caf50')}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CategoryDistribution; 