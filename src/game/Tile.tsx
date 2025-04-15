import { boardAssets, Coordinate, GameLevel } from "../types/types";
import "./Tile.css";

type TileProps = {
  level?: GameLevel;
  value: number;
  position: Coordinate;
  isSelected: boolean;
  onClick: (position: Coordinate) => void;
};

function Tile({ level, value, onClick, position, isSelected }: TileProps) {
  const handleClick = () => {
    onClick(position);
  };

  return (
    <div
      className={`tile ${level ? `tile-${level}` : ""} 
        ${value === 0 ? "hidden" : ""} 
        ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <span className="tile-content">{boardAssets[value]}</span>
    </div>
  );
}

export default Tile;
