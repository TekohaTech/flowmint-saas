// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Card, Container, Row, Col } from 'react-bootstrap';
// import { Bar, Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import dayjs from 'dayjs'; // A library to handle dates

// ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

// const Ganancias = () => {
//   const [diarias, setDiarias] = useState([]);
//   const [semanales, setSemanales] = useState([]);
//   const [mensuales, setMensuales] = useState([]);
//   const [anuales, setAnuales] = useState([]);
//   const [mensualesPorServicio, setMensualesPorServicio] = useState([]);
//   const [mensualesPorEmpleado, setMensualesPorEmpleado] = useState([]);
//   const [anualesPorServicio, setAnualesPorServicio] = useState([]);
//   const [anualesPorEmpleado, setAnualesPorEmpleado] = useState([]);

//   useEffect(() => {
//     const fetchGanancias = async () => {
//       try {
//         const responses = await Promise.all([
//           axios.get('http://localhost:4000/ganancias_diarias'),
//           axios.get('http://localhost:4000/ganancias_semanales'),
//           axios.get('http://localhost:4000/ganancias_mensuales'),
//           axios.get('http://localhost:4000/ganancias_anuales'),
//           axios.get('http://localhost:4000/ganancias_mensuales_por_servicio'),
//           axios.get('http://localhost:4000/ganancias_mensuales_por_empleado'),
//           axios.get('http://localhost:4000/ganancias_anuales_por_servicio'),
//           axios.get('http://localhost:4000/ganancias_anuales_por_empleado')
//         ]);

//         setDiarias(responses[0].data);
//         setSemanales(responses[1].data);
//         setMensuales(responses[2].data);
//         setAnuales(responses[3].data);
//         setMensualesPorServicio(responses[4].data);
//         setMensualesPorEmpleado(responses[5].data);
//         setAnualesPorServicio(responses[6].data);
//         setAnualesPorEmpleado(responses[7].data);
//       } catch (error) {
//         console.error("Error fetching ganancias data:", error);
//       }
//     };

//     fetchGanancias();
//   }, []);

//   const formatDate = (date) => dayjs(date).format('DD/MM/YYYY');
//   const formatWeek = (week) => `Semana ${week}`;
//   const formatMonthYear = (mes, año) => `${mes}/${año}`;
//   const formatYear = (año) => `${año}`;

//   const getChartData = (data, label, isLine = false) => {
//     const labels = data.map(item => {
//       if (item.fecha) return formatDate(item.fecha); // for daily
//       if (item.semana) return formatWeek(item.semana); // for weekly
//       if (item.mes) return formatMonthYear(item.mes, item.año); // for monthly
//       return formatYear(item.año); // for annual
//     });
//     const totals = data.map(item => item.total || 0);

//     return {
//       labels: labels,
//       datasets: [
//         {
//           label: label,
//           data: totals,
//           borderColor: isLine ? 'rgba(75, 192, 192, 1)' : 'rgba(75, 192, 192, 0.8)',
//           backgroundColor: isLine ? 'rgba(75, 192, 192, 0.2)' : 'rgba(75, 192, 192, 0.5)',
//           borderWidth: 2,
//           tension: isLine ? 0.1 : 0,
//           fill: true,
//         },
//       ],
//     };
//   };

//   const getChartDataWithColors = (data, label) => {
//     const services = [...new Set(data.map(item => item.servicio))];
//     const employees = [...new Set(data.map(item => item.empleado))];

//     const getColors = (length) => {
//       const colors = ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'];
//       return colors.slice(0, length).concat(colors.slice(0, length - colors.length));
//     };

//     const createDataset = (items, labels) => {
//       const dataset = items.map(item => {
//         const color = getColors(items.length)[items.indexOf(item)];
//         return {
//           label: item,
//           data: labels.map(label => {
//             const dataItem = data.find(d => (d.servicio === item || d.empleado === item) && `${d.año}-${d.mes}` === label);
//             return dataItem ? dataItem.total : 0;
//           }),
//           backgroundColor: color,
//           borderColor: color.replace('0.6', '1'),
//           borderWidth: 1,
//         };
//       });
//       return dataset;
//     };

