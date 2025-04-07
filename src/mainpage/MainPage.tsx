import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./MainPage.css";
import { faSignIn, faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import config from "../config";
import { useNavigate } from "react-router";
import { removeQuotes } from "../utils/utils";

function MainPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validateUsername = (username: string) => {
    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    return regex.test(username);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Username submitted:", username);
    if (!validateUsername(username)) {
      setError(
        "Username must be 3-20 characters long and can only contain letters, numbers, and underscores."
      );
      return;
    }
    signup(username);
  };

  const signup = async (username: string) => {
    try {
      const response = await fetch(
        `http://${config.serverHost}:${config.serverPort}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "SignUp",
            username: username,
          }),
        }
      );
      if (response.ok) {
        console.log("User signed up successfully");
        await login(username);
      } else if (response.status === 400) {
        /* Already signup */
        await login(username);
      } else {
        console.error("Signup failed - Response status:", response.status);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  const login = async (username: string) => {
    try {
      const response = await fetch(
        `http://${config.serverHost}:${config.serverPort}/auth/login/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const token = await response.text();
        console.log("User logged in successfully with token: ", token);
        /* TODO: Improve this? */
        localStorage.setItem("token", removeQuotes(token));
        localStorage.setItem("username", username);
        navigate("/rooms");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="main-page-container">
      <h1 className="main-title">Link Game</h1>
      <div className="input-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username" className="label-username">
            Username
          </label>
          <div className="input-field">
            <FontAwesomeIcon icon={faUser} className="input-field-icon" />
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className={`error-message-container ${error ? "show" : ""}`}>
            {error && <p className="error-message">{error}</p>}
          </div>
          <button type="submit" className="start-button">
            <span>Enter</span>
            <FontAwesomeIcon icon={faSignIn} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default MainPage;
