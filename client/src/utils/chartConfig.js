import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Chart.js defaults
ChartJS.defaults.color = '#666';
ChartJS.defaults.font.family = "'Roboto', 'Helvetica', 'Arial', sans-serif";
ChartJS.defaults.font.size = 12;
ChartJS.defaults.plugins.tooltip.padding = 10;
ChartJS.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.8)';
ChartJS.defaults.plugins.legend.position = 'bottom';
ChartJS.defaults.plugins.legend.labels.padding = 20;

export default ChartJS; 