//     const months = [...new Set(data.map(item => `${item.año}-${item.mes}`))];
//     months.sort();

//     const dataset = createDataset(services, months);

//     return {
//       labels: months,
//       datasets: dataset,
//     };
//   };

//   return (
//     <Container fluid>
//       <h1 className="text-center mb-4 text-neon-cyan">Ganancias</h1>
//       <Row className="mb-4">
//         <Col xs={12} md={6}>
//           <Card>
//             <Card.Header>Ganancias Diarias</Card.Header>
//             <Card.Body>
//               <Line data={getChartData(diarias, 'Ganancias Diarias', true)} options={{ responsive: true, plugins: { legend: { display: true } } }} />
//               <div className="mt-3">
//                 {diarias.length > 0 ? (
//                   diarias.map((item, index) => (
//                     <p key={index}>Fecha: {formatDate(item.fecha)}, Total: ${item.total.toFixed(2) || 'N/A'}</p>
//                   ))
//                 ) : (
//                   <p>No hay datos disponibles</p>
//                 )}
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col xs={12} md={6}>
//           <Card>
//             <Card.Header>Ganancias Semanales</Card.Header>
//             <Card.Body>
//               <Bar data={getChartData(semanales, 'Ganancias Semanales')} options={{ responsive: true, plugins: { legend: { display: true } } }} />
//               <div className="mt-3">
//                 {semanales.length > 0 ? (
//                   semanales.map((item, index) => (
//                     <p key={index}>Semana: {formatWeek(item.semana)}, Total: ${item.total.toFixed(2) || 'N/A'}</p>
//                   ))
//                 ) : (
//                   <p>No hay datos disponibles</p>
//                 )}
//                 <hr />
//                 <h5>Total Semanal: ${semanales.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</h5>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//       <Row className="mb-4">
//         <Col xs={12} md={6}>
//           <Card>
//             <Card.Header>Ganancias Mensuales</Card.Header>
//             <Card.Body>
//               <Bar data={getChartData(mensuales, 'Ganancias Mensuales')} options={{ responsive: true, plugins: { legend: { display: true } } }} />
//               <div className="mt-3">
//                 {mensuales.length > 0 ? (
//                   mensuales.map((item, index) => (
//                     <p key={index}>Mes/Año: {formatMonthYear(item.mes, item.año)}, Total: ${item.total.toFixed(2) || 'N/A'}</p>
//                   ))
//                 ) : (
//                   <p>No hay datos disponibles</p>
//                 )}
//                 <hr />
//                 <h5>Total Mensual: ${mensuales.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</h5>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col xs={12} md={6}>
//           <Card>
//             <Card.Header>Ganancias Anuales</Card.Header>
//             <Card.Body>
//               <Bar data={getChartData(anuales, 'Ganancias Anuales')} options={{ responsive: true, plugins: { legend: { display: true } } }} />
//               <div className="mt-3">
//                 {anuales.length > 0 ? (
//                   anuales.map((item, index) => (
//                     <p key={index}>Año: {formatYear(item.año)}, Total: ${item.total.toFixed(2) || 'N/A'}</p>
//                   ))
//                 ) : (
//                   <p>No hay datos disponibles</p>
//                 )}
//                 <hr />
//                 <h5>Total Anual: ${anuales.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</h5>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//       <Row className="mb-4">
//         <Col xs={12} md={6}>
//           <Card>
//             <Card.Header>Ganancias Mensuales por Servicio</Card.Header>
//             <Card.Body>
//               <Bar data={getChartDataWithColors(mensualesPorServicio, 'Ganancias Mensuales por Servicio')} options={{ responsive: true, plugins: { legend: { display: true } } }} />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col xs={12} md={6}>
//           <Card>
//             <Card.Header>Ganancias Anuales por Servicio</Card.Header>
//             <Card.Body>
//               <Bar data={getChartDataWithColors(anualesPorServicio, 'Ganancias Anuales por Servicio')} options={{ responsive: true, plugins: { legend: { display: true } } }} />
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//       <Row className="mb-4">
//         <Col xs={12} md={6}>
//           <Card>
//             <Card.Header>Ganancias Mensuales por Empleado</Card.Header>
//             <Card.Body>
//               <Bar data={getChartDataWithColors(mensualesPorEmpleado, 'Ganancias Mensuales por Empleado')} options={{ responsive: true, plugins: { legend: { display: true } } }} />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col xs={12} md={6}>
//           <Card>
//             <Card.Header>Ganancias Anuales por Empleado</Card.Header>
//             <Card.Body>
//               <Bar data={getChartDataWithColors(anualesPorEmpleado, 'Ganancias Anuales por Empleado')} options={{ responsive: true, plugins: { legend: { display: true } } }} />
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Ganancias;




