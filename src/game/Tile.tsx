import { boardAssets, Coordinate } from "../types/types";
import "./Tile.css";

type TileProps = {
  value: number;
  position: Coordinate;
  isSelected: boolean;
  onClick: (position: Coordinate) => void;
};

function Tile({ value, onClick, position, isSelected }: TileProps) {
  const handleClick = () => {
    onClick(position);
  };

  return (
    <div
      className={`tile ${value === 0 ? "hidden" : ""} ${
        isSelected ? "selected" : ""
      }`}
      onClick={handleClick}
    >
      <span className="tile-content">{boardAssets[value]}</span>
    </div>
  );
}

export default Tile;
