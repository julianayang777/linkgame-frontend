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
  InProgress,
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
import GameStateInfo from "./GameStateInfo";
import Path from "./Path";

function Game() {
  const { level, roomId } = useParams();
  const wsRef = useRef<WebSocket | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const TIMEOUT = 150;

  const [board, setBoard] = useState<Board | null>(null);
  const [tile1, setTile1] = useState<Coordinate | null>(null);
  const [tile2, setTile2] = useState<Coordinate | null>(null);
  const [path, setPath] = useState<Coordinate[]>([]);

  /* TODO: remove TEMP: Game Message */
  const [gameMessage, setGameMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showInfo, setShowInfo] = useState(false);

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
      try {
        const message = JSON.parse(event.data);
        console.debug("Message from server:", message);
        if (message.type === "AwaitingPlayers") {
          console.debug("Awaiting other players");
          const state: AwaitingPlayers = {
            type: "AwaitingPlayers",
            id: roomId!,
            level: message.gameLevel,
            joinedPlayers: message.players.length,
            requiredPlayers: message.requiredPlayers,
          };
          setGameState(state);
        } else if (message.type === "GameStartsSoon") {
          console.debug("Game start soon in 5 seconds");
          const state: GameStartsSoon = {
            type: "GameStartsSoon",
            id: roomId!,
            level: message.gameLevel,
            joinedPlayers: message.players,
            startIn: message.startIn,
          };
          setGameState(state);
        } else if (message.type === "InProgress") {
          console.debug("Game in progress");
          const state: InProgress = {
            type: "InProgress",
            id: roomId!,
            level: message.gameLevel,
            playerBoards: message.playerBoards,
          };
          console.debug(message.playerBoards[username]);
          setGameState(state);
          setBoard((prevBoard) => {
            // When user refreshes the page, the board is null, so we need to set it
            if (prevBoard === null) {
              return message.playerBoards[username];
            }
            return prevBoard;
          });
        } else if (message.type === "Win") {
          console.debug(`Player "${message.winner.name}" wins!`);
          setBoard(null);
          const state: Finished = {
            type: username === message.winner.name ? "Win" : "Lose",
            id: roomId!,
            level: message.gameLevel,
            winner: message.winner,
            timeTaken: message.completionTime,
          };
          setGameState(state);
        } else if (message.points) {
          setPath(message.points);

          timeoutRef.current = setTimeout(() => {
            setTile1(null);
            setTile2(null);
            setPath([]);
            setGameState((prevState) => {
              if (prevState?.type === "InProgress") {
                console.debug(
                  "Setting board to:",
                  prevState.playerBoards[username]
                );
                setBoard(prevState.playerBoards[username]);
              } else {
                console.error("Game state is not InProgress: ", prevState);
              }
              return prevState;
            });
          }, TIMEOUT);
        } else {
          /* Other errors */
          console.error("Unknown message type:", message.type);
          setError(ErrorMessage.UnexpectedError);
        }
      } catch {
        /* TODO: Maybe invalid match */
        const message = event.data;
        if (message.includes(ServerResponseError.InvalidMatch)) {
          console.error("Invalid match message:", message);
          timeoutRef.current = setTimeout(() => {
            setTile1(null);
            setTile2(null);
          }, TIMEOUT);
        }
      }
    };

    ws.onerror = async (error) => {
      console.error("WebSocket error:", error);
      /* TODO: Cannot connect to websocket can mean:
       * - Game has ended
       * - Server is down
       * - Invalid roomId
       * - Invalid token
       */
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
            const gameState: Finished = {
              type: "Finished",
              id: roomId!,
              level: gameStatus.gameLevel,
              winner: gameStatus.winner,
              timeTaken: gameStatus.completionTime,
            };
            setGameState(gameState);
            setShowInfo(true);
          } else {
            /* TODO: remove this */
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

    ws.onclose = (event) => {
      console.debug("WebSocket connection closed: ", event);
    };

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [roomId]);

  useEffect(() => {
    if (tile1 && tile2) {
      console.debug("Tiles selected:", tile1, tile2);
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const message = {
          type: "Match",
          p1: {
            row: tile1.row,
            column: tile1.column,
          },
          p2: {
            row: tile2.row,
            column: tile2.column,
          },
        };
        console.log("Sending message:", message);
        wsRef.current.send(JSON.stringify(message));
        console.debug("Message sent:", message);
      } else {
        console.error("WebSocket is not connected");
        setError(ErrorMessage.ConnectionError);
      }
    }
  }, [tile1, tile2]);

  const handleClick = (position: Coordinate) => {
    console.debug(
      "Tile clicked at coordinates:",
      position.row,
      position.column
    );
    return tile1 ? setTile2(position) : setTile1(position);
  };

  // render all game states except "Inprogress"
  const renderGameState = () => {
    if (!showInfo && gameState) {
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
    } else if (gameState) {
      return <GameStateInfo state={gameState} />;
    }
  };
  return (
    <div className="game-container">
      <Header hasBackButton={true} />
      <div className="game-content">
        {board ? (
          <div className={`board-wrapper-${level}`}>
            <div className={`board ${level}-grid`}>
              {board.map((row, rowIndex) =>
                row.map((tile, colIndex) => (
                  <Tile
                    key={`${rowIndex}-${colIndex}`}
                    value={tile}
                    position={{ row: rowIndex, column: colIndex }}
                    isSelected={
                      (tile1 &&
                        tile1.row === rowIndex &&
                        tile1.column === colIndex) ||
                      (tile2 &&
                        tile2.row === rowIndex &&
                        tile2.column === colIndex) ||
                      false
                    }
                    onClick={handleClick}
                  />
                ))
              )}
            </div>
            <Path points={path} />
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
