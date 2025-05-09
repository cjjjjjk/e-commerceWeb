import React, { useState } from "react";

interface CategoryModel {
  _id?: string;
  name: string;
  gender: string;
  des: string;
}

interface Props {
  category: CategoryModel;
  onClose: () => void;
  onSave: (category: CategoryModel) => void;
}

const CategoryModal: React.FC<Props> = ({ category, onClose, onSave }) => {
  const [form, setForm] = useState(category);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return alert("Tên danh mục là bắt buộc");
    onSave(form);
  };

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title">Danh mục</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-2">
              <label className="form-label">Tên danh mục</label>
              <input name="name" className="form-control" value={form.name} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label className="form-label">Giới tính</label>
              <select name="gender" className="form-select" value={form.gender} onChange={handleChange}>
                <option value="Tất cả">Tất cả</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label">Mô tả</label>
              <textarea name="des" className="form-control" value={form.des} onChange={handleChange} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export type { CategoryModel };
export default CategoryModal;
