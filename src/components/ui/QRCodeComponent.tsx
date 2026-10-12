import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeComponent: React.FC<QRCodeProps> = ({
  value,
  size = 140,
  className = '',
}) => {
  // Deterministic pseudo-random matrix generator based on value hash
  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const seed = hashString(value);
  const gridSize = 21; // Standard QR Version 1 grid size
  const cellSize = size / gridSize;

  // Generate 21x21 grid
  const cells: boolean[][] = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => false)
  );

  // Function to place 7x7 Finder Pattern at (r, c)
  const placeFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          i === 0 || i === 6 ||
          j === 0 || j === 6 ||
          (i >= 2 && i <= 4 && j >= 2 && j <= 4)
        ) {
          cells[r + i][c + j] = true;
        }
      }
    }
  };

  placeFinder(0, 0); // Top-left
  placeFinder(0, 14); // Top-right
  placeFinder(14, 0); // Bottom-left

  // Timing lines
  for (let i = 8; i < 13; i++) {
    cells[6][i] = i % 2 === 0;
    cells[i][6] = i % 2 === 0;
  }

  // Populate data area deterministically
  let pseudo = seed;
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Don't overwrite finders or timing lines
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c > 12) ||
        (r > 12 && c < 8) ||
        (r === 6) ||
        (c === 6)
      ) {
        continue;
      }
      pseudo = (pseudo * 9301 + 49297) % 233280;
      cells[r][c] = (pseudo / 233280) > 0.45;
    }
  }

  return (
    <div
      className={`inline-block p-2 bg-white rounded-xl shadow-lg border border-purple-200 ${className}`}
      style={{ width: size + 16, height: size + 16 }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
      >
        <rect width={size} height={size} fill="#ffffff" />
        {cells.map((row, r) =>
          row.map((active, c) =>
            active ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#0f172a"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
