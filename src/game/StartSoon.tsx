import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { GameStartsSoon } from "../types/types";
import "./StartSoon.css";

interface StartSoonProps {
  state: GameStartsSoon;
}

function StartSoon({ state }: StartSoonProps) {
  const renderTime = ({ remainingTime }: { remainingTime: number }) => {
    if (remainingTime === 0) {
      return <div className="timer">Game starts now!</div>;
    }
    return (
      <div className="timer">
        <div className="value">{remainingTime}</div>
      </div>
    );
  };

  return (
    <div className="game-state start-soon">
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <linearGradient id="timer-color" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(79, 184, 129)" />
            <stop offset="100%" stopColor="rgb(31, 103, 255)" />
          </linearGradient>
        </defs>
      </svg>
      <h2>Game starts in </h2>
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying
          duration={state.startIn / 1000}
          colors="url(#timer-color)"
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
    </div>
  );
}

export default StartSoon;
