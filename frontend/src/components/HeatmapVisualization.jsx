import React, { useState, useEffect } from 'react';
import { Activity, MapPin, ZoomIn, ZoomOut, Users, TrendingUp, AlertTriangle } from 'lucide-react';

const HeatmapVisualization = ({ storeId = 'STORE-001' }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedZone, setSelectedZone] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [viewMode, setViewMode] = useState('heatmap'); // 'heatmap' or 'density'
  
  // Generador de puntos de calor realistas
  const generateHeatPoints = (zone) => {
    const points = [];
    const numPoints = Math.floor(zone.detections / 8); // Más detecciones = más puntos
    
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: zone.x + Math.random() * zone.width,
        y: zone.y + Math.random() * zone.height,
        intensity: 0.3 + Math.random() * 0.7,
        size: 3 + Math.random() * 5
      });
    }
    return points;
  };

  const [heatmapData] = useState({
    zones: [
      {
        id: 'zone-1',
        name: 'Entrada Principal',
        x: 8,
        y: 12,
        width: 25,
        height: 20,
        detections: 1247,
        risk_level: 'CRITICAL',
        color: 'rgb(220, 38, 38)',
        avgDwellTime: '2.3 min',
        peakHour: '18:00',
        trend: '+18%',
      },
      {
        id: 'zone-2',
        name: 'Área de Ventas',
        x: 38,
        y: 15,
        width: 35,
        height: 45,
        detections: 2156,
        risk_level: 'CRITICAL',
        color: 'rgb(185, 28, 28)',
        avgDwellTime: '8.5 min',
        peakHour: '19:00',
        trend: '+24%',
      },
      {
        id: 'zone-3',
        name: 'Mostrador',
        x: 40,
        y: 65,
        width: 28,
        height: 22,
        detections: 1834,
        risk_level: 'HIGH',
        color: 'rgb(239, 68, 68)',
        avgDwellTime: '3.1 min',
        peakHour: '17:00',
        trend: '+15%',
      },
      {
        id: 'zone-4',
        name: 'Pasillo Norte',
        x: 10,
        y: 38,
        width: 22,
        height: 35,
        detections: 456,
        risk_level: 'MEDIUM',
        color: 'rgb(245, 158, 11)',
        avgDwellTime: '1.2 min',
        peakHour: '16:00',
        trend: '+8%',
      },
      {
        id: 'zone-5',
        name: 'Almacén',
        x: 75,
        y: 18,
        width: 18,
        height: 55,
        detections: 178,
        risk_level: 'LOW',
        color: 'rgb(34, 197, 94)',
        avgDwellTime: '12.5 min',
        peakHour: '14:00',
        trend: '-3%',
      },
      {
        id: 'zone-6',
        name: 'Salida Trasera',
        x: 75,
        y: 78,
        width: 18,
        height: 15,
        detections: 289,
        risk_level: 'MEDIUM',
        color: 'rgb(251, 191, 36)',
        avgDwellTime: '0.8 min',
        peakHour: '20:00',
        trend: '+5%',
      },
    ],
  });

  const [detectionPatterns] = useState([
    {
      time: '00:00',
      detections:
        [45, 32, 28, 25, 22, 35, 58, 125, 234, 312, 385, 428, 456, 512, 478, 524, 587, 645, 712, 698, 623, 456, 289, 156],
    },
  ]);

  const [zoneStats, setZoneStats] = useState(null);

  const totalDetections = heatmapData.zones.reduce((sum, zone) => sum + zone.detections, 0);

  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
  };

  const handleZoom = (direction) => {
    if (direction === 'in' && zoomLevel < 2) {
      setZoomLevel(zoomLevel + 0.2);
    } else if (direction === 'out' && zoomLevel > 0.8) {
      setZoomLevel(zoomLevel - 0.2);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold">Mapa de Calor de Actividad</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="flex bg-gray-900 rounded-lg p-1">
              {['1h', '6h', '24h', '7d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                    timeRange === range
                      ? 'bg-cyan-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-900 rounded-lg p-1">
              <button
                onClick={() => setViewMode('heatmap')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  viewMode === 'heatmap'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Calor
              </button>
              <button
                onClick={() => setViewMode('density')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  viewMode === 'density'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Densidad
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Container */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-400">
                Total: <span className="font-bold text-white">{heatmapData.zones.reduce((sum, z) => sum + z.detections, 0).toLocaleString()}</span> detecciones
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleZoom('out')}
              className="bg-gray-700 hover:bg-gray-600 p-2 rounded transition disabled:opacity-50"
              disabled={zoomLevel <= 0.8}
              title="Alejar Zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-400 px-3 py-2 bg-gray-900 rounded">
              {(zoomLevel * 100).toFixed(0)}%
            </span>
            <button
              onClick={() => handleZoom('in')}
              className="bg-gray-700 hover:bg-gray-600 p-2 rounded transition disabled:opacity-50"
              disabled={zoomLevel >= 2}
              title="Acercar Zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Heatmap SVG */}
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 rounded-lg overflow-hidden border border-gray-700 relative shadow-2xl">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-[600px]"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            {/* Background Pattern */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1f2937" strokeWidth="0.3"/>
              </pattern>
              
              {/* Gradient definitions for realistic heat effect */}
              <radialGradient id="heat-critical">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.9"/>
                <stop offset="50%" stopColor="#b91c1c" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.2"/>
              </radialGradient>
              
              <radialGradient id="heat-high">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#dc2626" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#991b1b" stopOpacity="0.2"/>
              </radialGradient>
              
              <radialGradient id="heat-medium">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7"/>
                <stop offset="50%" stopColor="#d97706" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.1"/>
              </radialGradient>
              
              <radialGradient id="heat-low">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6"/>
                <stop offset="50%" stopColor="#16a34a" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#15803d" stopOpacity="0.1"/>
              </radialGradient>

              {/* Blur filter for realistic heat blur */}
              <filter id="blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
              </filter>
            </defs>

            {/* Store Layout Background */}
            <rect x="0" y="0" width="100" height="100" fill="url(#grid)" />
            <rect x="0" y="0" width="100" height="100" fill="none" stroke="#374151" strokeWidth="0.5" />

            {viewMode === 'heatmap' ? (
              <>
                {/* Realistic Heat Points with blur */}
                {heatmapData.zones.map((zone) => {
                  const heatPoints = generateHeatPoints(zone);
                  const gradientId = 
                    zone.risk_level === 'CRITICAL' ? 'heat-critical' :
                    zone.risk_level === 'HIGH' ? 'heat-high' :
                    zone.risk_level === 'MEDIUM' ? 'heat-medium' : 'heat-low';
                  
                  return (
                    <g key={`heat-${zone.id}`} filter="url(#blur)">
                      {heatPoints.map((point, idx) => (
                        <circle
                          key={`point-${idx}`}
                          cx={point.x}
                          cy={point.y}
                          r={point.size}
                          fill={`url(#${gradientId})`}
                          opacity={point.intensity}
                        />
                      ))}
                    </g>
                  );
                })}

                {/* Zone Overlays with interactive regions */}
                {heatmapData.zones.map((zone) => (
                  <g
                    key={zone.id}
                    onClick={() => handleZoneClick(zone)}
                    style={{ cursor: 'pointer' }}
                    className="transition-opacity hover:opacity-90"
                  >
                    {/* Zone Border */}
                    <rect
                      x={zone.x}
                      y={zone.y}
                      width={zone.width}
                      height={zone.height}
                      fill={zone.color}
                      opacity={selectedZone?.id === zone.id ? "0.25" : "0.08"}
                      stroke={zone.color}
                      strokeWidth={selectedZone?.id === zone.id ? "1" : "0.5"}
                      strokeDasharray={selectedZone?.id === zone.id ? "2,2" : "none"}
                      className="transition-all"
                    />

                    {/* Zone Label Background */}
                    <rect
                      x={zone.x + 1}
                      y={zone.y + 1}
                      width={zone.name.length * 1.8 + 2}
                      height="4"
                      fill="#000000"
                      opacity="0.7"
                      rx="0.5"
                    />

                    {/* Zone Name */}
                    <text
                      x={zone.x + 2}
                      y={zone.y + 3.5}
                      fill="#ffffff"
                      fontSize="2"
                      fontWeight="600"
                      pointerEvents="none"
                    >
                      {zone.name}
                    </text>

                    {/* Detection Count Badge */}
                    <g transform={`translate(${zone.x + zone.width - 8}, ${zone.y + zone.height - 6})`}>
                      <rect
                        width="7"
                        height="4"
                        fill={zone.color}
                        opacity="0.95"
                        rx="1"
                      />
                      <text
                        x="3.5"
                        y="2.8"
                        textAnchor="middle"
                        fill="white"
                        fontSize="1.8"
                        fontWeight="bold"
                        pointerEvents="none"
                      >
                        {zone.detections > 999 ? `${(zone.detections/1000).toFixed(1)}k` : zone.detections}
                      </text>
                    </g>

                    {/* Activity Pulse Indicator */}
                    {zone.risk_level === 'CRITICAL' && (
                      <circle
                        cx={zone.x + zone.width - 2}
                        cy={zone.y + 2}
                        r="1.2"
                        fill="#ef4444"
                        className="animate-pulse"
                      >
                        <animate
                          attributeName="r"
                          values="1.2;1.8;1.2"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="1;0.5;1"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                ))}
              </>
            ) : (
              <>
                {/* Density Mode - Solid colored zones */}
                {heatmapData.zones.map((zone) => (
                  <g
                    key={zone.id}
                    onClick={() => handleZoneClick(zone)}
                    style={{ cursor: 'pointer' }}
                    className="transition-opacity hover:opacity-80"
                  >
                    <rect
                      x={zone.x}
                      y={zone.y}
                      width={zone.width}
                      height={zone.height}
                      fill={zone.color}
                      opacity="0.6"
                      stroke={zone.color}
                      strokeWidth="0.8"
                    />

                    {/* Detection number */}
                    <text
                      x={zone.x + zone.width / 2}
                      y={zone.y + zone.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="4"
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      {zone.detections}
                    </text>

                    {/* Zone label */}
                    <text
                      x={zone.x + zone.width / 2}
                      y={zone.y + zone.height / 2 + 5}
                      textAnchor="middle"
                      fill="#d1d5db"
                      fontSize="1.8"
                      pointerEvents="none"
                    >
                      {zone.name}
                    </text>
                  </g>
                ))}
              </>
            )}
          </svg>
        </div>

        {/* Enhanced Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Crítico', color: 'bg-red-700', textColor: 'text-red-300', range: '> 1500' },
            { label: 'Alto', color: 'bg-red-500', textColor: 'text-red-200', range: '800 - 1500' },
            { label: 'Medio', color: 'bg-yellow-500', textColor: 'text-yellow-200', range: '200 - 800' },
            { label: 'Bajo', color: 'bg-green-500', textColor: 'text-green-200', range: '< 200' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 bg-gray-900 p-2 rounded">
              <div className={`w-4 h-4 rounded ${item.color} shadow-lg`}></div>
              <div className="flex-1">
                <div className={`text-sm font-semibold ${item.textColor}`}>{item.label}</div>
                <div className="text-xs text-gray-500">{item.range}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Details & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone Details */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Detalles de Zona
          </h3>
          {selectedZone ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg p-5 border border-gray-600 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded shadow-lg"
                      style={{ backgroundColor: selectedZone.color }}
                    ></div>
                    <h4 className="text-xl font-bold">{selectedZone.name}</h4>
                  </div>
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor:
                        selectedZone.risk_level === 'CRITICAL' ? '#7f1d1d' :
                        selectedZone.risk_level === 'HIGH' ? '#991b1b' :
                        selectedZone.risk_level === 'MEDIUM' ? '#b45309' : '#15803d',
                      color:
                        selectedZone.risk_level === 'CRITICAL' ? '#fca5a5' :
                        selectedZone.risk_level === 'HIGH' ? '#fecaca' :
                        selectedZone.risk_level === 'MEDIUM' ? '#fcd34d' : '#86efac',
                    }}
                  >
                    {selectedZone.risk_level === 'CRITICAL' ? 'CRÍTICO' :
                     selectedZone.risk_level === 'HIGH' ? 'ALTO' :
                     selectedZone.risk_level === 'MEDIUM' ? 'MEDIO' : 'BAJO'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Detecciones (24h)</p>
                    <p className="text-2xl font-bold text-white">{selectedZone.detections.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">% del Total</p>
                    <p className="text-2xl font-bold text-white">
                      {((selectedZone.detections / totalDetections) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Tiempo Promedio</p>
                    <p className="text-lg font-bold text-cyan-400">{selectedZone.avgDwellTime}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Hora Pico</p>
                    <p className="text-lg font-bold text-purple-400">{selectedZone.peakHour}</p>
                  </div>
                </div>

                {/* Area info */}
                <div className="flex justify-between items-center text-sm border-t border-gray-700 pt-3">
                  <span className="text-gray-400">Área de la Zona</span>
                  <span className="font-semibold text-white">
                    {(selectedZone.width * selectedZone.height * 0.25).toFixed(1)} m²
                  </span>
                </div>

                {/* Density Progress */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold text-gray-400">DENSIDAD DE DETECCIÓN</p>
                    <span className="text-xs font-bold text-white">
                      {(selectedZone.detections / (selectedZone.width * selectedZone.height * 0.25)).toFixed(0)} /m²
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full shadow-lg transition-all duration-500"
                      style={{
                        width: `${Math.min((selectedZone.detections / 2200) * 100, 100)}%`,
                        background: `linear-gradient(90deg, ${selectedZone.color}, ${selectedZone.color}dd)`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Trend indicator */}
                <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                  <span className="text-sm text-gray-400">Tendencia (7 días)</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`w-4 h-4 ${selectedZone.trend.startsWith('+') ? 'text-red-400' : 'text-green-400'}`} />
                    <span className={`font-bold ${selectedZone.trend.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>
                      {selectedZone.trend}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className={`rounded-lg p-4 border ${
                selectedZone.risk_level === 'CRITICAL' || selectedZone.risk_level === 'HIGH'
                  ? 'bg-red-500/10 border-red-500/40'
                  : 'bg-blue-500/10 border-blue-500/40'
              }`}>
                <p className="text-sm flex items-start gap-2">
                  <Activity className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    selectedZone.risk_level === 'CRITICAL' || selectedZone.risk_level === 'HIGH'
                      ? 'text-red-400'
                      : 'text-blue-400'
                  }`} />
                  <span className={
                    selectedZone.risk_level === 'CRITICAL' || selectedZone.risk_level === 'HIGH'
                      ? 'text-red-300'
                      : 'text-blue-300'
                  }>
                    <strong>Recomendación:</strong>{' '}
                    {selectedZone.risk_level === 'CRITICAL' 
                      ? 'Zona de alta actividad crítica. Considere aumentar la cobertura de cámaras y presencia de personal de seguridad. Revisar incidentes pasados en esta área.'
                      : selectedZone.risk_level === 'HIGH'
                      ? 'Actividad elevada detectada. Incrementar monitoreo durante horas pico y considerar personal adicional.'
                      : selectedZone.risk_level === 'MEDIUM'
                      ? 'Actividad moderada. Mantener vigilancia regular y revisar patrones de tráfico.'
                      : 'Actividad baja y normal. Continuar con monitoreo estándar y revisar cambios en patrones.'}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <MapPin className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p className="text-lg">Selecciona una zona en el mapa de calor</p>
              <p className="text-sm mt-1">Haz clic en cualquier área para ver detalles</p>
            </div>
          )}
        </div>

        {/* Detection Timeline */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Actividad de Detección (24h)
          </h3>
          <div className="space-y-1.5">
            {detectionPatterns[0].detections.map((count, idx) => {
              const maxCount = Math.max(...detectionPatterns[0].detections);
              const percentage = (count / maxCount) * 100;
              const isPeak = count >= maxCount * 0.9;
              const isLow = count <= maxCount * 0.3;
              
              return (
                <div key={idx} className="flex items-center gap-2 group">
                  <span className="text-xs text-gray-500 w-12 font-mono">
                    {String(idx).padStart(2, '0')}:00
                  </span>
                  <div className="flex-1 bg-gray-900 rounded-lg h-8 overflow-hidden relative shadow-inner">
                    <div
                      className={`h-full transition-all duration-300 group-hover:opacity-80 ${
                        isPeak
                          ? 'bg-gradient-to-r from-red-600 to-red-500'
                          : isLow
                          ? 'bg-gradient-to-r from-green-600 to-green-500'
                          : 'bg-gradient-to-r from-cyan-600 to-purple-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/10"></div>
                    </div>
                    {percentage > 40 && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white">
                        {count.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-semibold w-16 text-right ${
                    isPeak ? 'text-red-400' : isLow ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Enhanced Statistics */}
          <div className="mt-6 pt-4 border-t border-gray-700 grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-lg p-3 border border-red-700/30">
              <p className="text-xs text-red-400 mb-1 font-semibold">Hora Pico</p>
              <p className="text-xl font-bold text-white">19:00</p>
              <p className="text-xs text-red-300 mt-1">712 detecciones</p>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-lg p-3 border border-green-700/30">
              <p className="text-xs text-green-400 mb-1 font-semibold">Hora Baja</p>
              <p className="text-xl font-bold text-white">04:00</p>
              <p className="text-xs text-green-300 mt-1">25 detecciones</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-lg p-3 border border-cyan-700/30">
              <p className="text-xs text-cyan-400 mb-1 font-semibold">Promedio</p>
              <p className="text-xl font-bold text-white">
                {(detectionPatterns[0].detections.reduce((a, b) => a + b, 0) / 24).toFixed(0)}
              </p>
              <p className="text-xs text-cyan-300 mt-1">detecciones/hora</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Overview Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold mb-4">Resumen de Todas las Zonas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-900/50">
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Zona</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Detecciones</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">% Total</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Tiempo Prom.</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Nivel de Riesgo</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Tendencia</th>
              </tr>
            </thead>
            <tbody>
              {heatmapData.zones
                .sort((a, b) => b.detections - a.detections)
                .map((zone, idx) => (
                <tr
                  key={zone.id}
                  className={`border-b border-gray-700/50 hover:bg-gray-700/30 cursor-pointer transition ${
                    selectedZone?.id === zone.id ? 'bg-gray-700/50' : ''
                  }`}
                  onClick={() => handleZoneClick(zone)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded shadow"
                        style={{ backgroundColor: zone.color }}
                      ></div>
                      <span className="font-semibold">{zone.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-white">{zone.detections.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-900 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(zone.detections / totalDetections) * 100}%`,
                            backgroundColor: zone.color
                          }}
                        ></div>
                      </div>
                      <span className="text-gray-300 font-medium">
                        {((zone.detections / totalDetections) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-cyan-400 font-medium">{zone.avgDwellTime}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="px-3 py-1.5 rounded-full text-xs font-bold inline-block"
                      style={{
                        backgroundColor:
                          zone.risk_level === 'CRITICAL' ? '#7f1d1d' :
                          zone.risk_level === 'HIGH' ? '#991b1b' :
                          zone.risk_level === 'MEDIUM' ? '#b45309' : '#15803d',
                        color:
                          zone.risk_level === 'CRITICAL' ? '#fca5a5' :
                          zone.risk_level === 'HIGH' ? '#fecaca' :
                          zone.risk_level === 'MEDIUM' ? '#fcd34d' : '#86efac',
                      }}
                    >
                      {zone.risk_level === 'CRITICAL' ? 'CRÍTICO' :
                       zone.risk_level === 'HIGH' ? 'ALTO' :
                       zone.risk_level === 'MEDIUM' ? 'MEDIO' : 'BAJO'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`w-4 h-4 ${
                        zone.trend.startsWith('+') ? 'text-red-400' : 'text-green-400'
                      }`} />
                      <span className={`font-bold text-sm ${
                        zone.trend.startsWith('+') ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {zone.trend}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-lg p-4 border border-purple-700/30">
            <p className="text-sm text-gray-400 mb-1">Total de Detecciones</p>
            <p className="text-3xl font-bold text-white">{totalDetections.toLocaleString()}</p>
            <p className="text-xs text-cyan-400 mt-2">Últimas 24 horas</p>
          </div>
          <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-lg p-4 border border-red-700/30">
            <p className="text-sm text-gray-400 mb-1">Zonas de Alto Riesgo</p>
            <p className="text-3xl font-bold text-red-400">
              {heatmapData.zones.filter(z => z.risk_level === 'CRITICAL' || z.risk_level === 'HIGH').length}
            </p>
            <p className="text-xs text-red-300 mt-2">Requieren atención inmediata</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-lg p-4 border border-green-700/30">
            <p className="text-sm text-gray-400 mb-1">Zona Más Activa</p>
            <p className="text-xl font-bold text-green-400">
              {heatmapData.zones.reduce((max, zone) => zone.detections > max.detections ? zone : max).name}
            </p>
            <p className="text-xs text-green-300 mt-2">
              {heatmapData.zones.reduce((max, zone) => zone.detections > max.detections ? zone : max).detections.toLocaleString()} detecciones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapVisualization;
