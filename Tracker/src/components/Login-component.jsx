import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Login-component.css";
function Login() {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (!storedUsers) {
      localStorage.setItem("users", JSON.stringify([]));
    }

    const storedCurrentUser = localStorage.getItem("currentUser");
    if (storedCurrentUser) {
      setCurrentUserData(JSON.parse(storedCurrentUser));
    }
  }, [navigate]);

  const goToMain = () => {
    navigate("/");
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
  };

  const handleLogIn = () => {
    if (!username || !password) {
      setError("Заповніть всі поля");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.username === username);

    if (user) {
      if (user.password === password) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        setCurrentUserData(user);
        navigate("/");
      } else {
        setError("Неправильний пароль");
      }
    } else {
      setError("Користувача не знайдено");
    }
  };

  const handleSignUp = () => {
    if (!username || !password || !confirmPassword) {
      setError("Заповніть всі поля");
      return;
    }

    if (password !== confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.username === username)) {
      setError("Користувач з таким ім'ям вже існує");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      username: username,
      password: password,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setCurrentUserData(newUser);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUserData(null);
  };

  const handleSubmit = () => {
    setError("");
    if (isLoginMode) {
      handleLogIn();
    } else {
      handleSignUp();
    }
  };

  return (
    <>
      {!currentUserData ? (
        <div className="Login-conatainer">
          <h2 className="login-header">{isLoginMode ? "LogIn" : "Sign Up"}</h2>
          {error && <p className="error-message">{error}</p>}
          <p className="login-text">Family name</p>
          <input
            type="text"
            className="login-input"
            id="us"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <p className="login-text">Password</p>
          <input
            type="password"
            className="login-input"
            id="pas"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          {!isLoginMode && (
            <>
              <p className="login-text">Confirm Password</p>
              <input
                type="password"
                className="login-input"
                id="confpas"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
            </>
          )}
          <button className="submit-btn" onClick={handleSubmit}>
            {isLoginMode ? "Login" : "Sign Up"}
          </button>
          <p className="sign-up" onClick={toggleMode}>
            {isLoginMode ? "Sign up" : "Already have an account? Log in"}
          </p>
        </div>
      ) : (
        <div className="card-container-profile">
          <div className="card">
            <h2 className="card-h">{currentUserData.username}</h2>
            <p className="card-h">Id:{`${currentUserData.id}`}</p>
            <button className="bookmarkBtn" onClick={handleLogout}>
              Вийти з профілю😁
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
