import React from 'react';

const PiVisualization = () => {
  // Use a fixed diameter for clarity
  const diameter = 200;
  const radius = diameter / 2;
  const circumference = 2 * Math.PI * radius;
  
  // SVG dimensions with padding
  const svgWidth = diameter + 80;
  const svgHeight = diameter + 120;
  
  // Center coordinates
  const centerX = svgWidth / 2;
  const centerY = diameter / 2 + 40;

  return (
    <div className='' style={{ 
      textAlign: 'center',
      backgroundColor: '#1a1a2e',
      color: '#e0e0e0',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
      maxWidth: '600px',
      margin: '0 auto',
      marginTop: '10rem'
    }}>
      <h2 style={{ color: '#8a2be2', fontWeight: 'bold', textShadow: '0 0 5px rgba(138, 43, 226, 0.3)' }}>
        Visualizing Pi
      </h2>
      <p style={{ color: '#e0e0e0', marginBottom: '20px' }}>
        Pi (π) is the ratio of a circle&apos;s circumference to its diameter: {Math.PI.toFixed(5)}
      </p>
      <svg width={svgWidth} height={svgHeight} style={{ background: '#16213e', borderRadius: '8px', margin: '0 auto' }}>
        {/* Circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="rgba(66, 103, 244, 0.1)"
          stroke="#42a5f5"
          strokeWidth="2"
        />
        
        {/* Diameter line */}
        <line
          x1={centerX - radius}
          y1={centerY}
          x2={centerX + radius}
          y2={centerY}
          stroke="#f06292"
          strokeWidth="2"
        />
        
        {/* Diameter arrowheads */}
        <polygon 
          points={`${centerX - radius - 5},${centerY} ${centerX - radius},${centerY - 5} ${centerX - radius},${centerY + 5}`} 
          fill="#f06292" 
        />
        <polygon 
          points={`${centerX + radius + 5},${centerY} ${centerX + radius},${centerY - 5} ${centerX + radius},${centerY + 5}`} 
          fill="#f06292" 
        />
        
        {/* Circumference indicator - arc at top */}
        <path
          d={`M ${centerX - radius} ${centerY - 10} A ${radius} ${radius} 0 1 1 ${centerX + radius} ${centerY - 10}`}
          fill="none"
          stroke="#4caf50"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Labels */}
        <text
          x={centerX}
          y={centerY + radius + 30}
          textAnchor="middle"
          fontSize="16"
          fill="#e0e0e0"
        >
          Diameter = {diameter} units
        </text>
        
        <text
          x={centerX}
          y={centerY + radius + 50}
          textAnchor="middle"
          fontSize="16"
          fill="#e0e0e0"
        >
          Circumference = π × Diameter = {circumference.toFixed(2)} units
        </text>
        
        <text
          x={centerX}
          y={centerY - 5}
          textAnchor="middle"
          fontSize="14"
          fill="#f06292"
          fontWeight="bold"
        >
          d
        </text>
        
        <text
          x={centerX}
          y={centerY - radius - 15}
          textAnchor="middle"
          fontSize="14"
          fill="#4caf50"
          fontWeight="bold"
        >
          C = πd = 2πr
        </text>
      </svg>
      <p style={{ 
        marginTop: '15px', 
        color: '#81c784', 
        fontWeight: 'bold',
        fontSize: '18px',
        background: 'rgba(76, 175, 80, 0.1)', 
        padding: '8px',
        borderRadius: '5px'
      }}>
        π = Circumference ÷ Diameter = {(circumference / diameter).toFixed(5)}
      </p>
    </div>
  );
};

export default PiVisualization;
