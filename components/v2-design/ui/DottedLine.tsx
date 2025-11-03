import React from 'react';

interface DottedLineProps {
  height?: number;
  className?: string;
}

const DottedLine: React.FC<DottedLineProps> = ({ height = 200, className = '' }) => {
  return (
    <svg
      width="20"
      height={height}
      viewBox={`0 0 20 ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} dotted-line overflow-visible`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Circle at top */}
      <circle cx="10" cy="10" r="4" fill="black" className="pulse-circle" />

      {/* Dotted line */}
      <line
        x1="10"
        y1="16"
        x2="10"
        y2={height - 16}
        stroke="black"
        strokeWidth="2"
        strokeDasharray="4 8"
        className="drawing-line"
      />

      {/* Circle at bottom */}
      <circle cx="10" cy={height - 10} r="4" fill="black" className="pulse-circle" />
    </svg>
  );
};

export default DottedLine;
