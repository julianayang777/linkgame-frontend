import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import {
  AwaitingPlayers,
  Board,
  Coordinate,
  ErrorMessage,
  Finished,
  GameStartsSoon,
  GameState,
  ServerResponseError,
} from "../types/types";
import config from "../config";
import Tile from "./Tile";
import "./Game.css";
import Header from "../components/Header";
import { removeQuotes } from "../utils/utils";
import Awaiting from "./Awaiting";
import StartSoon from "./StartSoon";
import Win from "./Win";
import Lose from "./Lose";

function Game() {
  const { level, roomId } = useParams();
  const wsRef = useRef<WebSocket | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [tile1, setTile1] = useState<Coordinate | null>(null);
  const [tile2, setTile2] = useState<Coordinate | null>(null);
  /* TEMP: Game Message */
  const [gameMessage, setGameMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      console.error("User not authenticated?");
      setError(ErrorMessage.UserNotAuthenticated);
      return;
    }

    const ws = new WebSocket(
      `ws://${config.serverHost}:${config.serverPort}/game/join/${roomId}?authToken=${token}`
    );

    ws.onopen = () => {
      console.debug("WebSocket connection opened");
      wsRef.current = ws;
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // TODO: Update game state based on the message
      console.debug("Message from server:", message);
      if (message.type === "AwaitingPlayers") {
        console.debug("Awaiting other players");
        const gameState: AwaitingPlayers = {
          type: "AwaitingPlayers",
          id: roomId!,
          level: message.gameLevel,
          joinedPlayers: message.players.length,
          requiredPlayers: message.requiredPlayers,
        };
        setGameState(gameState);
      } else if (message.type === "GameStartsSoon") {
        console.debug("Game start soon in 5 seconds");
        const gameState: GameStartsSoon = {
          type: "GameStartsSoon",
          id: roomId!,
          level: message.gameLevel,
          joinedPlayers: message.players,
          startIn: message.startIn,
        };
        setGameState(gameState);
      } else if (message.type === "InProgress") {
        console.debug("Game in progress");
        console.debug(message.playerBoards[username]);
        setBoard(message.playerBoards[username]);
      } else if (message.type === "Win") {
        console.debug(`Player "${message.winner.name}" wins!`);
        setBoard(null);
        const gameState: Finished = {
          type: username == message.winner.name ? "Win" : "Lose",
          id: roomId!,
          level: message.gameLevel,
          winner: message.winner,
          timeTaken: message.completionTime,
        };
        setGameState(gameState);
      } else if (message.points) {
        /* Match Response */
        console.debug("Link path = ", message.points);
      } else {
        console.error("Unknown message type:", message.type);
        setError(ErrorMessage.UnexpectedError);
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
          console.debug("Game status:", gameStatus);
          if (gameStatus.type === "Win") {
            setGameMessage(
              `Game has ended\n Player "${gameStatus.winner.name}" won!`
            );
          } else {
            setGameMessage("Game Status = " + gameStatus.type);
          }
        } else if (response.status === 404) {
          const errorMessage = await response.text();
          console.error("Error message:", errorMessage);
          const expectedError = ServerResponseError.RoomNotFound.replace(
            "{roomId}",
            roomId!
          );
          console.debug("Expected error message:", expectedError);
          if (errorMessage === removeQuotes(expectedError)) {
            setError(ErrorMessage.RoomNotFound);
          } else {
            setError(ErrorMessage.UnexpectedError);
          }
        }
      } catch (error) {
        console.error("Error fetching game status:", error);
        setError(ErrorMessage.ServerError);
      }
    };

    ws.onclose = () => {
      console.debug("WebSocket connection closed");
    };
  }, [roomId]);

  useEffect(() => {
    if (tile1 && tile2) {
      console.debug("Tiles selected:", tile1, tile2);
      const idTimeout = setTimeout(() => {
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
          console.debug("Message sent:", message);
        } else {
          console.error("WebSocket is not connected");
          setError(ErrorMessage.ConnectionError);
        }
        setTile1(null);
        setTile2(null);
        clearTimeout(idTimeout);
      }, 150);

      return () => {
        clearTimeout(idTimeout);
      };
    }
  }, [tile1, tile2]);

  const handleClick = (x: number, y: number) => {
    console.debug("Tile clicked at coordinates:", x, y);
    return tile1 ? setTile2({ x, y }) : setTile1({ x, y });
  };

  // render all game states except "Inprogress"
  const renderGameState = () => {
    if (gameState) {
      console.log("Game state:", gameState);
      console.log(gameState.type);
      if (gameState.type === "AwaitingPlayers") {
        return <Awaiting state={gameState} />;
      } else if (gameState.type === "GameStartsSoon") {
        return <StartSoon state={gameState} />;
      } else if (gameState.type === "Win") {
        return <Win state={gameState} />;
      } else if (gameState.type === "Lose") {
        return <Lose state={gameState} />;
      }
    }
  };
  return (
    <div className="game-container">
      <Header hasBackButton={true} />
      <div className="game-content">
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
        ) : error ? (
          <div className="error-message-container">
            <p className="error-message">{error}</p>
          </div>
        ) : (
          <div className="game-message-container">
            {renderGameState()}
            <p className="game-message">{gameMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
