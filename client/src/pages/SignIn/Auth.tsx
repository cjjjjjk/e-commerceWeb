import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToast } from "shared/components/toast/toastSlice";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showToast = (message: string, type: "success" | "error" | "info", link?: string) => {
    dispatch(addToast({ message, type, link }));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      showToast("Đăng nhập thành công", "success");
      setTimeout(() => navigate("/"), 500);
    } else {
      showToast("Đăng nhập không thành công", "error");
      setTimeout(() => navigate("/login"), 500);
    }
  }, [navigate]);

  return <p>Đang xác thực đăng nhập...</p>;
};

export default Auth;
