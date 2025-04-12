import { useEffect, useState } from 'react';
import './admin.css'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToast } from 'shared/components/toast/toastSlice';
import {SetLoadingNaviBar} from 'shared/navi/navigateSlice'
import adminService  from './adminService';

const API_URL = process.env.REACT_APP_API_URL

const Item = ({ object, onSelect }: { object: any, onSelect: (obj: any) => void }) => (
    <div 
        onClick={() => onSelect(object)}
        className='item'
    >
        {object.name + (object._id ? ` Id:${object._id}` : "")}
    </div>
);

const JsonCraw = ({type, object, onClose, isCreate }: {type:string, object: any, onClose: ()=>void, isCreate: boolean }) => {
    // Toast
    const dispatch = useDispatch();
    const showToast = (message: string, type: "success" | "error" | "info", link?: string) => {
      dispatch(addToast({ message, type , link}));
    };
    // Json
    const cleanedObject = { ...object };
    delete cleanedObject._id;

    const [jsonValue, setJsonValue] = useState(JSON.stringify(cleanedObject, null, 2));
    const [tempValue, setTempValue] = useState(jsonValue);

    const handleSave = () => { // Save or Create
        try {
            setJsonValue(tempValue);
            console.log("Saved JSON:", JSON.parse(tempValue));

            if(isCreate) {
                if(type === "products") {
                    adminService.createProduct(JSON.parse(tempValue)).then((res:any)=> {
                        showToast("Tạo mới sản phẩm thành công", res.data.status || "info");
                        onClose();
                    }).catch((error) => {
                        showToast("Tạo mới không thành công", "error");
                    });
                } 
                else if(type === "categories") {
                    adminService.createCategory(JSON.parse(tempValue)).then((res:any)=> {
                        showToast("Tạo mới danh mục thành công", res.data.status || "info");
                        onClose();
                    }).catch((error) => {
                        showToast("Tạo mới không thành công", "error");
                    });
                }
            }

        } catch (error) {
            showToast("Dữ liệu không đúng định dạng", "error");
        }
    };

    const handleExit = () => {
        setTempValue(jsonValue);
        onClose()
    };

    const handleDelete = () => {
        setJsonValue("{}");
        setTempValue("{}");
        axios.delete(`${API_URL}/${type}/${object._id}`)
            .then((res: any) => {
                console.log(res)
                if(res.data.status) showToast(res.data.statusText, res.data.status );
                onClose();
            })
            .catch((error) => {
                showToast("Xóa không thành công", "error");
            });
        
    };

    return (
        <div className="position-fixed top-50 start-50 translate-middle p-4 bg-white shadow-lg rounded border d-flex flex-column" style={{ width: "1200px", height:'700px' }}>
            <textarea
                className="form-control mb-3 flex-grow-1"
                rows={6}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
            />
            <div className="d-flex justify-content-end gap-3">
                <button className="btn btn-danger" onClick={handleDelete}>Xóa</button>
                <button className="btn btn-secondary" onClick={handleExit}>Hủy</button>
                <button className="btn btn-primary" onClick={handleSave}>Lưu</button>
            </div>
        </div>
    );
};
export default function Admin() {
    const dispatch = useDispatch();
    const showToast = (message: string, type: "success" | "error" | "info", link?: string) => {
      dispatch(addToast({ message, type , link}));
    };

    const [isUpdate, SetIsUpdate] = useState<boolean> (false);
 
    const [orderList, SetOrderList] = useState<any[]>();
    const [cateList, SetCateList]= useState<any[]>();
    const [productList, SetProductList] = useState<any[]>();

    const [crrType, SetCrrType] = useState<string>("")

    const [selectedObject, SetSelectedObject]= useState<any>(null);

    const handleSelect = (type: string,obj: any) => {
        SetCrrType(type)
        SetSelectedObject(obj);
    };

    const handleExit = ()=>{
        SetSelectedObject(null)
        handleUReload();
    }

    const handleCreate = (type: string)=>{
        SetCrrType(type);
        let emptyObject = {};
        if(type === "categories") {
            SetSelectedObject(emptyObject);
            
        } else if (type === "products") {
            SetSelectedObject(emptyObject);
        }
        else {
            showToast("Không thể tạo mới", "error");
        }
    }
    
    const handleUReload = ()=>{
        dispatch(SetLoadingNaviBar())
        SetIsUpdate(!isUpdate);
    }
    // FETCH DATAS ================================================================
    const fetchData = async (url: string, setter: (data: any) => void) => {
        try {
            const res = await axios.get(url, { timeout: 5000 });
            setter(res.data?.data?.products||res.data?.data?.orders || res.data);
        } catch (err: any) {
            handleApiError(err);
        }
    }; 
    const handleApiError = (err: any) => {
        if (err.code === "ECONNABORTED") {
            console.error("Request timeout! Server may be down.");
        } else if (err.response) {
            console.error(`Error: ${err.response.status} - ${err.response.statusText}`);
        } else {
            showToast("Server NOT WORKING !", "error");
        }
    };
    useEffect(() => {
        Promise.all([
            fetchData(`${API_URL}/products?page=1&limit=15`, SetProductList),
            fetchData(`${API_URL}/orders?page=1&limit=20`,SetOrderList ),
            fetchData(`${API_URL}/categories`, SetCateList)
        ]).catch(() => showToast("Lỗi gì đấy không biết", "error"));
    }, [isUpdate, ]);
    // =============================================================================

    return (
        <div className='admin-full-container w-100 h-100 d-flex justify-content-center align-items-center'>
            {selectedObject &&crrType&& <JsonCraw type={crrType} object={selectedObject} onClose={handleExit} isCreate={Object.keys(selectedObject).length === 0}/>}
            <div className="admin-container d-flex flex-column">
                <div className="back-container">{"ADMIN CONTROL"    }</div>
                <div className='control-container flex-grow-1 d-flex w-100'>
                    <div className='list-container orders-container w-50'>
                        <div
                            className='header-controls'
                        >
                            <h4>ĐƠN HÀNG</h4>
                            <input type="text" placeholder='Tìm kiếm' />
                        </div>
                        <div className='list'>
                        {
                            orderList && orderList.map((obj, index) => 
                                <Item
                                    onSelect={(obj: any)=>{handleSelect('order', obj)}}
                                    key={index} object={obj} />)
                        }
                        </div>
                    </div>
                    <div className="edit-container d-flex flex-column w-50">
                        <div className='list-container cate-container'>
                            <div
                                className='header-controls'
                            >
                                <h4>DANH MỤC</h4>
                                <input type="text" placeholder='Tìm kiếm' />
                                <button 
                                    onClick={()=>{handleCreate('categories')}}
                                    className="btn btn-success pi pi-plus">
                                </button>
                            </div>
                            <div className='list'>
                                {
                                    cateList && cateList.map((obj, index) => <Item onSelect={(obj: any)=>{handleSelect('categories', obj)}} key={index} object={obj} />)
                                }
                            </div>
                        </div>
                        <div className='list-container product-container flex-grow-1'>
                            <div
                                className='header-controls'
                            >
                                <h4>SẢN PHẨM</h4>
                                <input type="text" placeholder='Tìm kiếm' />
                                <button 
                                    onClick={()=>{handleCreate('products')}}
                                    className="btn btn-success pi pi-plus">
                                </button>
                            </div>
                            <div className='list'>
                                {
                                    productList && productList.map((obj, index) => <Item onSelect={(obj: any)=>{handleSelect('products', obj)}} key={index} object={obj} />)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                
                
            </div>
        </div>
    )
}