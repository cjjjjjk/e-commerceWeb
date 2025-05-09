import { useSelector } from 'react-redux';
import './navigate.css'

import { Link, useNavigate, useParams } from 'react-router-dom';
import { RootState } from 'app/store';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Env
const API_URL = process.env.REACT_APP_API_URL

const Navigate = ()=>{
    const navigate = useNavigate();

    const {isBackHome, isReload, isHide} = useSelector((state: RootState) => state.navicom);
    
    // Search container handler --------------
    const [isShowSearchBox, setIsShowSearchBox] = useState(false);
    const toggleSearchBox = (isClose?: boolean)=>{
        if(isClose) {
            setIsShowSearchBox(false);
            SetIsSearching(false);
        }
        else
        setIsShowSearchBox(!isShowSearchBox ); 
    }
    // ---------------------------------------
    const [inputValue, setInputValue] = useState("");
    const [searchValue, setSearchValue] = useState("");

    // States
    const [isSearching, SetIsSearching]= useState<boolean>(false);
    const [delay, SetDelay] = useState<boolean>(false);
    const [categories, SetCategories] = useState<any[]>([]);
    const [items, SetItems] = useState<any[]>([]);
    const [categoriesShow, SetCategoriesShow] = useState<any[]>([]);
    const [crrGender, SetCrrGender]= useState<"Nữ"|"Nam"|"Tất cả">('Nữ');

    // Call API 
    useEffect(()=> {
        axios.get(`${API_URL}/categories`, { timeout: 5000 }) // Timeout 5s
            .then((res: any) => {
                if (res.data) {
                    SetCategories(res.data);
                    SetCategoriesShow(res.data);
                } else {
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

    useEffect(() => {
        SetDelay(true);
        const timeOutId = setTimeout(() => {
            setSearchValue(inputValue);
        }, 500);
        return () => {
            clearTimeout(timeOutId);
        }
      }, [inputValue]);

    useEffect(()=>{
        if(searchValue !== "") {
            SetIsSearching(true);
            axios.get(`${API_URL}/products?keyword=${searchValue}`)
            .then((res:any) => {
                if (res.data) {
                    SetItems(res.data.data.products);
                    SetDelay(false);
                }
                else {
                    SetDelay(false);
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
            
        }
        else {
            SetItems([]);
            SetIsSearching(false);
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
    
    const getPreloadHref = (id: string) => {
        const href = `/product/${id}`;
        return href;
    }

    const navitoProductHandler = (toproductId: string)=> {
        const preloadHref = getPreloadHref(toproductId);
        window.sessionStorage.setItem('crrCateId', toproductId || "");
        setIsShowSearchBox(false);
        navigate(preloadHref);
    }
        

    if(isHide) {
        return null;
    }
    else if(isBackHome) return (
        <div className="position-fixed z-2 bottom-0 w-100 d-flex justify-content-center align-items-center p-4 gap-5">
            <div
                onClick={()=> navigate('')} 
                className="navi-item-home">
                Trang chủ
            </div>
        </div>
    ); 
    else return (
        <div className="navi-full-container position-fixed z-3 bottom-0 w-100 d-flex justify-content-center align-items-center p-4 gap-5 ">
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
                <div className="search-container d-flex flex-column justify-content-center align-items-stretch shadow-lg">
                    <div className="input-container d-flex justify-content-between align-items-center gap-3" >
                        <input
                            onChange={(e) => setInputValue(e.target.value)}
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
                                <div className='cate-list-container flex-grow-1 d-flex flex-row py-3'>
                                    <div className="cate-options d-flex flex-column gap-4">
                                        <div className={`cate-option-item d-flex justify-content-start align-items-center gap-2 py-3 ${crrGender === 'Nữ' ? 'active' : ''}`}
                                            onClick={()=>{SetCrrGender('Nữ')}}
                                            >
                                            <i className="pi pi-venus"></i>
                                            <span className='cate-option-name'>NỮ</span>
                                        </div>
                                        <div className={`cate-option-item d-flex justify-content-start align-items-center gap-2 py-3 ${crrGender === 'Nam' ? 'active' : ''}`}
                                            onClick={()=>{SetCrrGender('Nam')}}
                                            >
                                            <i className="pi pi-mars"></i>
                                            <span className='cate-option-name'>NAM</span>
                                        </div>
                                        <div className={`cate-option-item d-flex justify-content-start align-items-center gap-2 py-3 ${crrGender === 'Tất cả' ? 'active' : ''}`}
                                            onClick={()=>{SetCrrGender('Tất cả')}}
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
                        {isSearching && (
                        <div className='result-container d-flex flex-column gap-3 overflow-auto'>
                            {delay && (
                            <div>
                                <i className="pi pi-spin pi-spinner"></i> &nbsp; Đang tìm kiếm sản phẩm...
                            </div>
                            )}
                            {items.length > 0  ? (
                            items.map((item, index) => (
                                <Link
                                    to={getPreloadHref(item._id)}
                                    onClick={() => {
                                        window.sessionStorage.setItem('crrCateId', item._id || "");
                                        setIsShowSearchBox(false);
                                    }}
                                    key={index}
                                    className="d-flex flex-row align-items-start gap-3 p-3 border rounded shadow-sm bg-white text-decoration-none text-dark"
                                    style={{ cursor: "pointer" }}
                                >
                                <img
                                    src={item.images?.[0] || "/no-image.png"}
                                    alt={item.name}
                                    className="rounded"
                                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                />

                                <div className="flex-grow-1">
                                    <h5 className="mb-1">{item.name}</h5>
                                    <div className="mb-2">
                                    <span className="badge bg-danger">
                                        {item.priceMap?.S?.toLocaleString() || "0"} VND
                                    </span>
                                    </div>
                                    <div className="text-muted small">
                                    <div>Đánh giá: {item.ratingsAverage ?? 0} ⭐</div>
                                    </div>
                                </div>
                                </Link>
                            ))
                            ) : (
                            <div className="text-muted">Không có sản phẩm</div>
                            )}
                        </div>
                        )}
                    </div>
                </div>
            </div>}
        </div>
    )
}
export default Navigate;