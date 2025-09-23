import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  FaChartBar, 
  FaUsers, 
  FaEye, 
  FaStar, 
  FaCalendarAlt,
  FaChartLine,
  FaCode
} from 'react-icons/fa';
import { useState } from 'react';
import SlideInFromLeftSection from '../../Animations/SlideInFromLeftSection';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = ["#1E88E5", "#E53935", "#43A047", "#FB8C00", "#8E24AA", "#6D4C41", "#5E35B1", "#039BE5"];

const UserChart = ({ users }) => {
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('7days');
  const [metricType, setMetricType] = useState('followers');

  if (!users || users.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center h-80">
              <div className="text-center">
                <FaChartBar className="text-6xl text-gray-400 mx-auto mb-4 opacity-50" />
                <p className="text-gray-300 text-xl font-light mb-2">No hay datos para mostrar</p>
                <p className="text-gray-400">Realiza una búsqueda para ver estadísticas de usuarios</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              {metricType === 'followers' ? 
                <FaUsers className="text-2xl text-blue-400" /> : 
                <FaCode className="text-2xl text-green-400" />
              }
              <h3 className="text-xl font-bold text-white">
                Top Usuarios - {metricType === 'followers' ? 'Seguidores' : 'Repos'}
              </h3>
            </div>
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400 text-center">Los usuarios aparecerán aquí después de la búsqueda</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getMetricValue = (user) => {
    return metricType === 'followers' ? (user.followers || 0) : (user.public_repos || 0);
  };

  const getComplementaryValue = (user) => {
    return user.public_repos || 0;
  };

  const generateHistoricalData = () => {
    const sortedUsers = [...users]
      .sort((a, b) => getMetricValue(b) - getMetricValue(a))
      .slice(0, 5);

    const timePoints = {
      '7days': ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      '30days': ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      '90days': ['Mes 1', 'Mes 2', 'Mes 3']
    };

    const points = timePoints[timeRange] || timePoints['7days'];
    
    return points.map((point, index) => {
      const dataPoint = { date: point };
      sortedUsers.forEach((user) => {
        const baseValue = getMetricValue(user);
        const progressRatio = (index + 1) / points.length;
        const simulatedValue = Math.max(1, Math.round(baseValue * progressRatio * (0.7 + Math.random() * 0.6)));
        dataPoint[user.login] = simulatedValue;
      });
      return dataPoint;
    });
  };

  const prepareChartData = () => {
    if (chartType === 'line') {
      const historicalData = generateHistoricalData();
      const sortedUsers = [...users]
        .sort((a, b) => getMetricValue(b) - getMetricValue(a))
        .slice(0, 5);

      return {
        labels: historicalData.map(point => point.date),
        datasets: sortedUsers.map((user, index) => ({
          label: user.login,
          data: historicalData.map(point => point[user.login]),
          borderColor: COLORS[index % COLORS.length],
          backgroundColor: `${COLORS[index % COLORS.length]}33`,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: COLORS[index % COLORS.length],
          tension: 0.4,
          fill: false,
        }))
      };
    } else {
      const sortedUsers = [...users]
        .sort((a, b) => getMetricValue(b) - getMetricValue(a))
        .slice(0, 8);

      return {
        labels: sortedUsers.map(user => user.login),
        datasets: [
          {
            label: metricType === 'followers' ? 'Seguidores' : 'Repositorios',
            data: sortedUsers.map(user => getMetricValue(user)),
            backgroundColor: sortedUsers.map((_, index) => 
              `${COLORS[index % COLORS.length]}CC`
            ),
            borderColor: sortedUsers.map((_, index) => COLORS[index % COLORS.length]),
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      };
    }
  };

  const chartData = prepareChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: chartType === 'line',
        position: 'top',
        labels: {
          color: '#ffffff',
          font: {
            family: "'Inter', sans-serif"
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: chartType === 'line' 
          ? `Evolución de ${metricType === 'followers' ? 'Seguidores' : 'Repositorios'} - ${timeRange}`
          : `Top ${Math.min(users.length, 8)} Usuarios - ${metricType === 'followers' ? 'Seguidores' : 'Repositorios'}`,
        color: '#ffffff',
        font: {
          size: 16,
          weight: 'bold',
          family: "'Inter', sans-serif"
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#60a5fa',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y.toLocaleString();
            if (chartType === 'line') {
              const label = context.dataset.label || '';
              return `${label}: ${value} ${metricType === 'followers' ? 'seguidores' : 'repos'}`;
            } else {
              return `${metricType === 'followers' ? 'Seguidores' : 'Repositorios'}: ${value}`;
            }
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#d1d5db',
          font: {
            family: "'Inter', sans-serif",
            size: 11
          },
          maxRotation: chartType === 'line' ? 0 : 45,
          minRotation: chartType === 'line' ? 0 : 45
        },
        grid: {
          display: false, 
        },
        border: {
          color: 'rgba(255, 255, 255, 0.1)',
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#d1d5db',
          font: {
            family: "'Inter', sans-serif"
          },
          callback: function(value) {
            return value.toLocaleString();
          }
        },
        grid: {
          display: false, 
        },
        border: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        title: {
          display: true,
          text: metricType === 'followers' ? 'Seguidores' : 'Repositorios',
          color: '#d1d5db'
        }
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'bar':
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  const totalMetric = users.reduce((sum, user) => sum + getMetricValue(user), 0);
  const avgMetric = Math.round(totalMetric / users.length);
  const maxMetric = Math.max(...users.map(user => getMetricValue(user)));

  const renderTopUsers = () => {
    const topUsers = [...users]
      .sort((a, b) => getMetricValue(b) - getMetricValue(a))
      .slice(0, 5);

    return (
        <SlideInFromLeftSection>
      <div className="space-y-3">
        {topUsers.map((user, index) => (
          <div
            key={user.id}
            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 group hover:bg-white/10"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: COLORS[index] }}
              >
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{user.login}</p>
                <p className="text-gray-400 text-sm">
                  {getMetricValue(user).toLocaleString()} {metricType === 'followers' ? 'seguidores' : 'repos'}
                </p>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400 text-sm" />
                  <span className="text-white font-semibold text-sm">
                    {getComplementaryValue(user).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-400 text-xs">
                  {metricType === 'followers' ? 'repos' : 'seguidores'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      </SlideInFromLeftSection>
    );
  };

  return (
    <SlideInFromLeftSection>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-10">
      <div className={users.length > 1 ? "lg:col-span-8" : "lg:col-span-12"}>
        <div className="bg-[var(--color-bg-main)] backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                GitHub Analytics - {metricType === 'followers' ? 'Seguidores' : 'Repositorios'}
              </h2>
              <p className="text-gray-300">
                {chartType === 'line' 
                  ? `Evolución temporal - ${timeRange}`
                  : `Datos actuales - ${users.length} usuarios`
                }
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    chartType === 'bar' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FaChartBar />
                  Barra
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    chartType === 'line' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FaChartLine />
                  Línea
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center gap-2">
                <FaEye className="text-blue-400" />
                <span className="text-white font-semibold">Métrica:</span>
              </div>
              
              <div className="flex bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setMetricType('followers')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    metricType === 'followers' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FaUsers />
                  Seguidores
                </button>
                <button
                  onClick={() => setMetricType('repos')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    metricType === 'repos' 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FaCode />
                  Repositorios
                </button>
              </div>

              {chartType === 'line' && (
                <div className="flex items-center gap-3 lg:ml-auto">
                  <FaCalendarAlt className="text-purple-400" />
                  <span className="text-white font-semibold">Rango:</span>
                  <div className="flex bg-white/5 rounded-lg p-1">
                    <button
                      onClick={() => setTimeRange('7days')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        timeRange === '7days' 
                          ? 'bg-purple-500 text-white shadow-lg' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      7 Días
                    </button>
                    <button
                      onClick={() => setTimeRange('30days')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        timeRange === '30days' 
                          ? 'bg-purple-500 text-white shadow-lg' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      30 Días
                    </button>
                    <button
                      onClick={() => setTimeRange('90days')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        timeRange === '90days' 
                          ? 'bg-purple-500 text-white shadow-lg' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      90 Días
                    </button>
                  </div>
                </div>
              )}
            </div>

            {chartType === 'bar' && (
              <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-blue-300 text-sm text-center">
                   <strong>Datos en tiempo real:</strong> Valores actuales obtenidos de GitHub API
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl p-4 text-center border border-blue-500/30">
              <div className="text-2xl font-bold text-blue-300">
                {totalMetric.toLocaleString()}
              </div>
              <div className="text-xs text-gray-300">
                Total {metricType === 'followers' ? 'Seguidores' : 'Repos'}
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-4 text-center border border-green-500/30">
              <div className="text-2xl font-bold text-green-300">
                {avgMetric.toLocaleString()}
              </div>
              <div className="text-xs text-gray-300">Promedio</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl p-4 text-center border border-purple-500/30">
              <div className="text-2xl font-bold text-purple-300">
                {maxMetric.toLocaleString()}
              </div>
              <div className="text-xs text-gray-300">Máximo</div>
            </div>
          </div>

          <div className="h-80">
            {renderChart()}
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              {chartType === 'line' 
                ? `Datos históricos simulados para ${timeRange}`
                : `Datos actuales obtenidos de GitHub API`
              }
            </p>
          </div>
        </div>
      </div>

{/* Top 5 Usuarios */}
{users.length > 1 && (
  <div className="lg:col-span-4">
    <div className="bg-[var(--color-bg-main)] backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl h-full">
      <div className="flex items-center gap-3 mb-6">
        {metricType === 'followers' ? 
          <FaUsers className="text-2xl text-blue-400" /> : 
          <FaCode className="text-2xl text-green-400" />
        }
        <div>
          <h3 className="text-xl font-bold text-white">
            Top 5 - {metricType === 'followers' ? 'Seguidores' : 'Repositorios'}
          </h3>
          <p className="text-gray-300 text-sm">
            Ordenado por {metricType === 'followers' ? 'seguidores' : 'repositorios'}
          </p>
        </div>
      </div>
      
      {renderTopUsers()}
    </div>
  </div>
)}

    </div>
    </SlideInFromLeftSection>
  );
};

export default UserChart;