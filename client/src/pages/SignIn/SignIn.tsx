import './signin.css'

import { useState } from 'react';
import {auth, provider, signInWithPopup} from '../../shared/services/auth'
import {  useNavigate } from 'react-router-dom';
import { UserCredential } from 'firebase/auth';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToast } from 'shared/components/toast/toastSlice';

const API_URL = process.env.REACT_APP_API_URL

interface AuthUserCredential extends UserCredential {
    _tokenResponse?: {
      isNewUser: boolean;
    };
  }

function SignIn() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const showToast = (message: string, type: "success" | "error" | "info", link?: string) => {
      dispatch(addToast({ message, type , link}));
    };
    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/users/login`, { email, password });
            const { token, data } = res.data;
            console.log("SIGNIN RES:", res.data);
            if (res.data.code === "success") {
                localStorage.setItem('token', token);
                showToast("Đăng nhập thành công", "success");
                if(data.role === "admin") showToast("Bạn là ADMIN", "info", '/admin');
                navigate("/member");
            } else {
                showToast("Đăng nhập thất bại", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Đăng nhập thất bại", "error");
        }
    }

    // SignIn with GG ====================================== author: Hai
    const GGSignIn = async () => {
        if(!auth || !provider) {
            console.log("ERR: GG Firebse config Err!");
            return;
        }
        try {
            const result = (await signInWithPopup(auth, provider)) as AuthUserCredential;
            console.log("SIGNIN SUCCESS: ", result);
        
            // const isNewUser = result._tokenResponse?.isNewUser;
            // if(isNewUser){
            // console.log("NEW USER SIGNIN -> CREATE:");
            const userData = { 
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
                photoUrl: result.user.photoURL,
                emailVerified: result.user.emailVerified,
            }; 
            const res = await axios.post(`${API_URL}/users/google-signin`, userData);
            console.log("GG SigIn RES:", res.data);
            // }

            localStorage.setItem('token', await result.user.getIdToken());
            showToast(`${res.data.code === "success" ?"Đăng nhập thành công": "Oops...!"}`, res.data.code);
            if(res.data.user.role === "admin") showToast("Bạn là ADMIN", "info", '/admin');
            navigate("/member");
        } catch (error) {
          console.error("Login failed", error);
          showToast('Đăng nhập thất bại', "error");
        }
      };
    // ================================================================

    return ( 
        <div className='sigin-full-container h-100 w-100 d-flex justify-content-center align-items-center'>
            <form className="signin-form" >
                <div className="sigin-container d-flex flex-column align-items-baseline gap-4">
                    <h1 className="mt-4">ĐĂNG NHẬP</h1>
                    <fieldset>
                        <input className="input email" type="text" placeholder="" />
                        <span className="label">Email/Số điện thoại</span>
                    </fieldset>
                    <fieldset>
                        <input className="input password" type="password" placeholder="" />
                        <span className="label">Mật khẩu</span>
                        <p className="mt-4">Mật khẩu phải có từ 8 đến 20 kí tự bao gồm cả chữ và số.</p>
                    </fieldset>
                    <button 
                        className="signin p-4 d-flex gap-3 justify-content-center align-items-center border-0"
                        onClick={handleLogin}
                    >Đăng nhập</button>
                    <span >Sử dụng tài khoản Google để đăng nhập. </span>
                    <button
                        className="signin mt-1 p-4 d-flex gap-3 justify-content-center align-items-center border-0"
                        onClick={() => GGSignIn()}
                    >
                        <i className="pi pi-google"></i>
                        Đăng nhập với Google
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SignIn