import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Form, Alert, Button } from 'react-bootstrap';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs'; // A library to handle dates
import api, { revenueAPI } from '../services/api';

// Plugin personalizado para mostrar valores en los gráficos de forma inteligente
const dataLabelsPlugin = {
  id: 'dataLabels',
  afterDatasetsDraw: function(chart) {
    const { ctx, data, chartArea: { width } } = chart;
    
    // Ajustar tamaño de fuente según el ancho del gráfico
    const fontSize = width < 500 ? 12 : 15; 
    const fontFamily = "'Inter', sans-serif";
    const fontWeight = '800';

    ctx.save();
    data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      if (!meta.hidden) {
        // Reducir etiquetas si hay demasiados puntos
        const skipStep = dataset.data.length > 20 ? (width < 600 ? 4 : 2) : 1;
        
        meta.data.forEach((element, j) => {
          if (dataset.data[j] !== null && dataset.data[j] !== 0 && j % skipStep === 0) {
            ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            const text = '$' + Math.round(dataset.data[j]).toLocaleString();
            
            // Determinar posición vertical óptima
            const position = element.tooltipPosition();
            // Si es barra, asegurar que no se salga por arriba añadiendo padding interno al gráfico o bajando el texto
            const yOffset = chart.config.type === 'bar' ? -8 : -12;

            // Sombra para contraste extremo en fondo oscuro
            ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
            ctx.lineWidth = 5;
            ctx.strokeText(text, position.x, Math.max(25, position.y + yOffset));

            // Texto principal con color neon brillante
            ctx.fillStyle = i === 0 ? '#00f3ff' : '#16f2b3';
            ctx.fillText(text, position.x, Math.max(25, position.y + yOffset));
          }
        });
      }
    });
    ctx.restore();
  }
};

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, dataLabelsPlugin);

