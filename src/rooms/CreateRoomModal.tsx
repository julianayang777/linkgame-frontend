import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CreateRoomModal.css";
import { faStar, faXmark } from "@fortawesome/free-solid-svg-icons";
import { GameLevel } from "../types/types";
import { useState } from "react";

interface CreateRoomModalProps {
  errorMessage: string;
  onClose: () => void;
  onCreate: (numberOfPlayers: number, gameLevel: GameLevel) => void;
}

function CreateRoomModal({
  errorMessage,
  onClose,
  onCreate,
}: CreateRoomModalProps) {
  const [requiredPlayers, setRequiredPlayers] = useState<number | null>(null);
  const [gameLevel, setGameLevel] = useState<GameLevel>(GameLevel.EASY);
  const [error, setError] = useState<string>("");

  const handleRequiredPlayersChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const numberOfPlayers = parseInt(value);
    if (value === "") {
      setRequiredPlayers(null);
    } else if (!isNaN(numberOfPlayers)) {
      setRequiredPlayers(numberOfPlayers);
    }
  };

  const handleGameLevelChange = (level: GameLevel) => {
    setGameLevel(level);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requiredPlayers && requiredPlayers > 0) {
      onCreate(requiredPlayers, gameLevel);
    } else {
      setError("Number of players must be at least 1");
    }
  };

  return (
    <div className="modal">
      <div className="modal-header">
        <h3>Create New Room</h3>
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <div className="modal-content">
        <form className="create-room-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="number-players" className="number-players-label">
              Number of Players
            </label>
            <input
              type="text"
              id="number-players"
              name="number-players"
              placeholder="Enter number of players"
              value={requiredPlayers ?? ""}
              onChange={handleRequiredPlayersChange}
              min={1}
              required
            ></input>
          </div>
          <div className="form-group">
            <label htmlFor="difficulty" className="difficulty-label">
              Difficulty Level
            </label>
            <div className="difficulty-buttons">
              <button
                type="button"
                className={gameLevel === GameLevel.EASY ? "selected" : ""}
                onClick={() => handleGameLevelChange(GameLevel.EASY)}
              >
                <FontAwesomeIcon icon={faStar} className="green" />
                <span>Easy</span>
              </button>
              <button
                type="button"
                className={gameLevel === GameLevel.MEDIUM ? "selected" : ""}
                onClick={() => handleGameLevelChange(GameLevel.MEDIUM)}
              >
                <FontAwesomeIcon icon={faStar} className="yellow" />
                <span>Medium</span>
              </button>
              <button
                type="button"
                className={gameLevel === GameLevel.HARD ? "selected" : ""}
                onClick={() => handleGameLevelChange(GameLevel.HARD)}
              >
                <FontAwesomeIcon icon={faStar} className="red" />
                <span>Hard</span>
              </button>
            </div>
          </div>

          <div className={`form-error ${error ? "show" : ""}`}>
            {(error && `Error: ${error}`) || errorMessage}
          </div>

          <button type="submit" className="create-room-button">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRoomModal;
