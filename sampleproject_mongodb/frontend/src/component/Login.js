import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
const API_URL = "http://localhost:4000/login";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    // console.log({ email, password });
    try {
      // backend ka data leke aa rha hai and jo response waha pe aa rha usko alert box me print kerwa rhe hai
      const { data } = await axios.post(API_URL, { email, password });
      alert(data.message);
      setEmail("");
      setPassword("");
    } catch {
      console.log("error");
    }
  };

  return (
    <div className="curr">
      
      <form>
        <h2>Login</h2>
        <label>
          <input
            type="email"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </label>
        <label>
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </label>
        <button onClick={handleLogin}>Login</button>
        {/* <button onClick={() => alert("you are successfully login")}>Login</button> */}
      </form>
    </div>
  );
};

export default Login;