const Ganancias = () => {
  const [diarias, setDiarias] = useState([]);
  const [semanales, setSemanales] = useState([]);
  const [mensuales, setMensuales] = useState([]);
  const [anuales, setAnuales] = useState([]);
  const [mensualesPorServicio, setMensualesPorServicio] = useState([]);
  const [mensualesPorEmpleado, setMensualesPorEmpleado] = useState([]);
  const [anualesPorServicio, setAnualesPorServicio] = useState([]);
  const [anualesPorEmpleado, setAnualesPorEmpleado] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [autoUpdateTimer, setAutoUpdateTimer] = useState(null); // Para actualizar automáticamente

  useEffect(() => {
    if (!fechaInicio || !fechaFin) {
      // Si no hay fechas seleccionadas, usar un rango predeterminado (últimos 30 días)
      const hoy = new Date();
      const hace30Dias = new Date();
      hace30Dias.setDate(hace30Dias.getDate() - 30);

      setFechaInicio(hace30Dias.toISOString().split('T')[0]);
      setFechaFin(hoy.toISOString().split('T')[0]);
    }
  }, []);

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      fetchGanancias();
    }
  }, [fechaInicio, fechaFin]);

  // Limpiar temporizadores al desmontar el componente
  useEffect(() => {
    return () => {
      if (autoUpdateTimer) {
        clearTimeout(autoUpdateTimer);
      }
    };
  }, []);

  const fetchGanancias = async () => {
    setLoading(true);
    setError('');
    console.log('[Ganancias] Iniciando fetch...');
    console.log('[Ganancias] Token:', localStorage.getItem('token'));
    console.log('[Ganancias] Fechas:', fechaInicio, fechaFin);
    
    try {
      const responses = await Promise.all([
        revenueAPI.getDaily(fechaInicio, fechaFin),
        revenueAPI.getWeekly(fechaInicio, fechaFin),
        revenueAPI.getMonthly(fechaInicio, fechaFin),
        revenueAPI.getYearly(fechaInicio, fechaFin),
        revenueAPI.getMonthlyByService(fechaInicio, fechaFin),
        revenueAPI.getMonthlyByEmployee(fechaInicio, fechaFin),
        revenueAPI.getYearlyByService(fechaInicio, fechaFin),
        revenueAPI.getYearlyByEmployee(fechaInicio, fechaFin),
        revenueAPI.getSummary(fechaInicio, fechaFin)
      ]);

      console.log('[Ganancias] Respuestas recibidas:', responses);
      setDiarias(responses[0]);
      setSemanales(responses[1]);
      setMensuales(responses[2]);
      setAnuales(responses[3]);
      setMensualesPorServicio(responses[4]);
      setMensualesPorEmpleado(responses[5]);
      setAnualesPorServicio(responses[6]);
      setAnualesPorEmpleado(responses[7]);
      setResumen(responses[8]);
    } catch (error) {
      console.error("[Ganancias] Error:", error);
      console.error("[Ganancias] Error response:", error.response);
      setError('Error al cargar los datos de ganancias. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => dayjs(new Date(date)).format('DD/MM/YYYY');
  const formatWeek = (data) => `Semana ${data.semana} ${data.año}`;
  const formatMonthYear = (mes, año) => `${mes}/${año}`;
  const formatYear = (año) => `${año}`;

  const getChartData = (data, label, isLine = false) => {
    if (!data || !Array.isArray(data)) {
      return { labels: [], datasets: [{ label, data: [], backgroundColor: [], borderColor: [] }] };
    }

    // Determinar el tipo de datos basado en las propiedades
    const labels = data.map(item => {
      if (item.fecha) return formatDate(item.fecha); // Ganancias diarias
      if (item.semana) return formatWeek(item); // Ganancias semanales
      if (item.mes) return formatMonthYear(item.mes, item.año); // Ganancias mensuales
      if (item.año && item.mes === undefined && item.semana === undefined) return formatYear(item.año); // Ganancias anuales
      return '';
    });

    const totals = data.map(item => item.total || 0);

    // Usar colores neon estándar con mejor contraste
    const neonCyan = 'rgba(0, 243, 255, 1)';  // neon cyan
    const neonCyanLight = 'rgba(0, 243, 255, 0.2)';  // neon cyan claro para áreas
    const neonGreen = 'rgba(22, 242, 179, 1)'; // neon green
    const neonGreenLight = 'rgba(22, 242, 179, 0.2)'; // neon green claro para áreas

    const backgroundColor = isLine ? neonCyanLight : neonGreenLight;
    const borderColor = isLine ? neonCyan : neonGreen;

    return {
      labels,
      datasets: [
        {
          label,
          data: totals,
          backgroundColor,
          borderColor,
          borderWidth: isLine ? 3 : 2,
          tension: isLine ? 0.4 : 0,
          fill: isLine,
          pointBackgroundColor: borderColor,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  const getChartDataWithColors = (data, label) => {
    if (!data || !Array.isArray(data)) {
      return { labels: [], datasets: [] };
    }

    // Agrupar por categoría (servicio o empleado) y por período (mes/año)
    const categorias = [...new Set(data.map(item => item.servicio || item.empleado))];
    const periodos = [...new Set(data.map(item =>
      item.mes ? `${item.año}-${String(item.mes).padStart(2, '0')}` : `${item.año}`
    ))];
    periodos.sort();

    // Colores neon mejorados para mejor legibilidad
    const coloresBase = [
      'rgba(22, 242, 179, 0.7)',   // neon-green
      'rgba(0, 243, 255, 0.7)',    // neon-cyan
      'rgba(255, 0, 110, 0.7)',    // neon-pink
      'rgba(139, 92, 246, 0.7)',   // neon-purple
      'rgba(255, 214, 10, 0.7)',   // neon-yellow
      'rgba(255, 109, 0, 0.7)',    // neon-orange
      'rgba(0, 150, 255, 0.7)',    // neon-blue
    ];

    const bordes = [
      'rgba(22, 242, 179, 1)',   // neon-green
      'rgba(0, 243, 255, 1)',    // neon-cyan
      'rgba(255, 0, 110, 1)',    // neon-pink
      'rgba(139, 92, 246, 1)',   // neon-purple
      'rgba(255, 214, 10, 1)',   // neon-yellow
      'rgba(255, 109, 0, 1)',    // neon-orange
      'rgba(0, 150, 255, 1)',    // neon-blue
    ];

    const datasets = categorias.map((categoria, index) => {
      const colorIndex = index % coloresBase.length;
      const backgroundColor = coloresBase[colorIndex];
      const borderColor = bordes[colorIndex];

      return {
        label: categoria,
        data: periodos.map(periodo => {
          const item = data.find(d => {
            const periodoItem = d.mes ? `${d.año}-${String(d.mes).padStart(2, '0')}` : `${d.año}`;
            const categoriaItem = d.servicio || d.empleado;
            return periodoItem === periodo && categoriaItem === categoria;
          });
          return item ? item.total : 0;
        }),
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 2,
        borderSkipped: false,
      };
    });

    return {
      labels: periodos,
      datasets,
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          font: {
            size: 11,
            weight: 'bold'
          },
          padding: 20,
        },
      },
      title: {
        display: false,
        color: '#ffffff',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(20, 20, 40, 0.95)',
        titleColor: '#ffffff',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyColor: '#e0e0e0',
        bodyFont: {
          size: 13,
          weight: 'normal'
        },
        borderColor: 'rgba(0, 243, 255, 0.5)',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '$' + context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#e0e0e0',
          maxRotation: 45,
          minRotation: 0,
          font: {
            size: 12,
            weight: 'normal'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        title: {
          display: false,
          text: 'Período',
          color: '#ffffff',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        ticks: {
          color: '#e0e0e0',
          font: {
            size: 12,
            weight: 'normal'
          },
          callback: function(value) {
            if (value >= 1000) {
              return '$' + (value / 1000).toFixed(1) + 'k';
            }
            return '$' + value;
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        title: {
          display: false,
          text: 'Monto ($)',
          color: '#ffffff',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <Container fluid className="p-4">
      <h1 className="text-center mb-0" style={{ color: 'white', textShadow: '0 0 10px rgba(0, 243, 255, 0.3)' }}>Reporte de Ganancias</h1>
      <p className="text-center mb-4 text-muted small">Sólo se contabilizan turnos con estado <span className="text-neon-cyan fw-bold">"confirmado"</span></p>

      {/* Controles de fecha */}
      <Card className="mb-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <Card.Body>
          <Row className="align-items-end">
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="text-neon-cyan fw-bold">Fecha Inicio</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => {
                    setFechaInicio(e.target.value);

                    // Limpiar el temporizador anterior si existe
                    if (autoUpdateTimer) {
                      clearTimeout(autoUpdateTimer);
                    }

                    // Establecer un nuevo temporizador para refrescar datos después de 800ms
                    const timer = setTimeout(() => {
                      if (fechaFin) { // Solo actualizar si ambas fechas están seleccionadas
                        fetchGanancias();
                      }
                    }, 800);

                    setAutoUpdateTimer(timer);
                  }}
                  onClick={() => {
                    // Opcional: Asegurar que el campo de fecha fin también esté disponible
                    // para una mejor experiencia de usuario
                  }}
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--neon-cyan)',
                    borderWidth: '2px',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                  className="focus-neon"
                  onBlur={() => {
                    // Opcional: aquí podríamos añadir lógica para actualizar datos
                    // cuando el campo pierde el foco
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="text-neon-cyan fw-bold">Fecha Fin</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaFin}
                  onChange={(e) => {
                    setFechaFin(e.target.value);

                    // Limpiar el temporizador anterior si existe
                    if (autoUpdateTimer) {
                      clearTimeout(autoUpdateTimer);
                    }

                    // Establecer un nuevo temporizador para refrescar datos después de 800ms
                    const timer = setTimeout(() => {
                      if (fechaInicio) { // Solo actualizar si ambas fechas están seleccionadas
                        fetchGanancias();
                      }
                    }, 800);

                    setAutoUpdateTimer(timer);
                  }}
                  onClick={() => {
                    // Opcional: Asegurar que el campo de fecha inicio también esté disponible
                    // para una mejor experiencia de usuario
                  }}
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--neon-cyan)',
                    borderWidth: '2px',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                  className="focus-neon"
                  onBlur={() => {
                    // Opcional: aquí podríamos añadir lógica para actualizar datos
                    // cuando el campo pierde el foco
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button
                variant="success"
                className="w-100"
                onClick={fetchGanancias}
                disabled={loading || autoUpdateTimer !== null}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    {' '}Cargando...
                  </>
                ) : 'Actualizar Reporte'}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger" className="alert-error">{error}</Alert>}

      {/* Resumen de Ganancias */}
      {resumen && (
        <Card className="mb-4 shadow-lg" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <Card.Header className="text-center py-3" style={{ background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-card) 100%)', borderColor: 'var(--border-color)', color: 'var(--neon-cyan)' }}>
            <h4 className="mb-0 text-neon-cyan">Resumen de Ganancias</h4>
          </Card.Header>
          <Card.Body>
            <Row className="g-4">
              <Col md={3}>
                <Card className="text-center h-100 border-0" style={{ background: 'rgba(0, 243, 255, 0.05)', border: '1px solid rgba(0, 243, 255, 0.2)', borderRadius: '12px' }}>
                  <Card.Body className="p-3 d-flex flex-column justify-content-center">
                    <Card.Title className="text-white mb-2" style={{ opacity: 0.8, fontSize: '0.9rem' }}>Confirmado</Card.Title>
                    <Card.Text className="fs-3 fw-bold text-white mb-0">
                      ${resumen.total?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center h-100 border-0" style={{ background: 'rgba(255, 109, 0, 0.05)', border: '1px solid rgba(255, 109, 0, 0.2)', borderRadius: '12px' }}>
                  <Card.Body className="p-3 d-flex flex-column justify-content-center">
                    <Card.Title className="text-white mb-2" style={{ opacity: 0.8, fontSize: '0.9rem' }}>Pendiente</Card.Title>
                    <Card.Text className="fs-3 fw-bold text-neon-orange mb-0">
                      ${resumen.totalPendiente?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center h-100 border-0" style={{ background: 'rgba(22, 242, 179, 0.05)', border: '1px solid rgba(22, 242, 179, 0.2)', borderRadius: '12px' }}>
                  <Card.Body className="p-3 d-flex flex-column justify-content-center">
                    <Card.Title className="text-white mb-2" style={{ opacity: 0.8, fontSize: '0.9rem' }}>Proyectado</Card.Title>
                    <Card.Text className="fs-3 fw-bold text-neon-green mb-0">
                      ${resumen.totalProyectado?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center h-100 border-0" style={{ background: 'rgba(255, 0, 110, 0.05)', border: '1px solid rgba(255, 0, 110, 0.2)', borderRadius: '12px' }}>
                  <Card.Body className="p-3 d-flex flex-column justify-content-center">
                    <Card.Title className="text-white mb-2" style={{ opacity: 0.8, fontSize: '0.9rem' }}>Turnos (Cnf/Total)</Card.Title>
                    <Card.Text className="fs-3 fw-bold text-neon-pink mb-0">
                      {resumen.totalTurnos}/{resumen.totalTurnos + (resumen.totalTurnosPendientes || 0)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Gráficos de Ganancias */}
      <Row className="mb-4">
        <Col xs={12} md={6}>
          <Card style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <Card.Header style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: '#ffffff' }}>
              Ganancias Diarias
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px', minHeight: '300px' }}>
                {diarias && diarias.length > 0 ? (
                  <Line
                    data={getChartData(diarias, 'Ganancias Diarias', true)}
                    options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, display: false } } }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-center text-light opacity-75">
                    <p className="mb-0">No hay datos disponibles para este período</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <Card.Header style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: '#ffffff' }}>
              Ganancias Semanales
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px', minHeight: '300px' }}>
                {semanales && semanales.length > 0 ? (
                  <Bar
                    data={getChartData(semanales, 'Ganancias Semanales')}
                    options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, display: false } } }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-center text-light opacity-75">
                    <p className="mb-0">No hay datos disponibles para este período</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12} md={6}>
          <Card style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <Card.Header style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: '#ffffff' }}>
              Ganancias Mensuales
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px', minHeight: '300px' }}>
                {mensuales && mensuales.length > 0 ? (
                  <Bar
                    data={getChartData(mensuales, 'Ganancias Mensuales')}
                    options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, display: false } } }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-center text-light opacity-75">
                    <p className="mb-0">No hay datos disponibles para este período</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <Card.Header style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: '#ffffff' }}>
              Ganancias Anuales
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px', minHeight: '300px' }}>
                {anuales && anuales.length > 0 ? (
                  <Bar
                    data={getChartData(anuales, 'Ganancias Anuales')}
                    options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, display: false } } }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-center text-light opacity-75">
                    <p className="mb-0">No hay datos disponibles para este período</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12} md={6}>
          <Card style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <Card.Header style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: '#ffffff' }}>
              Ganancias Mensuales por Servicio
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px', minHeight: '300px' }}>
                {mensualesPorServicio && mensualesPorServicio.length > 0 ? (
                  <Bar
                    data={getChartDataWithColors(mensualesPorServicio, 'Ganancias Mensuales por Servicio')}
                    options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, display: false } } }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-center text-light opacity-75">
                    <p className="mb-0">No hay datos disponibles para este período</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <Card.Header style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: '#ffffff' }}>
              Ganancias Anuales por Servicio
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px', minHeight: '300px' }}>
                {anualesPorServicio && anualesPorServicio.length > 0 ? (
                  <Bar
                    data={getChartDataWithColors(anualesPorServicio, 'Ganancias Anuales por Servicio')}
                    options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, display: false } } }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-center text-light opacity-75">
                    <p className="mb-0">No hay datos disponibles para este período</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12} md={6}>
          <Card style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <Card.Header style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: '#ffffff' }}>
              Ganancias Mensuales por Empleado
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px', minHeight: '300px' }}>
                {mensualesPorEmpleado && mensualesPorEmpleado.length > 0 ? (
                  <Bar
                    data={getChartDataWithColors(mensualesPorEmpleado, 'Ganancias Mensuales por Empleado')}
                    options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, display: false } } }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-center text-light opacity-75">
                    <p className="mb-0">No hay datos disponibles para este período</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <Card.Header style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: '#ffffff' }}>
              Ganancias Anuales por Empleado
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px', minHeight: '300px' }}>
                {anualesPorEmpleado && anualesPorEmpleado.length > 0 ? (
                  <Bar
                    data={getChartDataWithColors(anualesPorEmpleado, 'Ganancias Anuales por Empleado')}
                    options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, display: false } } }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-center text-light opacity-75">
                    <p className="mb-0">No hay datos disponibles para este período</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Ganancias;
