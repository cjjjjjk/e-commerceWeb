import { useSelector } from 'react-redux';
import './navigate.css'

import { useNavigate } from 'react-router-dom';
import { RootState } from 'app/store';
import { useState } from 'react';

const Navigate = ()=>{
    const navigate = useNavigate();

    const {isBackHome} = useSelector((state: RootState) => state.navicom);
    
    // Search container handler --------------
    const [isShowSearchBox, setIsShowSearchBox] = useState(false);
    const toggleSearchBox = (isClose?: boolean)=>{
        if(isClose) setIsShowSearchBox(false);
        else
        setIsShowSearchBox(!isShowSearchBox ); 
    }
    // ---------------------------------------


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
        <div className="navi-full-container position-fixed z-3 bottom-0 w-100 d-flex justify-content-center align-items-center p-4 gap-5">
            <div 
                className="navi-item z-2 home"
                onClick={()=> navigate('')}
            >
                <i className="pi pi-home"></i>
            </div>
            <div
                onClick={()=>toggleSearchBox()}
                className="navi-item z-2 center search">
                <i 
                    className="pi pi-search"></i>
            </div>
            <div 
                className="navi-item z-2 user"
                onClick={()=> navigate('member')}
            >
                <i className="pi pi-user"></i>
            </div>

            { isShowSearchBox && 
            <div className="search-full-container h-100 w-100 z-1 top-0 left-0 position-fixed d-flex justify-content-center align-items-center">
                <div className="search-container d-flex flex-column justify-content-center align-items-stretch">
                    <div className="input-container d-flex justify-content-between align-items-center gap-3" >
                        <input 
                            type="text" className="search-input flex-grow-1"
                            placeholder='Tìm kiếm theo tên sản phẩm' />
                        <button 
                            onClick={()=>toggleSearchBox(true)}
                            className="pi pi-times"></button>
                    </div>
                    <hr style={{ margin: 0 }}/>
                    <div className="result-container flex-grow-1">

                    </div>
                </div>
            </div>}
        </div>
    )
}
export default Navigate;