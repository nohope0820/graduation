# Thiệp mời tốt nghiệp — Trần Thị Hiền Dịu

Static website (HTML + CSS + Vanilla JS). Không cần backend, npm hay build.

## Cấu trúc

```text
graduation-invitation/
├── index.html
├── style.css
├── script.js
├── images/
│   ├── default.jpeg      ← ảnh mặc định trong khung vòm
│   ├── ha-linh.jpeg …    ← ảnh riêng cho từng khách
│   └── og-image.jpg      ← ảnh preview khi gửi link (1200×630)
└── music/
    └── 22.mp3            ← nhạc nền (đổi file thì sửa CONFIG.music)
```

Muốn thêm gallery: bỏ ảnh vào `images/` rồi liệt kê trong `CONFIG.gallery` — section "A few memories"
(kèm lightbox) sẽ tự hiện. Để trống thì gallery tự ẩn.
Nên nén ảnh (≤ 300 KB/ảnh, cạnh dài ~1600px) để thiệp tải nhanh trên điện thoại.

Nếu file nhạc trong `CONFIG.music` không tồn tại, nút nhạc sẽ tự ẩn và không gây lỗi.

## Chỉnh sửa nội dung

Mọi thứ cần sửa đều nằm ở đầu `script.js`:

```js
const CONFIG = {
    venueName: "[TÊN ĐỊA ĐIỂM]",
    venueAddress: "[ĐỊA CHỈ]",
    mapUrl: "https://maps.google.com/",   // dán link Google Maps của địa điểm
    musicStart: 10,                       // nhạc bắt đầu (và lặp lại) từ giây thứ 10
    gallery: []   // vd: ["images/gallery-1.jpg", "images/gallery-2.jpg"]
};

const guests = {
    "ha-linh":  { name: "Bạn Hà Linh", photo: "images/ha-linh.jpeg" },
    "em-huyen": { name: "Em Huyền" }   // không có photo → dùng images/default.jpeg
};
```

## Link mời cá nhân

| Link | Tên | Ảnh |
|---|---|---|
| `/?p=bon-li-va-em-trang` | Bôn lì và em Trang | `bon-li-va-em-trang.jpeg` |
| `/?p=ha-linh` | Bạn Hà Linh | `ha-linh.jpeg` |
| `/?p=thanh-nga` | Bạn Thanh Nga | `thanh-nga.jpeg` |
| `/?p=bay-bi-chi-cua-anh-loi` | Bây bi chi của anh Lợi | `bay-bi-chi-cua-anh-loi.jpeg` |
| `/?p=du-bac-bling` | Du Bắc Bling | `du-bac-bling.jpeg` |
| `/?p=em-huyen` | Em Huyền | `default.jpeg` |
| `/?p=em-nhi` | Em Nhi | `default.jpeg` |
| `/` hoặc mã không có trong danh sách | Bạn | `default.jpeg` |

Mã khách không phân biệt hoa/thường. Khi có khách hợp lệ, bìa thiệp cũng hiện dòng "Gửi đến …"
và tiêu đề tab trình duyệt đổi theo tên khách.

## Deploy

**Netlify:** vào app.netlify.com → *Add new site → Deploy manually* → kéo thả cả thư mục `graduation-invitation`.

**Vercel:** `vercel` trong thư mục này, hoặc import từ GitHub (Framework preset: *Other*, không có build command).

Sau khi có domain, sửa `og:image` trong `index.html` thành đường dẫn tuyệt đối để Facebook/Zalo/Messenger hiện ảnh preview, ví dụ:

```html
<meta property="og:image" content="https://ten-thiep.vercel.app/images/og-image.jpg">
```

> Lưu ý: preview mạng xã hội luôn là bản chung (crawler không chạy JavaScript), tên khách chỉ hiện khi mở thiệp.
