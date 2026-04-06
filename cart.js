// --- cart.js ---
// File này chứa các đoạn code để quản lý Giỏ Hàng (Cart) cho trang web của bạn
// Code được viết đơn giản và dễ hiểu dành cho người mới bắt đầu lập trình

// Hàm này chạy khi mình muốn lấy dữ liệu giỏ hàng từ bộ nhớ của trình duyệt (localStorage)
function layGioHang() {
    // Lấy dữ liệu dạng chữ (chuỗi) từ localStorage bằng từ khóa 'gioHangCaNhan'
    let duLieuGioHang = localStorage.getItem('gioHangCaNhan');
    
    // Nếu có dữ liệu thì mình "dịch" nó từ chữ về lại dạng mảng dữ liệu (Array) của Javascript bằng JSON.parse
    if (duLieuGioHang != null) {
        return JSON.parse(duLieuGioHang);
    } else {
        // Nếu chưa có gì trong giỏ hàng thì mình trả về một mảng rỗng []
        return [];
    }
}

// Hàm này chạy khi mình muốn lưu giỏ hàng mới vào bộ nhớ trình duyệt
function luuGioHang(gioHangMoi) {
    // "Dịch" mảng dữ liệu thành dạng chữ (chuỗi) bằng JSON.stringify vì localStorage chỉ lưu được chữ
    let duLieuDungGoi = JSON.stringify(gioHangMoi);
    // Lưu vào bộ nhớ với từ khóa 'gioHangCaNhan'
    localStorage.setItem('gioHangCaNhan', duLieuDungGoi);
}

// Hàm dùng để hiện một thông báo nhỏ khi người dùng bấm thêm sản phẩm
function hienThongBao(noiDung) {
    // Tìm thẻ thông báo trong trang web
    let theThongBao = document.getElementById('thongBaoGioHang');
    
    // Nếu chưa có thẻ này thì mình tạo mới
    if (!theThongBao) {
        theThongBao = document.createElement('div');
        theThongBao.id = 'thongBaoGioHang';
        document.body.appendChild(theThongBao);
    }

    // Gán nội dung muốn thông báo
    theThongBao.innerText = noiDung;
    // Cho hiện thẻ lên bằng class 'hien'
    theThongBao.className = 'thongBao hien';

    // Sau 2 giây (2000 milliseconds) thì ẩn thông báo đi
    setTimeout(function() {
        theThongBao.className = 'thongBao';
    }, 2000);
}

// Hàm này dùng khi bấm nút "Thêm vào giỏ" trên toàn bộ thẻ sản phẩm
function themVaoGio(tenSanPham, giaSanPham, linkHinhAnh) {
    // 1. Lấy giỏ hàng hiện tại ra
    let gioHang = layGioHang();

    // 2. Tạo một sản phẩm mới dạng Đố Tượng (Object) với các thông tin đã cho
    let sanPhamMoi = {
        ten: tenSanPham,
        gia: giaSanPham,
        hinh: linkHinhAnh,
        soLuong: 1
    };

    // 3. Kiểm tra xem sản phẩm này đã có trong giỏ hàng chưa
    let daCoTrongGio = false;
    for (let i = 0; i < gioHang.length; i++) {
        if (gioHang[i].ten === tenSanPham) {
            // Nếu có rồi thì mình chỉ tăng số lượng lên 1
            gioHang[i].soLuong = gioHang[i].soLuong + 1;
            daCoTrongGio = true;
            break; // Thoát vòng lặp
        }
    }

    // 4. Nếu chưa có thì mình thêm sản phẩm mới vào cuối giỏ hàng
    if (!daCoTrongGio) {
        gioHang.push(sanPhamMoi);
    }

    // 5. Lưu lại giỏ hàng vào bộ nhớ
    luuGioHang(gioHang);

    // 6. Hiện thông báo cho người dùng biết
    hienThongBao('Đã thêm "' + tenSanPham + '" vào giỏ hàng!');
}

// --- DƯỚI ĐÂY LÀ CÁC HÀM XỬ LÝ RIÊNG CHO TRANG CART.HTML ---

