import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Header.css";
import { useNavigate } from "react-router";
import { faArrowLeft, faSignOut } from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {
  hasBackButton: boolean;
}

function Header({ hasBackButton }: HeaderProps) {
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="game-header">
      <div className="game-header-content">
        {hasBackButton && (
          <button className="back-button" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back</span>
          </button>
        )}
        <h2>Link Game</h2>
        <button className="signout-button" onClick={handleSignout}>
          <span>Signout</span>
          <FontAwesomeIcon icon={faSignOut} />
        </button>
      </div>
    </div>
  );
}

export default Header;
