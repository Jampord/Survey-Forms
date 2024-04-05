import "./Login.scss";
import email_icon from "../assets/email-icon.png";
import password_icon from "../assets/password-icon.png";

export default function Login() {
  return (
    <div className="login-container">
      <div className="inputs">
        <div className="header">
          <div className="text">
            <h1>Login</h1>
          </div>
        </div>
        <div className="underline"></div>
        <div className="input">
          <img src={email_icon} alt="email icon" />
          <input type="email" placeholder="Email" />
        </div>
        <div className="input">
          <img src={password_icon} alt="password icon" />
          <input type="password" placeholder="Password" />
        </div>
        <button className="login">Login</button>
      </div>
    </div>
  );
}
