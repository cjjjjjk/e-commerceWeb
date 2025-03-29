import './signin.css'

import { useState } from 'react';
import {auth, provider, signInWithPopup} from '../../shared/services/auth'
import {  useNavigate } from 'react-router-dom';


function SignIn() {
    const navigte = useNavigate()

    // SignIn with GG ====================================== author: Hai
    const GGSingIn = async () => {
        if(!auth || !provider) {
            console.log("ERR: GG Firebse cofig Err!");
            return;
        }
        try {
            const result = await signInWithPopup(auth, provider);
            localStorage.setItem('token', await result.user.getIdToken());
            navigte("/member");
        } catch (error) {
          console.error("Login failed", error);
        }
      };
    // ================================================================

    return (
        <div className='sigin-full-container h-100 w-100 d-flex justify-content-center align-items-center'>
            <div className="sigin-container d-flex flex-column align-items-baseline gap-4">
                <h1>ĐĂNG NHẬP</h1>
                <span>Sử dụng tài khoản Google để đăng nhập. </span>
                <button
                    className="gg-signin p-4 d-flex gap-3 justify-content-center align-items-center border-0"
                    onClick={() => GGSingIn()} 
                >
                    <i className="pi pi-google"></i>
                    Đăng nhập với Google
                </button>
            </div>
        </div>
    )
}

export default SignIn