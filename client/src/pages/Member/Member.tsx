import './member.css'

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import userService from 'shared/services/auth/userService';


interface MemberData {
    uid: string;
    email: string;
    name: string;
    avatar: string;
}

function Member() {
    const navigate = useNavigate();
    const [member, setMember] = useState<MemberData | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
    
        if (!token) {
          navigate("/signin");
          return;
        }
    
        const fetchUser = async () => {
          try {
            const response = await userService.getMe();
            const user = response.data.data.user;
    
            setMember({
              uid: user.uid,
              email: user.email,
              name: user.displayName,
              avatar: user.photoUrl,
            });
          } catch (error) {
            console.error("Failed to fetch user:", error);
          }
        };
    
        fetchUser();
      }, [navigate]);

    // GG Signout ---------------------------
    const GGSingout = async () => {
        try{
            const res = userService.logOut();
            localStorage.removeItem('token')
            navigate("/")   
        } catch (e){

        }
    };
    // --------------------------------------
    if (!member) return <p>Loading...</p>;
    return (
        <div className="member-full-container h-100 w-100 d-flex justify-content-center align-items-center">
            <div className="member-container d-flex gap-5">
                <div className='member-token d-flex flex-column gap-2'>
                    <img className='rounded-circle' src={member?.avatar || "https://imgur.com/aJKfWLf"} alt="" />
                    <div className='d-flex flex-column gap-2'>
                        <span className='member-name'>{String(member?.name).toUpperCase()}</span>
                        <span className='member-email'>{member?.email}</span>
                    </div>
                    <button
                        className='mt-auto btn btn-danger'
                        onClick={()=> GGSingout()}
                    >ĐĂNG XUẤT</button>
                </div>
                <div className='member-detail flex-grow-1 d-flex flex-column gap-2'>
                    <div className="detail__item detail__address">
                        <label className="detail__label" htmlFor="">SỐ ĐIỆN THOẠI LIÊN HỆ</label>
                        <input className="detail__input" type="text" placeholder='Số điện thoại'/>
                    </div>
                    <div className="detail__item detail__address">
                        <label className="detail__label" htmlFor="">ĐỊA CHỈ</label>
                        <input className="detail__input" type="text" placeholder='Địa chỉ liên hệ'/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Member;