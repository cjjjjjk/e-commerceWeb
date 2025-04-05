import "./toast.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToast } from "./toastSlice";
import { RootState } from "app/store";
import { useNavigate } from "react-router-dom";

const Toast = () => {
  const navigate = useNavigate();
  const toasts = useSelector((state: RootState) => state.toast.toasts);
  const dispatch = useDispatch();

  useEffect(() => {
    toasts.forEach((toast) => {
      const duration = toast.link ? 10000 : 4000; 
      setTimeout(() => dispatch(removeToast(toast.id)), duration);
    });
  }, [toasts, dispatch]);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-message ${toast.type}`}>
          <span>{toast.message}</span>
          {toast.link &&  (
            <a
              onClick={()=>{if(toast.link)navigate(toast.link)}}
              href={toast.link} 
              className="toast-link" target="_blank" rel="noopener noreferrer">
              Đi đến
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default Toast;
