# Thiệp mời tốt nghiệp — Trần Thị Hiền Dịu

Static website (HTML + CSS + Vanilla JS). Không cần backend, npm hay build.

## Cấu trúc

```text
graduation-invitation/
├── index.html
├── style.css
├── script.js
├── images/
│   ├── portrait.jpg      ← ảnh chính trong khung vòm
│   └── og-image.jpg      ← ảnh preview khi gửi link (1200×630)
└── music/
    └── background.mp3    ← nhạc nền (tự thêm)
```

Muốn thêm gallery: bỏ ảnh vào `images/` rồi liệt kê trong `CONFIG.gallery` — section "A few memories"
(kèm lightbox) sẽ tự hiện. Để trống thì gallery tự ẩn.
Nên nén ảnh (≤ 300 KB/ảnh, cạnh dài ~1600px) để thiệp tải nhanh trên điện thoại.

Nếu chưa có `music/background.mp3`, nút nhạc sẽ tự ẩn và không gây lỗi.

## Chỉnh sửa nội dung

Mọi thứ cần sửa đều nằm ở đầu `script.js`:

```js
const CONFIG = {
    venueName: "[TÊN ĐỊA ĐIỂM]",
    venueAddress: "[ĐỊA CHỈ]",
    mapUrl: "https://maps.google.com/",   // dán link Google Maps của địa điểm
    gallery: []   // vd: ["images/gallery-1.jpg", "images/gallery-2.jpg"]
};

const guests = {
    "dieu-linh": "Bạn Diệu Linh",
    "ngoc-anh": "Bạn Ngọc Anh"
};
```

## Link mời cá nhân

| Link | Hiển thị |
|---|---|
| `/?p=dieu-linh` | Trân trọng kính mời **Bạn Diệu Linh** |
| `/?p=ngoc-anh` | Trân trọng kính mời **Bạn Ngọc Anh** |
| `/` hoặc `/?p=khong-co` | Trân trọng kính mời **Bạn** |

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
