import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ROICalculator = ({ storeId = 'STORE-001' }) => {
  const [roiData, setRoiData] = useState({
    roi_percentage: 3162.21,
    savings_achieved: 9701,
    projected_losses: 10000,
    subscription_cost: 299,
    period_days: 30,
    gross_revenue_estimate: 100000,
  });

  const [chartData, setChartData] = useState([
    { day: 'Day 1', cumulative_savings: 323, subscription_cost: 299 },
    { day: 'Day 5', cumulative_savings: 1615, subscription_cost: 299 },
    { day: 'Day 10', cumulative_savings: 3230, subscription_cost: 299 },
    { day: 'Day 15', cumulative_savings: 4845, subscription_cost: 299 },
    { day: 'Day 20', cumulative_savings: 6460, subscription_cost: 299 },
    { day: 'Day 25', cumulative_savings: 8075, subscription_cost: 299 },
    { day: 'Day 30', cumulative_savings: 9701, subscription_cost: 299 },
  ]);

  const [breakdown, setBreakdown] = useState([
    {
      category: 'Prevención de Robo',
      value: 5000,
      percentage: 51.5,
    },
    {
      category: 'Prevención de Vandalismo',
      value: 2500,
      percentage: 25.8,
    },
    {
      category: 'Incidentes de Seguridad',
      value: 1500,
      percentage: 15.5,
    },
    {
      category: 'Seguridad de Empleados',
      value: 701,
      percentage: 7.2,
    },
  ]);

  const paybackDays = Math.ceil(roiData.subscription_cost / (roiData.savings_achieved / roiData.period_days));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ROI Percentage */}
        <div className="bg-gray-800 rounded-lg p-6 border border-green-500/40">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-semibold">ROI %</h3>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-400 mb-1">
            {roiData.roi_percentage.toFixed(0)}%
          </p>
          <p className="text-xs text-gray-500">Retorno de inversión mensual</p>
        </div>

        {/* Savings Achieved */}
        <div className="bg-gray-800 rounded-lg p-6 border border-emerald-500/40">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-semibold">Ahorros</h3>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-emerald-400 mb-1">
            S/ {roiData.savings_achieved.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Pérdidas evitadas este mes</p>
        </div>

        {/* Projected Losses */}
        <div className="bg-gray-800 rounded-lg p-6 border border-red-500/40">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-semibold">Pérdida Proyectada</h3>
            <BarChart3 className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-400 mb-1">
            S/ {roiData.projected_losses.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Sin sistema de seguridad</p>
        </div>

        {/* Payback Period */}
        <div className="bg-gray-800 rounded-lg p-6 border border-blue-500/40">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-semibold">Recuperación</h3>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-400 mb-1">{paybackDays} días</p>
          <p className="text-xs text-gray-500">Hasta cubrir costo de suscripción</p>
        </div>
      </div>

      {/* ROI Over Time */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold mb-4">Proyección de ROI (Período de 30 Días)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis dataKey="day" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #404040',
              }}
              formatter={(value) => `S/ ${value.toLocaleString()}`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="cumulative_savings"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSavings)"
              name="Ahorros Acumulados"
            />
            <Line
              type="monotone"
              dataKey="subscription_cost"
              stroke="#ef4444"
              strokeWidth={2}
              name="Suscripción Mensual"
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Savings Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-bold mb-4">Desglose de Ahorros</h3>
          <div className="space-y-3">
            {breakdown.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-gray-300">{item.category}</p>
                  <p className="text-sm font-bold text-green-400">
                    S/ {item.value.toLocaleString()}
                  </p>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.percentage.toFixed(1)}% of total</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-bold mb-4">Métricas Clave</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">Ingresos Mensuales Brutos</p>
                <p className="text-lg font-semibold text-white">
                  S/ {roiData.gross_revenue_estimate.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">Riesgo de Seguridad (Impuesto Oculto)</p>
                <p className="text-lg font-semibold text-red-400">10%</p>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">Suscripción Mensual</p>
                <p className="text-lg font-semibold text-white">
                  S/ {roiData.subscription_cost}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-start border-t border-gray-700 pt-4">
              <div>
                <p className="text-sm text-gray-400">Beneficio Mensual Neto</p>
                <p className="text-lg font-semibold text-green-400">
                  S/ {(roiData.savings_achieved - roiData.subscription_cost).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-300">
                <strong>💡 Insight:</strong> Tu sistema se paga solo en{' '}
                <strong>{paybackDays} días</strong>. ¡Después de eso, es pura ganancia!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
