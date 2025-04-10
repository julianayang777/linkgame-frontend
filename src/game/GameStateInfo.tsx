import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GameState } from "../types/types";
import "./GameStateInfo.css";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
interface GameStateInfoProps {
  state: GameState;
}

function GameStateInfo({ state }: GameStateInfoProps) {
  return (
    <div className="game-state game-info">
      <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
      <h3>Game State:</h3>
      {state.type === "AwaitingPlayers" ? (
        <p>Waiting for players to join...</p>
      ) : state.type === "GameStartsSoon" ? (
        <p>Game starts in {state.startIn / 1000} seconds.</p>
      ) : state.type === "InProgress" ? (
        <p>Game in progress...</p>
      ) : state.type === "Finished" ? (
        <p>Game finished! Player {state.winner.name} won!</p>
      ) : null}
    </div>
  );
}

export default GameStateInfo;
