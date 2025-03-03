import './header.css'
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

    return (
      <div className='position-fixed w-100 d-flex justify-content-center z-3'>
        <div className="header-container py-3 px-2 d-flex justify-content-between">
          <div 
            className="header-container-left d-flex align-items-center gap-3"
            onClick={()=> navigate('')}
            >
              <img className='logo' src="logo32.png" alt="" />
              <span className="fw-bold">E-Commerce</span>
          </div>
          <div className="header-container-mid d-flex justify-content-center align-items-center gap-4">
            <span>NỮ</span>
            <span>NAM</span>
          </div>
          <div className="header-container-right gap-2 d-flex justify-content-center align-content-center">
                <i 
                  className="header-icon p-1 cart pi pi-shopping-cart d-flex align-items-center"
                  onClick={()=> navigate('cart')}
                ></i>
                <i 
                  className="header-icon p-1 wish-list pi pi-heart d-flex align-items-center"
                  onClick={()=> navigate('wishlist')}  
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
  