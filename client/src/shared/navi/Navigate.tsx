import { useSelector } from 'react-redux';
import './navigate.css'

import { useNavigate } from 'react-router-dom';
import { RootState } from 'app/store';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Env
const API_URL = process.env.REACT_APP_API_URL

const Navigate = ()=>{
    const navigate = useNavigate();

    const {isBackHome, isReload} = useSelector((state: RootState) => state.navicom);
    
    // Search container handler --------------
    const [isShowSearchBox, setIsShowSearchBox] = useState(false);
    const toggleSearchBox = (isClose?: boolean)=>{
        if(isClose) setIsShowSearchBox(false);
        else
        setIsShowSearchBox(!isShowSearchBox ); 
    }
    // ---------------------------------------
    const [searchValue, setSearchValue] = useState("");

    // States
    const [isSearching, SetIsSearching]= useState<boolean>(false);
    const [categories, SetCategories] = useState<any[]>([]);
    const [categoriesShow, SetCategoriesShow] = useState<any[]>([]);
    const [crrGender, SetCrrGender]= useState<string>('women');

    // Call API 
    useEffect(()=> {
        axios.get(`${API_URL}/categories`, { timeout: 5000 }) // Timeout 5s
            .then((res: any) => {
                if (res.data) {
                    SetCategories(res.data);
                    SetCategoriesShow(res.data);
                } else {
                    console.log('No Categories!');
                }
            })
            .catch((err: any) => {
                if (err.code === "ECONNABORTED") {
                    console.error("Request timeout! Server may be down.");
                } else if (err.response) {
                    console.error(`Error: ${err.response.status} - ${err.response.statusText}`);
                } else {
                    alert('Server NOT WORKING !')
                }
            });
    }, [,isReload])
    useEffect(()=>{
        if(categories.length > 0)
        SetCategoriesShow(categories.filter((cate)=> {
                return cate.gender === crrGender;
            }))
    }, [crrGender, categories])

    useEffect(()=>{
        if(searchValue !== "") {
            SetIsSearching(true)
        } else {
            SetIsSearching(false)
        }
    }, [searchValue])

    const naviHandler= function(to: string, cateId?: string) {
        window.sessionStorage.setItem('crrCateId', cateId || "");
        setIsShowSearchBox(false);
        navigate(to);
    }

    const normalizeStringToPath = (name: string): string => {
        return name
            .normalize("NFD") 
            .replace(/[\u0300-\u036f]/g, "") 
            .replace(/đ/g, "d")
            .toLowerCase() 
            .replace(/\s+/g, "-"); 
    };    

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
                onClick={()=> naviHandler('')}
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
                onClick={()=> naviHandler('member')}
            >
                <i className="pi pi-user"></i>
            </div>

            { isShowSearchBox && 
            <div className="search-full-container h-100 w-100 z-1 top-0 left-0 position-fixed d-flex justify-content-center align-items-center">
                <div className="search-container d-flex flex-column justify-content-center align-items-stretch">
                    <div className="input-container d-flex justify-content-between align-items-center gap-3" >
                        <input
                            onChange={(e) => setSearchValue(e.target.value)}
                            type="text" className="search-input flex-grow-1"
                            placeholder='Tìm kiếm theo tên sản phẩm' />
                        <button 
                            onClick={()=>toggleSearchBox(true)}
                            className="pi pi-times"></button>
                    </div>
                    <hr style={{ margin: 0 }}/>
                    <div className="result-container flex-grow-1 p-4">
                        {!isSearching && 
                            <div className="categories h-100 w-100 d-flex flex-column">
                                <h2 style={{ fontSize: "1.5rem",fontWeight:'600', color: "black" }}>DANH MỤC SẢN PHẨM</h2>
                                <div className='flex-grow-1 d-flex flex-row gap-4 py-3'>
                                    <div className="cate-options d-flex flex-column gap-4">
                                        <div className={`cate-option-item d-flex justify-content-start align-items-center gap-2 py-3 ${crrGender === 'women' ? 'active' : ''}`}
                                            onClick={()=>{SetCrrGender('women')}}
                                            >
                                            <i className="pi pi-venus"></i>
                                            <span className='cate-option-name'>NỮ</span>
                                        </div>
                                        <div className={`cate-option-item d-flex justify-content-start align-items-center gap-2 py-3 ${crrGender === 'men' ? 'active' : ''}`}
                                            onClick={()=>{SetCrrGender('men')}}
                                            >
                                            <i className="pi pi-mars"></i>
                                            <span className='cate-option-name'>NAM</span>
                                        </div>
                                        <div className={`cate-option-item d-flex justify-content-start align-items-center gap-2 py-3 ${crrGender === 'all' ? 'active' : ''}`}
                                            onClick={()=>{SetCrrGender('all')}}
                                            >
                                            <i className="pi pi-user"></i>
                                            <span className='cate-option-name'>KHÁC</span>
                                        </div>
                                    </div>
                                    <div className="h-75" style={{ width: "2px", backgroundColor: "lightgray" }}></div>
                                    <div className="cate-container flex-grow-1">
                                        {
                                            categoriesShow.map((cate: any, index: number)=> {
                                                return (<div 
                                                    onClick={()=>{naviHandler(`${crrGender}/${normalizeStringToPath(cate.name)}`, cate._id)}}
                                                    key={index} className='cate-item'>{cate.name || "Cate Name !"}</div>)
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        { isSearching && 
                            <div className='d-flex gap-4 justify-content-start align-items-center'>
                                <i className="pi pi-spin pi-spinner"></i>
                                Searching
                            </div>
                        }  
                    </div>
                </div>
            </div>}
        </div>
    )
}
export default Navigate;