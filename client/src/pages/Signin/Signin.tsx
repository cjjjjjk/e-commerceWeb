import './signin.css'

import { useState } from 'react';
import {auth, provider, signInWithPopup, signOut} from '../../shared/services/auth'
import {  useNavigate } from 'react-router-dom';


function Signin() {
    const [user, setUser] = useState<any>(null);
    const navigte = useNavigate()

    // SignIn with GG ====================================== author: Hai
    const GGSingIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
            localStorage.setItem('token', await result.user.getIdToken());
            navigte("/member");
        } catch (error) {
          console.error("Login failed", error);
        }
      };
    // ================================================================

    return (
        <div className='h-100 w-100 d-flex justify-content-center align-items-center'>
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

export default Signin