import { useEffect, useState } from "react";
import { Coordinate } from "../types/types";

import "./Path.css";

interface PathProps {
  rows: number;
  points: Coordinate[];
}

function Path({ rows, points }: PathProps) {
  const [cellSize, setCellSize] = useState<number>(60);
  const color = "#514904";

  useEffect(() => {
    const path_layer = document.querySelector(".path-layer");

    if (path_layer) {
      const value = window
        .getComputedStyle(path_layer)
        .getPropertyValue("height");

      const parsed = parseFloat(value.trim().replace("px", ""));

      if (!isNaN(parsed)) {
        setCellSize(parsed / rows);
      }
    }
  }, [rows]);

  const getCellCenter = (row: number, col: number) => {
    return {
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2,
    };
  };

  const drawPath = () => {
    const path = points
      .map((point: Coordinate, index) => {
        const { x, y } = getCellCenter(point.row, point.column);
        return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(" ");
    return <path d={path} stroke={color} strokeWidth="3" fill="none" />;
  };

  return <svg className="path-layer">{drawPath()}</svg>;
}

export default Path;
