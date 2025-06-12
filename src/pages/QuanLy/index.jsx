import React from 'react';
import { Link } from 'react-router-dom';

export default function QuanLy() {
  return (
    <div>
      <h1>Trang Quản lý</h1>
      <nav>
        <ul>
          <li><Link to="/quanly/chotso">Chốt số liệu</Link></li>
          <li><Link to="/quanly/ngay">Số liệu trong ngày</Link></li>
          {/* Có thể thêm menu khác ở đây */}
        </ul>
      </nav>
      <p>Chọn một chức năng ở trên để tiếp tục.</p>
    </div>
  );
}
