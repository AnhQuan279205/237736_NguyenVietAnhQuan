
import React, { useEffect, useState } from "react";
import "./style.css";

const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
}/employees`;

const EMPTY_FORM = {
  employeeId: "",
  fullName: "",
  gender: "Nam",
  dateOfBirth: "",
  department: "",
  position: "",
  email: "",
  phone: "",
  hireDate: "",
  status: "Dang lam viec",
};

const FIELDS = [
  { name: "employeeId", label: "Mã nhân viên", required: true },
  { name: "fullName", label: "Họ và tên", required: true },
  { name: "dateOfBirth", label: "Ngày sinh", type: "date" },
  { name: "department", label: "Phòng ban" },
  { name: "position", label: "Chức vụ" },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Số điện thoại" },
  { name: "hireDate", label: "Ngày vào làm", type: "date" },
];

async function apiRequest(url, options = {}) {
  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Không thể kết nối backend. Hãy kiểm tra server tại localhost:5000."
    );
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message ||
        result.error ||
        `Yêu cầu thất bại (HTTP ${response.status}).`
    );
  }

  return result;
}

function getEmployees(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result.employees)) return result.employees;
  return [];
}

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadEmployees(keyword = search) {
    setLoading(true);
    setError("");

    try {
      const query = keyword.trim()
        ? `?search=${encodeURIComponent(keyword.trim())}`
        : "";

      const result = await apiRequest(`${API_URL}${query}`);
      setEmployees(getEmployees(result));
    } catch (err) {
      setError(err.message || "Không tải được danh sách nhân viên.");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEmployees(search);
    }, 300);

    return () => clearTimeout(timer);
    // Tải lại khi từ khóa tìm kiếm thay đổi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function editEmployee(employee) {
    setEditingId(employee._id || employee.employeeId);

    setForm({
      employeeId: employee.employeeId || "",
      fullName: employee.fullName || "",
      gender: employee.gender || "Nam",
      dateOfBirth: employee.dateOfBirth
        ? String(employee.dateOfBirth).slice(0, 10)
        : "",
      department: employee.department || "",
      position: employee.position || "",
      email: employee.email || "",
      phone: employee.phone || "",
      hireDate: employee.hireDate
        ? String(employee.hireDate).slice(0, 10)
        : "",
      status: employee.status || "Dang lam viec",
    });

    setNotice("");
    setError("");
    document
      .getElementById("employee-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const isEditing = editingId !== null;
      const url = isEditing
        ? `${API_URL}/${encodeURIComponent(editingId)}`
        : API_URL;

      const result = await apiRequest(url, {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify(form),
      });

      setNotice(
        result.message ||
          (isEditing
            ? "Cập nhật nhân viên thành công."
            : "Thêm nhân viên thành công.")
      );

      resetForm();
      await loadEmployees(search);
    } catch (err) {
      setError(err.message || "Không lưu được thông tin nhân viên.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEmployee(employee) {
    const id = employee._id || employee.employeeId;

    if (
      !window.confirm(
        `Bạn có chắc muốn xóa nhân viên "${employee.fullName}" (${employee.employeeId}) không?`
      )
    ) {
      return;
    }

    setDeletingId(id);
    setError("");
    setNotice("");

    try {
      const result = await apiRequest(
        `${API_URL}/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      setNotice(result.message || "Xóa nhân viên thành công.");
      if (String(editingId) === String(id)) resetForm();
      await loadEmployees(search);
    } catch (err) {
      setError(err.message || "Không xóa được nhân viên.");
    } finally {
      setDeletingId(null);
    }
  }

  const workingCount = employees.filter(
    (employee) => employee.status === "Dang lam viec"
  ).length;

  return (
    <main className="app-shell">
      <header className="page-header">
        <div className="brand-mark">HR</div>
        <div>
          <p className="eyebrow">HUMAN RESOURCE MANAGEMENT</p>
          <h1>Hệ thống quản lý nhân sự</h1>
          <p className="subtitle">
            Quản lý hồ sơ nhân viên tập trung và hiệu quả.
          </p>
        </div>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-icon">👥</span>
          <div>
            <p>Tổng nhân viên hiển thị</p>
            <strong>{employees.length}</strong>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon">✓</span>
          <div>
            <p>Đang làm việc</p>
            <strong>{workingCount}</strong>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon">⌕</span>
          <div>
            <p>Trạng thái hệ thống</p>
            <strong className="system-status">
              {loading ? "Đang tải..." : error ? "Có lỗi" : "Sẵn sàng"}
            </strong>
          </div>
        </article>
      </section>

      {error && (
        <div className="alert alert-error" role="alert">
          <strong>Có lỗi:</strong> {error}
        </div>
      )}

      {notice && (
        <div className="alert alert-success" role="status">
          {notice}
        </div>
      )}

      <section className="panel" id="employee-form">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">EMPLOYEE INFORMATION</p>
            <h2>{editingId !== null ? "Cập nhật nhân viên" : "Thêm nhân viên"}</h2>
          </div>
          {editingId !== null && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Hủy chỉnh sửa
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {FIELDS.map((field) => (
              <label className="field" key={field.name}>
                <span>
                  {field.label}
                  {field.required && <b className="required"> *</b>}
                </span>
                <input
                  name={field.name}
                  type={field.type || "text"}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={Boolean(field.required)}
                  disabled={saving}
                />
              </label>
            ))}

            <label className="field">
              <span>Giới tính</span>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="Nam">Nam</option>
                <option value="Nu">Nữ</option>
                <option value="Khac">Khác</option>
              </select>
            </label>

            <label className="field">
              <span>Trạng thái</span>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="Dang lam viec">Đang làm việc</option>
                <option value="Tam nghi">Tạm nghỉ</option>
                <option value="Da nghi viec">Đã nghỉ việc</option>
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving
                ? "Đang lưu..."
                : editingId !== null
                  ? "Lưu thay đổi"
                  : "+ Thêm nhân viên"}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={resetForm}
              disabled={saving}
            >
              Làm mới biểu mẫu
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-heading list-heading">
          <div>
            <p className="eyebrow">EMPLOYEE DIRECTORY</p>
            <h2>Danh sách nhân viên</h2>
            <p className="subtitle">
              Tìm theo mã nhân viên hoặc họ tên.
            </p>
          </div>

          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => loadEmployees(search)}
            disabled={loading}
          >
            ↻ Làm mới
          </button>
        </div>

        <div className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Nhập mã nhân viên hoặc họ tên..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Tìm kiếm nhân viên"
          />
          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearch("")}
              aria-label="Xóa nội dung tìm kiếm"
            >
              ×
            </button>
          )}
        </div>

        <div className="table-meta">
          <span>
            {loading
              ? "Đang tải dữ liệu..."
              : `${employees.length} nhân viên`}
          </span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Mã nhân viên</th>
                <th>Họ và tên</th>
                <th>Phòng ban</th>
                <th>Chức vụ</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading && employees.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    Đang tải danh sách nhân viên...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    {error
                      ? "Không tải được dữ liệu. Hãy kiểm tra backend."
                      : search
                        ? "Không tìm thấy nhân viên phù hợp."
                        : "Chưa có dữ liệu nhân viên."}
                  </td>
                </tr>
              ) : (
                employees.map((employee) => {
                  const id = employee._id || employee.employeeId;
                  const isWorking = employee.status === "Dang lam viec";

                  return (
                    <tr key={id}>
                      <td>
                        <span className="employee-id">
                          {employee.employeeId || "—"}
                        </span>
                      </td>
                      <td className="employee-name">
                        {employee.fullName || "—"}
                      </td>
                      <td>{employee.department || "—"}</td>
                      <td>{employee.position || "—"}</td>
                      <td>{employee.email || "—"}</td>
                      <td>{employee.phone || "—"}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            isWorking ? "status-working" : "status-other"
                          }`}
                        >
                          {employee.status === "Dang lam viec"
                            ? "Đang làm việc"
                            : employee.status === "Tam nghi"
                              ? "Tạm nghỉ"
                              : employee.status || "Chưa cập nhật"}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="btn-small btn-edit"
                            onClick={() => editEmployee(employee)}
                            disabled={deletingId !== null}
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            className="btn-small btn-delete"
                            onClick={() => deleteEmployee(employee)}
                            disabled={deletingId !== null}
                          >
                            {String(deletingId) === String(id)
                              ? "Đang xóa..."
                              : "Xóa"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <p className="table-footnote">
          Dữ liệu được lấy từ API backend. Các thao tác thêm, sửa và xóa sẽ cập
          nhật danh sách sau khi máy chủ phản hồi thành công.
        </p>
      </section>

      <footer className="page-footer">
        HR Manager · Hệ thống quản lý nhân sự
      </footer>
    </main>
  );
}