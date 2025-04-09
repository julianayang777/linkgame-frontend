import { AwaitingPlayers } from "../types/types";
import "./Awaiting.css";

interface AwaitingProps {
  state: AwaitingPlayers;
}

function Awaiting({ state }: AwaitingProps) {
  return (
    <div className="game-state awaiting-players">
      <h3>Waiting for players...</h3>
      <p>{`${state.joinedPlayers} of ${state.requiredPlayers} players have joined`}</p>
      <progress
        className="progress-bar"
        value={state.joinedPlayers}
        max={state.requiredPlayers}
      />
    </div>
  );
}

export default Awaiting;
