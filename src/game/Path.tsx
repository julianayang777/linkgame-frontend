import { Coordinate } from "../types/types";

import "./Path.css";

interface PathProps {
  points: Coordinate[];
}

function Path({ points }: PathProps) {
  const cellSize = 60;

  const getCellCenter = (row: number, col: number) => {
    return {
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2,
    };
  };

  const drawPath = () => {
    console.log("Drawing path with points:", points);
    const path = points
      .map((point: Coordinate, index) => {
        const { x, y } = getCellCenter(point.row, point.column);
        return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(" ");
    return <path d={path} stroke="black" strokeWidth="3.5" fill="none" />;
  };

  return <svg className="path-layer">{drawPath()}</svg>;
}

export default Path;
