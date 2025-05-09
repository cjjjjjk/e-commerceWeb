import './header.css'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'app/store';


const Header = () => {
  const navigate = useNavigate();
  const {theme, isTransference} = useSelector((state: RootState) => state.header);

    return (
      <div className={`header-full-container position-fixed w-100 d-flex justify-content-center z-3 ${theme=="light" && !isTransference ? "bg-white" : ""}`}>
        <div className={`${theme}-theme header-container py-3 px-2 d-flex justify-content-between`}>
          <div 
            className={` header-container-left d-flex align-items-center gap-1`}
            onClick={()=> navigate('')}
            >
              <img className='logo' src="/logoe32.png" alt="" />
              <img className='logo' src='/logoc32.png' />
          </div>
          <div className="header-container-mid d-flex justify-content-center align-items-center gap-4">
            <span
              onClick={()=> {
                navigate('women')
              }}
            >NỮ</span>
            <span
              onClick={()=> {
                navigate('men')
              }}
            >NAM</span>
          </div>
          <div className="header-container-right gap-2 d-flex justify-content-center align-content-center">
                <i 
                  className="header-icon p-1 cart pi pi-shopping-cart d-flex align-items-center"
                  onClick={()=> navigate('cart')}
                ></i>
                <i 
                  className="header-icon p-1 wish-list pi pi-inbox d-flex align-items-center"
                  onClick={()=> navigate('order')}  
                ></i>
                <i 
                  className="header-icon p-1 user pi pi-user d-flex align-items-center"
                  onClick={()=> navigate('member')}
                ></i>
          </div>
        </div>
      </div>
    );
  };
  
  export default Header;
  