# GIỚI THIỆU #

Như ta đã biết, mỗi loại MPU điều có datasheet, user manual, application note, những tài liệu này cho phép ta hiểu được đặc tả chi tiết từng thanh ghi của MPU tương ứng. Tùy vào tính phức tạp mỗi loại MPU có số lượng thanh ghi, cấu trúc các bit khác nhau. Lập trình viên cần phải hiểu đặc tả các thanh ghi, các bit trước khi tiến hành coding. Tuy nhiên, có những loại MPU tồn tại với hàng chục, thậm chí hàng trăm thanh ghi thì việc ghi nhớ toàn bộ các thanh ghi này đối với người lập trình viên là điều không thể. Vì thế, trong quá trình coding chúng ta cần phải tham khảo datasheet, user manual như là những cuốn sổ tay luôn luôn mang trong người vậy.

# BIT FIELD TRONG THANH GHI #

Đối với phong cách lập trình ngôn ngữ C, chúng ta có những cách làm giảm bớt những khó nhọc trên. Bằng phương pháp hoạch định coding hiệu quả, chúng đa sẽ có được những đoạn mã rõ ràng dễ đọc và dễ quản lý hơn. Sau đây chúng ta sẽ đi sâu vào cách khai báo bit field trong thanh ghi vào chương trình C như thế nào.

Đơn cử ví dụ cho thanh ghi của LPC2103 S0SPCR (0xE0020000) (SPI Control Register) được tổ chức như sau:

```
S0SPCR (0xE0020000) : SPI Control Register 
Bit [1:0]    Reserved
Bit [2]        ENA
Bit [3]        CPHA
Bit [4]        CPOL
Bit [5]        MSTR
Bit [6]        LSBF
Bit [7]        SPIE
Bit [11:8]   BITS
Bit [31:12] Reserved
```

Để truy xuất thanh ghi, thông thường người ta định nghĩa macro trong header file của source C, cú pháp định nghĩa như sau:

```
#define S0SPCR (*(volatile unsigned int *)(0xE0020000))
```

Để truy xuất các bit trong thanh ghi, người ta dùng phương pháp che mặt nạ với các toán tử bit & | ^ ~ và << >>.

Ví dụ: để set bit CPHA và SPIE ta dùng lệnh sau:

```
S0SPCR |= (1<<3)|(1<<7);
```

Với cách này, trình biên dịch cho phép ta thực hiện lệnh gán 1 lần cho việc thay đổi các bit, tuy nhiên chúng ta cần phải nhớ vị trí các bit trên thanh ghi để có thao tác truy xuất đúng.

# ĐỊNH NGHĨA BIT FIELD TRONG C #

Ta có thể định nghĩa bit field vào header file bằng cách sau:

```
struct _T_S0SPCR_ {
     unsigned int RSV1:2;  // Reserved bits 
     unsigned int ENA:1;    // Bit enable
     unsigned int CPHA:1;  // Clock phase control
     unsigned int CPOL:1;  // Clock polality control
     unsigned int MSTR:1;  // Master mode select
     unsigned int LSBF:1;   // LSB first 
     unsigned int SPIE:1;    // Interrupt enable
     unsigned int BITS:4;    // Number of bits per transfer 
     unsigned int RSV2:20; // Reserved bits
};

#define S0SPCR_BIT (*(volatile struct _T_S0SPCR_ *)(0xE0020000))  
```

Lệnh sau cho phép ta gán giá trị cho CHPA và BITS:

```
S0SPCR_BIT.CPHA = 1;
S0SPCR_BIT.BITS = 0x0A; // 10 bits per transfer 
```

Hoặc ta có thể định nghĩa bit field và toàn bộ thanh ghi trên cùng 1 macro, xét ví dụ sau:

```
union _U_S0SPCR_ {
   unsigned int REG;
   struct {
      unsigned int RSV1:2;  // Reserved bits 
      unsigned int ENA:1;    // Bit enable
      unsigned int CPHA:1;  // Clock phase control
      unsigned int CPOL:1;  // Clock polality control
      unsigned int MSTR:1;  // Master mode select
      unsigned int LSBF:1;   // LSB first 
      unsigned int SPIE:1;    // Interrupt enable
      unsigned int BITS:4;    // Number of bits per transfer 
      unsigned int RSV2:20; // Reserved bits
   } BIT;
}

#define S0SPCR (*(volatile union _U_S0SPCR_ *)(0xE0020000))
```

```
S0SPCR.BIT.CPHA = 1;
S0SPCR.BIT.BITS = 0x0A;
```

Sẽ tương đương với:

```
S0SPCR.REG |= (1<<3)|(0x0A<<8);
```

# KẾT LUẬN #

Sử dụng bit field giúp cho việc lập trình rõ ràng và nhanh chóng (nhất là đối với các IDE có hỗ trợ các tính năng intellisense và autocomplete). Tùy vào từng trường hợp cụ thể mà ta dùng phương pháp gán từng bit field hay không bởi vì code size của chương trình lớn hơn so với cách gán giá trị thanh ghi theo kiểu thông thường.
