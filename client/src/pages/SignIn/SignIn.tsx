import "./signin.css";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToast } from 'shared/components/toast/toastSlice';
import { setHideNavBar } from "shared/navi/navigateSlice";

const API_URL = process.env.REACT_APP_API_URL;

function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false);  // State to toggle between login and signup forms

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  useEffect(() => {
    document.title = "E-COMMERCE | ĐĂNH NHẬP";
    dispatch(setHideNavBar(true));
  }, [dispatch]);

  const showToast = (message: string, type: "success" | "error" | "info", link?: string) => {
    dispatch(addToast({ message, type, link }));
  };

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/users/login`, { email, password });
      const { token, data } = res.data;
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

  const handleSignup = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/users/signup`, { email: newEmail, password: newPassword, passwordConfirm });
      const { token } = res.data;
      if (res.data.status === "success") {
        localStorage.setItem("token", token);
        navigate("/member");
      } else {
        showToast("Đăng ký thất bại", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Đăng ký thất bại", "error");
    }
  };

  const GGSignIn = () => {
    const googleLoginUrl = `${API_URL}/users/google`;
    window.location.href = googleLoginUrl;
  };

  return (
    <div className="signin-full-container d-flex flex-row justify-content-center align-items-center">
      <div className="container-outer d-flex flex-row">
        <div className="signin-container p-4">
          {!isSignUp ? (
            <form onSubmit={handleLogin}>
              <h1 className="text-start mb-4 fw-bolder">ĐĂNG NHẬP</h1>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email/Số điện thoại</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Mật khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <small className="form-text text-muted">Mật khẩu phải có từ 8 đến 20 ký tự bao gồm cả chữ và số.</small>
              </div>
              <button type="submit" className="btn w-100 mb-3 btn-dark">ĐĂNG NHẬP</button>
              <button type="button" className="btn btn-outline-danger w-100 mb-3" onClick={GGSignIn}>
                <i className="pi pi-google"></i> Đăng nhập với Google
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <h1 className="text-start mb-4 fw-bolder">ĐĂNG KÝ</h1>
              <div className="mb-3">
                <label htmlFor="newEmail" className="form-label">Email/Số điện thoại</label>
                <input
                  type="email"
                  className="form-control"
                  id="newEmail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">Mật khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <small className="form-text text-muted">Mật khẩu phải có từ 8 đến 20 ký tự bao gồm cả chữ và số.</small>
              </div>
              <div className="mb-3">
                <label htmlFor="passwordConfirm" className="form-label">Nhập lại mật khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  id="passwordConfirm"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-dark w-100">ĐĂNG KÝ</button>
            </form>
          )}

          <button
            className="btn btn-link d-block mx-auto mt-3 text-decoration-none"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Quay lại đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
          </button>
        </div>
        <div className="content-container d-flex gap-3 flex-column justify-content-center align-items-center">
          <h3 className="fw-bolder d-flex justify-content-center align-items-center gap-3">E-COMERCE <button className="btn btn-dark fs-4 text-decoration-none" disabled>SHOP</button></h3>
          <div className="d-flex flex-row gap-3 justify-content-center align-items-center mb-5">
            <img src="/logo-512-e.png" className="img-fluid w-25" />
            <img src="/logo-512-c.png" className="img-fluid w-25" />
          </div>
        </div>

      </div>
    </div>
  );
}

export default SignIn;
