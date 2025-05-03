import "./signin.css";

import { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToast } from 'shared/components/toast/toastSlice';

const API_URL = process.env.REACT_APP_API_URL;


function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const showToast = (
    message: string,
    type: "success" | "error" | "info",
    link?: string
  ) => {
    dispatch(addToast({ message, type, link }));
  };
  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });
      const { token, data } = res.data;
      console.log(res.data);
      console.log("SIGNIN RES:", res.data);
      if (res.data.status === "success") {
        localStorage.setItem("token", token);
        showToast("Đăng nhập thành công", "success");
        if (data.role === "admin") showToast("Bạn là ADMIN", "info", "/admin");
        navigate("/member");
      } else {
        showToast("Đăng nhập thất bại", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Đăng nhập thất bại", "error");
    }
  };

  // SignIn with GG ====================================== author: Hai
  const GGSignIn = () => {
    console.log("GGSignIn clicked");
    const googleLoginUrl = `${API_URL}/users/google`;
    //window.open(googleLoginUrl, "_blank");
    window.location.href = googleLoginUrl;
  };
  // ================================================================

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="sigin-full-container h-100 w-100 d-flex justify-content-center align-items-center">
      <form className="signin-form">
        <div className="sigin-container d-flex flex-column align-items-baseline gap-4">
          <h1 className="mt-4">ĐĂNG NHẬP</h1>
          <fieldset>
            <input
              className="input email"
              type="text"
              placeholder=""
              value={email}
              onChange={handleEmailChange}
            />
            <span className="label">Email/Số điện thoại</span>
          </fieldset>
          <fieldset>
            <input
              className="input password"
              type="password"
              placeholder=""
              value={password}
              onChange={handlePasswordChange}
            />
            <span className="label">Mật khẩu</span>
            <p className="mt-4">
              Mật khẩu phải có từ 8 đến 20 kí tự bao gồm cả chữ và số.
            </p>
          </fieldset>
          <button
            className="signin p-4 d-flex gap-3 justify-content-center align-items-center border-0"
            onClick={handleLogin}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className="signin mt-1 p-4 d-flex gap-3 justify-content-center align-items-center border-0"
            onClick={GGSignIn}
          >
            <i className="pi pi-google"></i>
            Đăng nhập với Google
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
