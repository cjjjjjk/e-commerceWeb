import { useSelector } from 'react-redux';
import './navigate.css'

import { useNavigate } from 'react-router-dom';
import { RootState } from 'app/store';

const Navigate = ()=>{
    const navigate = useNavigate();

    const {isBackHome} = useSelector((state: RootState) => state.navicom);

    if(isBackHome) return (
        <div className="position-fixed z-2 bottom-0 w-100 d-flex justify-content-center align-items-center p-4 gap-5">
            <div
                onClick={()=> navigate('')} 
                className="navi-item-home">
                Trang chủ
            </div>
        </div>
    ); 
    else return (
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