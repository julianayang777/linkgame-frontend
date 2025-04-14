import { faMedal, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GameLevel, Leaderboard } from "../../types/types";
import { useState } from "react";
import "./LeaderboardModal.css";
import { millisecondsToTime } from "../../utils/utils";

interface LeaderboardModalProps {
  data: Leaderboard;
  errorMessage: string;
  onLevelChange: (level: GameLevel) => void;
  onClose: () => void;
}

function LeaderboardModal({
  data,
  errorMessage,
  onLevelChange,
  onClose,
}: LeaderboardModalProps) {
  const [activeTab, setActiveTab] = useState<string>("easy");

  const handleTabChange = (level: string) => {
    setActiveTab(level);
    onLevelChange(level as GameLevel);
  };

  const getRank = (index: number) => {
    if (index === 0)
      return <FontAwesomeIcon icon={faMedal} className="gold-star" />;
    if (index === 1)
      return <FontAwesomeIcon icon={faMedal} className="silver-star" />;
    if (index === 2)
      return <FontAwesomeIcon icon={faMedal} className="bronze-star" />;
    return `${index + 1}`;
  };

  return (
    <div className="modal leaderboard">
      <div className="modal-header">
        <h2>Leaderboard</h2>
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <div className="modal-tabs">
        {(Object.values(GameLevel) as string[]).map((difficulty) => (
          <button
            key={difficulty}
            className={`${activeTab === difficulty ? "active" : "inactive"}`}
            onClick={() => handleTabChange(difficulty)}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </button>
        ))}
      </div>
      {data && (
        <div className="modal-content">
          <div className="player-best-score">
            <p className="bold">Your best score:</p>
            <p className="score">{millisecondsToTime(data.playerBestScore)}</p>
          </div>

          {errorMessage && (
            <div className="error-message">
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="leaderboard-list">
            <h4>Top 10 Players</h4>
            <ul>
              {Array.from({ length: 10 }).map((_, index) => {
                const playerScore = data.topPlayers[index];
                return (
                  <li key={index} className="leaderboard-item">
                    <span className="rank">{getRank(index)}</span>
                    {playerScore ? (
                      <>
                        <span className="player-name">{playerScore[0]}</span>
                        <span className="player-score">
                          {millisecondsToTime(playerScore[1])}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="player-name">--</span>
                        <span className="player-score">--:--</span>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaderboardModal;
