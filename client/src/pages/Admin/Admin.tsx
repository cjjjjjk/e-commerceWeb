import { useEffect, useState } from "react";
import axios from "axios";
import './admin.css';
import { useDispatch } from "react-redux";
import { addToast } from "shared/components/toast/toastSlice";
import adminService from "./services/adminService";
import { useNavigate } from "react-router-dom";

import ProductModalComponent from "./components/productModal";
import OrderModal from "./components/orderModal";
import CategoryModal, {CategoryModel} from "./components/categoryModal";

import { ProductModel } from "./components/productModal";
import { getStatusMeta } from "./components/orderModal";

const API_URL = process.env.REACT_APP_API_URL;

const TABS = ["orders", "products", "categories"];
const PAGE_LIMIT = 10;

export default function Admin() {
  const [activeTab, setActiveTab] = useState("orders");
  const [dataList, setDataList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [categoryForm, setCategoryForm] = useState({ name: "", gender: "Tất cả", des: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = (msg: string, type: "success" | "error" | "info") =>
    dispatch(addToast({ message: msg, type }));


  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any|null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoryModel | null>(null);

  const handleStatusChange = async (status: "pending"|"confirmed"|"shipped"|"delivered"|"cancelled") => {
    if (!selectedOrder) return;
    try {
      await adminService.updateOrderStatus(selectedOrder._id, status);
      showToast("Cập nhật trạng thái thành công", "success");
      setSelectedOrder({ ...selectedOrder, status: status });
      loadData();
    } catch {
      showToast("Lỗi khi cập nhật trạng thái", "error");
    }
  };

  const handleProductChange = async (product: any) => {
    try {
      if (!selectedProduct.name) {
      
        const { _id, id, ...newProduct } = product;
  
        const createRes = await adminService.createProduct(newProduct);
        showToast("Tạo sản phẩm thành công", "success");
      } else {
        const updateRes = await adminService.updateProduct(product);
        showToast("Cập nhật sản phẩm thành công", "success");
      }
      loadData();
    } catch (er: any) {
      showToast("Lỗi khi tạo/cập nhật sản phẩm", "error");
    }
  };

  const handleCategoryChange = async (category: CategoryModel) => {
    try {
      if (!category._id) {
        await adminService.createCategory(category);
        showToast("Tạo danh mục thành công", "success");
      } else {
        await adminService.updateCategory(category);
        showToast("Cập nhật danh mục thành công", "success");
      }
      setSelectedCategory(null);
      loadData();
    } catch (e) {
      showToast("Lỗi khi xử lý danh mục", "error");
    }
  };

  const handleCreate = () => {
    if (activeTab === "categories") {
      setSelectedCategory({ name: "", gender: "Tất cả", des: "" });
    }
    else if(activeTab === "products") {
      const defaultProduct: ProductModel = {
        _id: "",
        id: "",
        name: "",
        description: "",
        categoryId: "",
        createdAt: new Date().toISOString(),
        gender: "Tất cả",
        images: [],
        sizes: ["S", "M", "L"],     
        colors: ["black","white"],
        ratingsAverage: 0,
        ratingsCount: 0,
        priceMap: {},
        stockMap: {},
        soldMap: {},
      };
      setSelectedProduct(defaultProduct);
    }
  };

  useEffect(() => {
    const guardCheck = async () => {
      try {
        const isAdmin = await adminService.checkAdmin();
        if (!isAdmin) {
          showToast("Bạn không có quyền truy cập trang này", "error");
          navigate("/member");
        }
      } catch (err: any) {
        showToast("Đã xảy ra lỗi khi kiểm tra quyền truy cập", "error");
        navigate("/member");
      }
    };
    guardCheck();
  }, []);
  

  useEffect(() => {
    loadData();
  }, [activeTab, page]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      let res;
      if (activeTab === "orders") {
        res = await adminService.getAllOrder({ page, limit: PAGE_LIMIT });
        setDataList(res.data.data.orders || []);
        setTotalPages(res.data.totalPages || 1);
      } else if (activeTab === "products") {
        res = await adminService.getAllProducts({ page, limit: PAGE_LIMIT });
        setDataList(res.data.data.products || []);
        setTotalPages(res.data.totalPages || 1);
      } else {
        const res = await adminService.getAllCategories();
        setDataList(res.data || []);
        setTotalPages(1);
      }
    } catch (err) {
      showToast("Không thể tải dữ liệu", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getPageNumbers = (totalPages: number, currentPage: number): (number | string)[] => {
    const pages: (number | string)[] = [];
  
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
  
    return pages;
  };

  const handleShowDeleteModal = (id: string) => {
    setItemToDelete(id);
    setShowConfirmDeleteModal(true);
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        if (activeTab === "products") {
          await adminService.deleteProduct(itemToDelete);
        } else if (activeTab === "categories") {
          await adminService.deleteCategory(itemToDelete);
        }
        showToast("Xoá thành công", "success");
        setShowConfirmDeleteModal(false);
        loadData();
      } catch (err: any) {
        showToast("Lỗi khi xoá", "error");
      }
    }
  };

  const renderTabs = () => (
    <ul className="nav nav-tabs flex-column">
      {TABS.map((tab) => (
        <li className="nav-item " key={tab}>
          <button
            className={`nav-link text-start w-100 ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              setPage(1); 
              setActiveTab(tab);
            }}
          >
            {tab.toUpperCase()}
          </button>
        </li>
      ))}
    </ul>
  );

  const renderList = () => (
    <div className="flex-grow-1">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0 text-capitalize">{activeTab}</h5>
        {(activeTab === "products" || activeTab === "categories") && (
          <button className="btn btn-success" onClick={handleCreate}>
            Thêm mới
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="text-muted">Đang tải...</div>
      ) : (
        <ul className="list-group">
          {dataList.map((item, idx) => (
            <li className="list-group-item d-flex justify-content-between align-items-center gap-1" key={idx}>
              <div
                className="show-cursor flex-grow-1"
                onClick={() => {
                  if (activeTab === "orders") {
                    setSelectedOrder(item);
                  } else if (activeTab === "products") {
                    setSelectedProduct(item);
                  } else if (activeTab === "categories") {
                    setSelectedCategory(item);
                  }
                }}
              >
                <strong>{`${idx + 1}. ${item.name || item.shippingAddress?.name || "Không rõ"}`}</strong>
                <div className="text-muted small">
                  {item._id && `ID: ${item._id}`}
                </div>
              </div>
              {item.status && (
                <button className={"fw-bolder btn "+ getStatusMeta(item.status).style } disabled>
                  {getStatusMeta(item.status).label}
                </button>
              )}
              {(activeTab === "products" || activeTab === "categories") && <button
                className="btn btn-link p-0 text-danger"
                onClick={() => handleShowDeleteModal(item._id)}
              >
                <i className="pi pi-trash"></i>
              </button>}
            </li>
          ))}
        </ul>
      )}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination">
              {getPageNumbers(totalPages, page).map((p, i) => (
                <li
                  className={`page-item ${p === page ? "active" : ""} ${p === "..." ? "disabled" : ""}`}
                  key={i}
                >
                  <button
                    className="page-link"
                    onClick={() => typeof p === "number" && setPage(p)}
                    disabled={p === "..."}
                  >
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="container container-admin container-fluid">
      <h4 className="w-100 d-flex"> 
      <strong>ADMIN</strong>
      <span className="btn btn-link ms-auto" 
        onClick={() => navigate('statistic')}>THỐNG KÊ</span>
      </h4>
      <div className="row" style={{ minHeight: "80vh" }}>
        <div className="col-md-2 border-end">{renderTabs()}</div>
        <div className="col-md-10">{renderList()}</div>
      </div>
     {showConfirmDeleteModal && (
        <div className="modal show d-block align-self-center" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title">Xác nhận xóa</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn xóa mục này?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmDeleteModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Xoá
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSave={handleStatusChange}
        />
      )}
      {selectedProduct && (
        <ProductModalComponent
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSave={handleProductChange}
        />
      )}
      {selectedCategory && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onSave={handleCategoryChange}
        />
      )}
    </div>
  );
}
