import "../styles/ToolBar.css";
import ThemeChange from "./ThemeChange";
import { useNavigate } from "react-router-dom";

function ToolBar() {
  const navigate = useNavigate();

  const gotoLogin = () => {
    navigate("/login");
  };

  const gotoAdd = () => {
    navigate("/add_expense");
  };

  const gotoDiagrams = () => {
    navigate("/diagrams");
  };

  const gotoMain = () => {
    navigate("/");
  };
  const LogOut = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };
  return (
    <>
      <div className="tool-bar">
        <img
          className="prof-img"
          src="/src/assets/profile.png"
          alt="Profile image"
          onClick={gotoLogin}
        ></img>
        <img
          className="prof-img"
          src="/src/assets/main-page.png"
          alt="Main page image"
          onClick={gotoMain}
        ></img>
        <img
          className="prof-img"
          src="/src/assets/plus.png"
          alt="Add expence image"
          onClick={gotoAdd}
        ></img>
        <img
          className="prof-img"
          src="/src/assets/diagram.png"
          alt="Diagrams"
          onClick={gotoDiagrams}
        ></img>
        <ThemeChange />
        <img
          className="exit-img"
          src="/src/assets/exit.png"
          alt="Exit"
          onClick={LogOut}
        ></img>{" "}
      </div>
    </>
  );
}

export default ToolBar;
