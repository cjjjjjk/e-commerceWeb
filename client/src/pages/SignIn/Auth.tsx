import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToast } from "shared/components/toast/toastSlice";

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() ?? null;
  }

  return null;
}

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showToast = (
    message: string,
    type: "success" | "error" | "info",
    link?: string
  ) => {
    dispatch(addToast({ message, type, link }));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let token = params.get("token");

    if (!token) {
      token = getCookie("jwt");
    }
    console.log(token);

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
