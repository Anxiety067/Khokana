import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import './Statistics.css';

const Statistics = ({ vectorLayers, onVectorLayerChange }) => {
  const statusData = [
    { name: 'Government', value: 94 },
    { name: 'Guthi', value: 132 },
    { name: 'Non-Newar', value: 205 },
    { name: 'Joint Non-Newar', value: 43 },
    { name: 'Newar', value: 676 },
    { name: 'Joint Newar', value: 206 },
    { name: 'Institutional', value: 40 },
    { name: 'Communal', value: 1},
    { name: 'Unknown Ownership', value: 182 }
  ];

  const COLORS = ['#32cd32', '#ff0000', '#0000ff', '#87cefa', '#ffd700', '#f0e68c', '#9C27B0', '#795548', '#9E9E9E'];

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius,
    value
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
    return (
      <text 
        x={x} 
        y={y} 
        fill="#f0ffff" 
        textAnchor="middle" 
        dominantBaseline="middle"
        className="value-label"
      >
        {value}
      </text>
    );
  };

  return (
    <div className="statistics-container">
      <div className="statistics-content">
        {/* Land Category Status Box */}
        <div className="section-box">
          <div className="chart-section">
            <h3 className="chart-title">Land Category Status</h3>
            <div className="chart-container">
              <PieChart width={200} height={200}>
                <Pie
                  data={statusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="legend-container">
              {statusData.map((entry, index) => (
                <div key={entry.name} className="legend-item">
                  <div 
                    className="legend-color"
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="legend-text">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vector Layers Box */}
        <div className="section-box">
          <div className="vector-layers-section">
            <h3 className="chart-title">Vector Layers</h3>
            <div className="checkbox-container">
              <div className="checkbox-item">
                <input 
                  type="checkbox"
                  id="ward-boundary"
                  checked={vectorLayers.wardBoundary}
                  onChange={() => onVectorLayerChange('wardBoundary')}
                />
                <label htmlFor="ward-boundary">Ward Boundary</label>
              </div>
              
              <div className="checkbox-item">
                <input 
                  type="checkbox"
                  id="road-network"
                  checked={vectorLayers.roadNetwork}
                  onChange={() => onVectorLayerChange('roadNetwork')}
                />
                <label htmlFor="road-network">Road Network</label>
              </div>

              <div className="checkbox-item">
                <input 
                  type="checkbox"
                  id="parcel-layer"
                  checked={vectorLayers.parcelLayer}
                  onChange={() => onVectorLayerChange('parcelLayer')}
                />
                <label htmlFor="water-resources">Project-Affected Land Parcels</label>
              </div>
              
              <div className="checkbox-item">
                <input 
                  type="checkbox"
                  id="building-footprint"
                  checked={vectorLayers.buildingFootprint}
                  onChange={() => onVectorLayerChange('buildingFootprint')}
                />
                <label htmlFor="water-resources">Building Footprint</label>
              </div>

              <div className="checkbox-item">
                <input 
                  type="checkbox"
                  id="water-resources"
                  checked={vectorLayers.waterResources}
                  onChange={() => onVectorLayerChange('waterResources')}
                />
                <label htmlFor="water-resources">Water Resources</label>
              </div>

              <div className="checkbox-item">
                <input 
                  type="checkbox"
                  id="historical-places"
                  checked={vectorLayers.historicalPlaces}
                  onChange={() => onVectorLayerChange('historicalPlaces')}
                />
                <label htmlFor="historical-places">Historical Places</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;