import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Header.css";
import { useNavigate } from "react-router";
import { faArrowLeft, faSignOut, faTrophy } from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {
  hasBackButton: boolean;
  hasLeaderboardButton: boolean;
  onLeaderboardClick: () => void;
}

function Header({ hasBackButton, hasLeaderboardButton, onLeaderboardClick }: HeaderProps) {
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="game-header">
      <div className="game-header-content">
        <div className="left-header">
          {hasBackButton && (
            <button className="back-button" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back</span>
            </button>
          )}
        </div>
        <h2>Link Game</h2>
        <div className="right-header">
          {hasLeaderboardButton && (
            <button className="leaderboard-button" onClick={onLeaderboardClick}>
              <FontAwesomeIcon icon={faTrophy} />
              <span>Leaderboard</span>
            </button>
          )}
          <button className="signout-button" onClick={handleSignout}>
            <span>Signout</span>
            <FontAwesomeIcon icon={faSignOut} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
