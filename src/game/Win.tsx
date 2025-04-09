import { Finished } from "../types/types";
import trophy from "../assets/trophy.png";
import "./Win.css";

interface WinProps {
  state: Finished;
}

function Win({ state }: WinProps) {
  return (
    <div className="game-state win">
      <h2>You win!</h2>
      <img src={trophy} alt="Trophy" className="trophy" />
      <p> Congratulations {state.winner.name}!</p>
    </div>
  );
}

export default Win;
