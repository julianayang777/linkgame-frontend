import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Header.css";
import { useNavigate } from "react-router";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";

function Header() {
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="game-header">
      <div className="game-header-content">
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
