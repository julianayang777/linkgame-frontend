import { boardAssets } from "../types/types";
import "./Tile.css";

type TileProps = {
  value: number;
};

function Tile({ value }: TileProps) {
  return <div className={`tile ${value === 0 ? "hidden" : ""}`}>
    <span className="tile-content">{boardAssets[value]}</span>
    </div>;
}

export default Tile;
