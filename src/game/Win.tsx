import { Finished } from "../types/types";
import trophy from "../assets/trophy.png";
import "./Win.css";
import { millisecondsToTime } from "../utils/utils";

interface WinProps {
  state: Finished;
}

function Win({ state }: WinProps) {
  return (
    <div className="game-state win">
      <h2>You win!</h2>
      <img src={trophy} alt="Trophy" className="trophy" />
      <p>
        Congratulations <span className="bold">{state.winner.name}</span>!
        <br />
        <span className="bold">Time Taken: </span>
        {millisecondsToTime(state.timeTaken)}
      </p>
    </div>
  );
}

export default Win;
