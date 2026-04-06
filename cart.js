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
    // Tự động cập nhật số lượng trên thanh menu
    capNhatIconGioHang();
}

// Cập nhật số lượng sản phẩm hiển thị ngay trên chữ "Cart" ở thanh Menu
function capNhatIconGioHang() {
    let gioHang = layGioHang();
    let tongSoLuong = 0;
    
    // Tính tổng số lượng đồ trong giỏ
    for (let i = 0; i < gioHang.length; i++) {
        tongSoLuong += gioHang[i].soLuong;
    }
    
    // Tìm đường dẫn Cart ở thanh điều hướng trên cùng
    let theCartNav = document.querySelector('nav a[href="cart.html"]');
    if (theCartNav) {
        if (tongSoLuong > 0) {
            theCartNav.innerText = 'Cart (' + tongSoLuong + ')';
            theCartNav.style.color = '#ff4d4f'; // Cho màu đỏ để dễ nhận biết
            theCartNav.style.fontWeight = 'bold';
        } else {
            theCartNav.innerText = 'Cart';
            theCartNav.style.color = '';
            theCartNav.style.fontWeight = 'normal';
        }
    }
}

// --- TỰ ĐỘNG ĐỒNG BỘ KHI CHUYỂN TAB TRÌNH DUYỆT ---
// Nếu bạn mở nhiều tab (một tab Shop, một tab Cart), 
// khi thao tác tab Shop, tab Cart sẽ tự nhận biết và rải lại giao diện!
window.addEventListener('storage', function(e) {
    if (e.key === 'gioHangCaNhan') {
        capNhatIconGioHang();
        hienThiGioHang(); // Vẽ lại giỏ hàng trong tab đang mở
    }
});

// Hàm dùng để hiện một thông báo nhỏ khi người dùng bấm thêm sản phẩm
function hienThongBao(noiDung) {
    // Tìm thẻ thông báo trong trang web
    let theThongBao = document.getElementById('thongBaoGioHang');
    
    // Nếu chưa có thẻ này thì mình tạo mới
    if (!theThongBao) {
        theThongBao = document.createElement('div');
        theThongBao.id = 'thongBaoGioHang';
        theThongBao.className = 'thongBao';
        document.body.appendChild(theThongBao);
    }

    // Gán nội dung muốn thông báo
    theThongBao.innerText = noiDung;
    
    // Đặt lại class về mặt định
    theThongBao.className = 'thongBao';

    // Buộc trình duyệt "tính toán lại giao diện" (reflow) để hiệu ứng chuyển động có thể chạy lại từ đầu
    void theThongBao.offsetWidth;

    // Cho hiện thẻ lên bằng class 'hien'
    theThongBao.className = 'thongBao hien';

    // Sau 2.5 giây (2500 milliseconds) thì ẩn thông báo đi
    setTimeout(function() {
        theThongBao.className = 'thongBao';
    }, 2500);
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
    capNhatIconGioHang(); // Đồng bộ icon trên thanh điều hướng ngay khi trang web vừa mở
    
    // --- TỰ ĐỘNG THÊM NÚT "+" CHO TẤT CẢ SẢN PHẨM Ở SHOP VÀ BLOG ---
    let tatCaSanPham = document.querySelectorAll('.card, .blog-card');
    
    // Duyệt qua từng sản phẩm tìm thấy
    tatCaSanPham.forEach(function(theSanPham) {
        // Tạo ra nút hình tròn mang dấu +
        let nutCong = document.createElement('div');
        nutCong.innerHTML = '+';
        nutCong.className = 'btn-them-vao-gio'; // Đã style bên style.css
        
        // Cài đặt sự kiện: Chỉ thêm vào giỏ khi người dùng click vào dấu + này
        nutCong.addEventListener('click', function(e) {
            e.stopPropagation(); // Ngăn trình duyệt nhảy sang trang chi tiết
            e.preventDefault();
            
            // Tìm tên (thường nằm trong h4 hoặc h3)
            let tenSP = theSanPham.querySelector('h4') ? theSanPham.querySelector('h4').innerText : (theSanPham.querySelector('h3') ? theSanPham.querySelector('h3').innerText : 'Sản phẩm mới');
            
            // Tìm giá (nếu có, không có thì xem như 0đ)
            let giaSP = 0;
            let cacTheP = theSanPham.querySelectorAll('p');
            cacTheP.forEach(function(theP) {
                if (theP.innerText.includes('VND')) {
                    giaSP = Number(theP.innerText.replace(/\./g, '').replace(' VND', ''));
                }
            });
            
            // Lấy hình ảnh
            let theIMG = theSanPham.querySelector('img');
            let hinhSP = theIMG ? theIMG.src : '';
            
            // Thực hiện việc thêm vào giỏ hàng
            themVaoGio(tenSP, giaSP, hinhSP);
        });
        
        // Gắn nút + vào mỗi sản phẩm
        theSanPham.appendChild(nutCong);
        
        // Xóa thuộc tính onclick cứng trong HTML nếu có
        theSanPham.removeAttribute('onclick');
        
        // Đặt lại sự kiện: Khi click phần khác ngoài nút + thì sẽ sang trang xem chi tiết
        theSanPham.style.cursor = 'pointer';
        theSanPham.addEventListener('click', function() {
            // Tùy theo nơi bạn click, nó sẽ đi đến mô tả chi tiết của món đó
            window.location.href = '#'; 
            // Ta có thể giữ theSanPham.onclick = function() { window.location.href='product.html' }
            // nhưng ở đây đặt về # tạm thời để ko lỗi chuyển trang (như bản thiết kế ban đầu)
            window.location.href = 'product.html';
        });
    });
});
