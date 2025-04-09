import { Finished } from "../types/types";
import sad from "../assets/sad.png";
import "./Lose.css";

interface LoseProps {
  state: Finished;
}

function Lose({ state }: LoseProps) {
  return (
    <div className="game-state lose">
      <img src={sad} alt="Sad" className="sad" />
      <h2>Game Over</h2>
      <p className="game-message">Player {state.winner.name} won!</p>
    </div>
  );
}

export default Lose;