function xoaSanPham(tenSanPhamCanXoa) {
    let gioHang = layGioHang();
    
    // Giữ lại các sản phẩm có TÊN khác với TÊN SẢN PHẨM CẦN XÓA
    // Lệnh filter giúp lọc mảng theo điều kiện
    let gioHangMoi = gioHang.filter(function(sanPham) {
        return sanPham.ten !== tenSanPhamCanXoa;
    });

    luuGioHang(gioHangMoi);
    hienThiGioHang(); // Chạy lại hàm vẽ lên màn hình
}

function thayDoiSoLuong(tenSanPham, soLuongMoi) {
    let gioHang = layGioHang();

    // Tìm sản phẩm trùng tên và thay đổi thuộc tính soLuong
    for (let i = 0; i < gioHang.length; i++) {
        if (gioHang[i].ten === tenSanPham) {
            gioHang[i].soLuong = Number(soLuongMoi);
            break;
        }
    }

    luuGioHang(gioHang);
    hienThiGioHang(); // Vẽ lại giao diện
}

function dinhDangTienVN(soTien) {
    // Hàm này giúp định dạng số tiền, ví dụ: 3600000 -> 3,600,000
    return soTien.toLocaleString('en-US');
}

// Hàm này dùng để lấy dữ liệu trang Giỏ Hàng và vẽ trực tiếp lên trang web `cart.html`
function hienThiGioHang() {
    let gioHang = layGioHang();
    // Tìm ô chứa danh sách sản phẩm trên cart.html
    let khuVucSanPham = document.querySelector('.cart-items');
    
    // Nếu chúng ta không ở trang cart.html thì dừng lại và không chạy hàm này
    if (!khuVucSanPham) return; 

    // Xóa trắng khu vực hiển thị trước khi vẽ cái mới
    khuVucSanPham.innerHTML = '';
    let tongTien = 0;

    // Nếu giỏ hàng trống thì báo trống
    if (gioHang.length === 0) {
        khuVucSanPham.innerHTML = '<p style="padding: 20px;">Giỏ hàng của bạn đang trống. Hãy quay lại trang <a href="shop.html">Shop</a> để mua sắm nhé!</p>';
    }

    // Duyệt qua từng sản phẩm trong giỏ hàng (bằng vòng lặp for)
    for (let i = 0; i < gioHang.length; i++) {
        let sp = gioHang[i];
        // Tính tiền bằng Giá x Số lượng
        let thanhTien = sp.gia * sp.soLuong;
        tongTien = tongTien + thanhTien; // Cộng dồn vào tổng tiền

        // Mẫu giao diện hiển thị 1 sản phẩm 
        let htmlSanPham = `
            <div class="cart-item">
                <img src="${sp.hinh}" alt="${sp.ten}">
                <div class="item-details">
                    <h4>${sp.ten}</h4>
                    <p>Subtotal: <span class="item-price">${dinhDangTienVN(thanhTien)} VND</span></p>
                    <p style="margin-top: 10px; cursor: pointer; color: #ff4d4f; text-decoration: underline;" onclick="xoaSanPham('${sp.ten}')">Xóa</p>
                </div>
                <div class="item-quantity">
                    <input type="number" value="${sp.soLuong}" min="1" onchange="thayDoiSoLuong('${sp.ten}', this.value)">
                </div>
            </div>
        `;
        // Thêm đoạn html này vào khu vực sản phẩm
        khuVucSanPham.innerHTML += htmlSanPham;
    }

    // Cập nhật lên chỗ hiển thị Tổng Tiền
    let theTongTien = document.querySelectorAll('.summary-line span:nth-child(2)');
    if (theTongTien.length >= 2) {
        // Có nhiều chỗ hiển thị tổng tiền trong giỏ hàng (như Subtotal, và phần Total chốt lại)
        theTongTien[0].innerText = dinhDangTienVN(tongTien) + ' VND';
        theTongTien[1].innerText = "Miễn Phí"; // Shipping
        theTongTien[2].innerText = dinhDangTienVN(tongTien) + ' VND';
    }
}

// Lệnh này quan trọng để chạy hàm hienThiGioHang() khi trang web cart.html vừa tải xong
document.addEventListener('DOMContentLoaded', function() {
    hienThiGioHang();
});
