# Các vấn đề thường gặp ở EASY\_STM32 #

A> Có thể chuẩn đoán các lỗi kết nối JTAG thông qua cách sau:

Sử dụng chương trình nạp Cocox Flash Programer để chuẩn đoán:

1> Trên thanh status, nếu có thông báo: "adapter not found" điều này có nghĩa chương trình chưa nhận dạng được JTAG. Ta xem lại kết nối dây cable USB, cài đặt driver có đúng quy trình hay không.

2> Trên thanh status thông báo "device not found" ---> Chương trình đã nhận dạng được JTAG, tuy nhiên chưa nhận dạng được MCU, thông thường, do các bước lập trình firmware trước đây vô tình đưa các chân GPIO (có chức năng JTAG của STM32) ra khỏi mode hoạt động mặc định của nó. Ta có thể giải quyết bằng cách chuyển DIP SWITCH Boot0 lên mức 1. Khi reset MCU sẽ không thực thi đoạn chương trình đã ghi trước đó, mà nó sẽ nhảy vào chương trình boot loader của ST, khi đó các chân GPIO này được trả về trạng thái mặc định ban đầu (JTAG). Ta có thể xóa toàn bộ Flash bởi chương trình Cocox Flash Programer và nạp lại chương trình mới theo các bước thông thường.