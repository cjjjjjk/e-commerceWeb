import './navigate.css'

import { useNavigate } from 'react-router-dom';
const Navigate = ()=>{
    const navigate = useNavigate();

    return (
        <div className="position-fixed z-2 bottom-0 w-100 d-flex justify-content-center align-items-center p-4 gap-5">
            <div 
                className="navi-item home"
                onClick={()=> navigate('')}
            >
                <i className="pi pi-home"></i>
            </div>
            <div className="navi-item center search">
                <i className="pi pi-search"></i>
            </div>
            <div 
                className="navi-item user"
                onClick={()=> navigate('member')}
            >
                <i className="pi pi-user"></i>
            </div>
        </div>
    )
}
export default Navigate;