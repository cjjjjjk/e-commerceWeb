import { uploadToImgur, deleteUploaded } from "../services/imgurService";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './productModal.css'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToast } from "shared/components/toast/toastSlice";
import adminService from "../services/adminService";

export interface ProductModel {
  _id: string;
  name: string;
  description: string;
  stockMap: Record<string, number>;
  soldMap: Record<string, number>;
  priceMap: Record<string, number>;
  images: string[];
  createdAt: string;
  gender: string;
  categoryId: string;
  sizes: string[];
  colors: string[];
  ratingsAverage: number;
  ratingsCount: number;
  id: string;
}

interface Props {
  product: ProductModel | null | any;
  onClose: () => void;
  onSave: (updateProduct: ProductModel | any) => Promise<void>;
}

export default function ProductModalComponent({ product, onClose, onSave }: Props) {
  const isUpdate: boolean = product.name;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = (msg: string, type: "success" | "error" | "info") =>
    dispatch(addToast({ message: msg, type }));

  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedList, setUploadedList] = useState<{ link: string, deleteHash: string }[]>([]);
  const [editedProduct, setEditedProduct] = useState<ProductModel>(product!);
  const [categories, setCategories] = useState<{ _id: string, name: string, gender: string }[]>([])
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await adminService.getAllCategories();
        setCategories(res.data);
  
        // Nếu tạo mới và chưa có categoryId thì gán mặc định
        if (!editedProduct.categoryId) {
          setEditedProduct((prev) => ({
            ...prev,
            categoryId: "681abce6977590298c9dda9e",
          }));
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách categories:", err);
        showToast("Không thể tải danh mục sản phẩm", "error");
      }
    };
  
    fetchCategories();
  }, []);

  const handleInputChange = (field: keyof ProductModel, value: any) => {
    setEditedProduct({ ...editedProduct, [field]: value });
  };

  const handleMapChange = (mapKey: "stockMap" | "priceMap", size: string, value: number) => {
    setEditedProduct({
      ...editedProduct,
      [mapKey]: {
        ...editedProduct[mapKey],
        [size]: value,
      },
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) return;

    setUploading(true);
    try {
      const uploadRes = await uploadToImgur(files[0]);
      setUploadedList(prev => [...prev, {
        link: uploadRes.link,
        deleteHash: uploadRes.deletehash,
      }]);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const newImages = uploadedList.map(item => item.link);
    const updatedProduct = {
      ...editedProduct,
      images: [...editedProduct.images, ...newImages],
    };
    try {
      await onSave(updatedProduct);
      setUploadedList([]);
      showToast("Cập nhật thành công", "success");
      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      showToast("Đã xảy ra lỗi khi lưu sản phẩm.", "error");
      await handleClose();
    }
  };
  const handleClose = async () => {
    for (const item of uploadedList) {
      try {
        await deleteUploaded(item.deleteHash);
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }
    setUploadedList([]);
    onClose();
  };


  const [newColorHex, setNewColorHex] = useState<string>("#000000");

  const handleAddColor = (hexColor: string) => {
    const formatted = `Custom-${hexColor.toUpperCase()}`;
    if (!editedProduct.colors.includes(formatted)) {
      setEditedProduct({
        ...editedProduct,
        colors: [...editedProduct.colors, formatted],
      });
    }
  };
  
  const handleRemoveColor = (colorToRemove: string) => {
    setEditedProduct({
      ...editedProduct,
      colors: editedProduct.colors.filter((color) => color !== colorToRemove),
    });
  };

  if (!product) return null;

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog modal-xl shadow-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"><strong>{"Chỉnh sửa sản phẩm".toUpperCase()}</strong></h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Tên sản phẩm</label>
              <input
                type="text"
                className="form-control"
                value={editedProduct.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mô tả</label>
              <textarea
                className="form-control"
                rows={3}
                value={editedProduct.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              ></textarea>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Giới tính</label>
                <select
                  className="form-select"
                  value={editedProduct.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Tất cả">Tất cả</option>
                </select>
              </div>
              <div className="col">
                <label className="form-label">Danh mục</label>
                <select
                  className="form-select"
                  value={editedProduct.categoryId ?? "681abce6977590298c9dda9e"}
                  onChange={(e) => handleInputChange("categoryId", e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Sizes và tồn kho / giá</label>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Tồn kho</th>
                      <th>Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editedProduct.sizes.map((size) => (
                      <tr key={size}>
                        <td>{size}</td>
                        <td>
                          <input
                            type="string"
                            className="form-control"
                            value={editedProduct.stockMap[size] || 0}
                            onChange={(e) =>
                              handleMapChange("stockMap", size, Number(e.target.value))
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="string"
                            className="form-control"
                            value={editedProduct.priceMap[size] || 0}
                            onChange={(e) =>
                              handleMapChange("priceMap", size, Number(e.target.value))
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Màu sắc</label>
              <div className="d-flex flex-wrap gap-2 mb-2">
                {editedProduct.colors.map((color, idx) => (
                  <span
                    key={idx}
                    className="badge d-flex align-items-center border"
                    style={{
                      padding: "0.5rem",
                      backgroundColor: color.split("-")[1] || "#ccc",
                      color: "#fff"
                    }}
                  >
                    {color}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2"
                      style={{ fontSize: "0.6rem" }}
                      onClick={() => handleRemoveColor(color)}
                    ></button>
                  </span>
                ))}
              </div>

              <div className="d-flex justify-content-start gap-3">
                <input
                  type="color"
                  className="form-control form-control-color"
                  style={{ width: '3rem', height: '3rem' }}
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  title="Chọn màu"
                />
                <button
                  className="btn btn-outline-primary fw-bolder"
                  type="button"
                  onClick={() => handleAddColor(newColorHex)}
                >
                  Thêm  
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Ảnh sản phẩm</label>
              <div className="d-flex flex-wrap gap-2">
                {[
                  ...editedProduct.images,
                  ...uploadedList.map((item) => item.link)
                ].map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="product"
                    style={{ width: 100, height: 120, objectFit: "cover" }}
                  />
                ))}
              </div>
              <input type="file" className="form-control mt-2" onChange={handleImageUpload} disabled={uploading} />
              {uploading && (
                <span><i className="pi pi-spin pi-spinner"></i> Đang tải ảnh lên...</span>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>
              Đóng
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={uploading}
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
