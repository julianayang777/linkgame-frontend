import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Board, Coordinate } from "../types/types";
import config from "../config";
import Tile from "./Tile";
import "./Game.css";
import Header from "../components/Header";

function Game() {
  const { level, roomId } = useParams();
  const wsRef = useRef<WebSocket | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [tile1, setTile1] = useState<Coordinate | null>(null);
  const [tile2, setTile2] = useState<Coordinate | null>(null);
  /* TEMP: Game Message */
  const [gameMessage, setGameMessage] = useState<string>("");

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
      // TODO: Update game state based on the message
      console.log("Message from server:", message);
      if (message.type === "Awaiting") {
        console.log("Awaiting other players");
        setGameMessage("Waiting for other players to join...");
      } else if (message.type === "GameStartsSoon") {
        console.log("Game start soon in 5 seconds");
        setGameMessage("Game starting soon...");
      } else if (message.type === "InProgress") {
        console.log("Game in progress");
        console.log(message.playerBoards[username]);
        setBoard(message.playerBoards[username]);
      } else if (message.type === "Win") {
        console.log(`Player "${message.winner.name}" wins!`);
        setBoard(null);
        setGameMessage(`Player "${message.winner.name}" wins!`);
      }
    };

    ws.onerror = async (error) => {
      console.error("WebSocket error:", error);
      /* Maybe the game has ended */
      try {
        const response = await fetch(
          `http://${config.serverHost}:${config.serverPort}/game/${roomId}/status`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const gameStatus = await response.json();
          console.log("Game status:", gameStatus);
          if (gameStatus.type === "Win") {
            setGameMessage(
              `Game has ended\n Player "${gameStatus.winner.name}" won!`
            );
          } else {
            setGameMessage("Game Status = " + gameStatus.type);
          }
        }
      } catch (error) {
        console.error("Error fetching game status:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }, [roomId]);

  useEffect(() => {
    if (tile1 && tile2) {
      console.log("Tiles selected:", tile1, tile2);
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const message = {
          type: "Match",
          p1: {
            row: tile1.x,
            column: tile1.y,
          },
          p2: {
            row: tile2.x,
            column: tile2.y,
          },
        };
        wsRef.current.send(JSON.stringify(message));
        console.log("Message sent:", message);
      } else {
        console.error("WebSocket is not connected");
      }
      setTile1(null);
      setTile2(null);
    }
  }, [tile1, tile2]);

  const handleClick = (x: number, y: number) => {
    console.log("Tile clicked at coordinates:", x, y);
    return tile1 ? setTile2({ x, y }) : setTile1({ x, y });
  };

  return (
    // TODO: Error handling
    <div className="game-container">
      <Header />
      <div className="game">
        {board ? (
          <div className={`board ${level}-grid`}>
            {board.map((row, rowIndex) =>
              row.map((tile, colIndex) => (
                <Tile
                  key={`${rowIndex}-${colIndex}`}
                  value={tile}
                  position={{ x: rowIndex, y: colIndex }}
                  isSelected={
                    (tile1 && tile1.x === rowIndex && tile1.y === colIndex) ||
                    (tile2 && tile2.x === rowIndex && tile2.y === colIndex) ||
                    false
                  }
                  onClick={handleClick}
                />
              ))
            )}
          </div>
        ) : (
          <p>{gameMessage}</p>
        )}
      </div>
    </div>
  );
}

export default Game;
