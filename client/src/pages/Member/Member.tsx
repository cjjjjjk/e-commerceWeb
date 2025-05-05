import './member.css'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from 'shared/services/auth/userService';
import { Loading } from 'shared/components';

interface MemberData {
  uid: string;
  email: string;
  name: string;
  avatar: string;
}

function Member() {
  const navigate = useNavigate();
  const [member, setMember] = useState<MemberData | null>(null);
  const [userData, setUserData] = useState<any>({}) 
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isValid, setIsValid] = useState(true);

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
        setUserData(user);
        setMember({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          avatar: user.photoUrl,
        });
        setAddress(user.address ?? "");
        setPhone(user.phone ?? "");
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
  
    fetchUser();
  }, [navigate]);

  // GG Signout ---------------------------
  const logOut = async () => {
    try {
      await userService.logOut();
      localStorage.removeItem('token');
      navigate("/");   
    } catch (e) {
      console.error("Error during logout:", e);
    }
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    setIsValid(validatePhone(newPhone));
    setIsDirty(true);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (isValid) {
      try {
        await userService.updateInfor(
            { 
                ...userData,
                phone,
                address });
        setIsDirty(false);
      } catch (error) {
        console.error("Error updating user info:", error);
      }
    }
  };

  const handleCancel = () => {
    setPhone('');
    setAddress('');
    setIsDirty(false);
  };

  // --------------------------------------
  if (!member) return <Loading message='Đang đăng nhập' />;
  
  return (
    <div className="member-full-container h-100 w-100 d-flex justify-content-center align-items-center">
      <div className="member-container d-flex gap-5">
        <div className='member-token d-flex flex-column gap-2'>
          <img className='avatar rounded-circle' src={member?.avatar || "https://imgur.com/aJKfWLf"} alt="" />
          <div className='member-info d-flex flex-column gap-2'>
            <span className='member-name'>{String(member?.name).toUpperCase()}</span>
            <span className='member-email' data-bs-toggle="tooltip" data-bs-placement="bottom" title={member?.email}>{member?.email}</span>
          </div>
          <button
            className='mt-auto btn btn-danger'
            onClick={logOut}
          >ĐĂNG XUẤT</button>
        </div>

        <div className='member-detail flex-grow-1 d-flex flex-column gap-2'>
          <div className="detail__item detail__address">
            <label className="detail__label" htmlFor="phone">SỐ ĐIỆN THOẠI LIÊN HỆ</label>
            <input
              id="phone"
              type="text"
              placeholder='Số điện thoại'
              value={phone}
              onChange={handlePhoneChange}
              className={`detail__input form-control ${!isValid && 'is-invalid'}`}
            />
            {!isValid && <div className="invalid-feedback">Số điện thoại không hợp lệ</div>}
          </div>

          <div className="detail__item detail__address">
            <label className="detail__label" htmlFor="address">ĐỊA CHỈ</label>
            <input
              id="address"
              className="detail__input"
              type="text"
              placeholder='Địa chỉ liên hệ'
              value={address}
              onChange={handleAddressChange}
            />
          </div>

          {/* Display buttons only if form is dirty */}
          {isDirty && (
            <div className="d-flex gap-2">
              <button
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Huỷ
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!isValid}
              >
                Lưu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Member;
