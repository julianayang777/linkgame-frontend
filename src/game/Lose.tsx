import { Finished } from "../types/types";
import sad from "../assets/sad.png";
import "./Lose.css";
import { millisecondsToTime } from "../utils/utils";

interface LoseProps {
  state: Finished;
}

function Lose({ state }: LoseProps) {
  return (
    <div className="game-state lose">
      <img src={sad} alt="Sad" className="sad" />
      <h2>Game Over</h2>
      <p className="game-message">
        Player <span className="bold">{state.winner.name}</span> won!{" "}
        <span className="bold">Time Taken: </span>
        {millisecondsToTime(state.timeTaken)})
      </p>
    </div>
  );
}

export default Lose;
