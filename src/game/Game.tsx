import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Board } from "../types/types";
import config from "../config";
import Tile from "./Tile";
import "./Game.css";

function Game() {
  const { level, roomId } = useParams();
  const wsRef = useRef<WebSocket | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [x1, setX1] = useState<string>("");
  const [y1, setY1] = useState<string>("");
  const [x2, setX2] = useState<string>("");
  const [y2, setY2] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      console.error("User not authenticated?");
      return;
    }

    const ws = new WebSocket(
      `ws://${config.serverHost}:${config.serverPort}/game/join/${roomId}?authToken=${token}`
    );

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      wsRef.current = ws;
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Message from server:", message);
      // TODO: Update game state based on the message
      console.log(message.playerBoards[username]);
      setBoard(message.playerBoards[username]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }, [roomId]);

  const sendMatch = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        type: "Match",
        p1: {
          row: x1,
          column: y1,
        },
        p2: {
          row: x2,
          column: y2,
        },
      };
      wsRef.current.send(JSON.stringify(message));
      console.log("Message sent:", message);
    } else {
      console.error("WebSocket is not connected");
    }
  };

  return (
    <div className="game-container">
      <h1>Link Game</h1>
      <div className="game">
        <div className={`board ${level}-grid`}>
          {board ? (
            board.map((row, rowIndex) =>
              row.map((tile, colIndex) => (
                <Tile key={`${rowIndex}-${colIndex}`} value={tile} />
              ))
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className="points-selection">
          <form className="points-form" onSubmit={sendMatch}>
            <div className="point-form">
              <label htmlFor="point1" className="point-label">
                Coordinates of 1st tile
              </label>
              <div className="input-field">
                <span className="input-label">X1</span>
                <input
                  name="x1"
                  type="number"
                  value={x1}
                  onChange={(e) => setX1(e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <span className="input-label">Y1</span>
                <input
                  name="y1"
                  type="number"
                  value={y1}
                  onChange={(e) => setY1(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="point-form">
              <label htmlFor="point2" className="point-label">
                Coordinates of 2nd tile
              </label>
              <div className="input-field">
                <span className="input-label">X2</span>
                <input
                  name="x2"
                  type="number"
                  required
                  onChange={(e) => setX2(e.target.value)}
                  value={x2}
                />
              </div>
              <div className="input-field">
                <span className="input-label">Y2</span>
                <input
                  name="y2"
                  type="number"
                  required
                  value={y2}
                  onChange={(e) => setY2(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="send-button">
              Match Tiles
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Game;
