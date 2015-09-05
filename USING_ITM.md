# GIỚI THIỆU #

> https://stm32vn.googlecode.com/svn/trunk/Image/EASY_STM32_REVB.JPG

> EASY\_STM32 bao gồm module STlinkV2 tích hợp trên board, với 1 cổng USB device, có thể dùng để cấp nguồn cho board đồng thời gửi message debug lên máy tính. Có nghĩa ta không cần phải dùng kết nối UART cho hàm printf. Tính năng này được thực hiện bởi module ITM trên core ARM cortex-M.

> ITM (Instrumentation Trace Macrocell Unit) là gì ? ITM là ứng dụng cho phép gửi các trace packages debug hệ thống thông qua các thanh gi (ITM stimulus registers), các package này được debugger thu thập lại và gửi lên máy tính. Ví dụ tool Keil sử dụng Serial Wire Viewer (SWV) để hiển thị thông tin ra màn hình. Chương trình trên vi xử lý có thể xuất message thông qua hàm printf, lớp dưới của printf sẽ gọi đến các hàm xuất nhập chuẩn fputc(). Chúng ta thường sửa lại những hàm này để có thể hiển thị ra hyper terminal, hoặc LCD 16x2...Thao tác này được gọi là Retarget. Đối với ITM hoàn toàn có thể làm tương tự, các thông tin debug sẽ được hiển thị trên màn hình SWV trong Keil IDE.

> Phần sau đây hướng dẫn cách retarget cho ITM, test thử trên board EASY\_STM32.

# RETARGET #

> Các thanh ghi ITM stimulus được mô tả trong các tài liệu core ARM cortex-M, việc truy xuất các thanh ghi này được khai báo bởi các macro như sau:

```
     #define ITM_Port8(n)    (*((volatile unsigned char *)(0xE0000000+4*n)))
     #define ITM_Port16(n)   (*((volatile unsigned short*)(0xE0000000+4*n)))
     #define ITM_Port32(n)   (*((volatile unsigned long *)(0xE0000000+4*n)))

     #define DEMCR           (*((volatile unsigned long *)(0xE000EDFC)))
     #define TRCENA          0x01000000
```

# DEBUGGER SETTING #

> Trước khi sử dụng SWV, ta cần enable trace cho STlinkV2, thực hiện bằng cách chọn mục cấu hình debugger --> setting --> enable trace.

> Kế đến ta tick select vào ITM Port 0 theo hình sau :


![http://www.keil.com/support/man/docs/ulink2/ulink2_trace_itm_viewer_port0_0.png](http://www.keil.com/support/man/docs/ulink2/ulink2_trace_itm_viewer_port0_0.png)

# SỬ DỤNG SERIAL WIRE VIER #

> Ở menu, chọn "View" --> "Serial Windows" --> "Debug (printf) Viewer"


![http://www.keil.com/support/man/docs/ulink2/ulink2_trace_itm_viewer_select.png](http://www.keil.com/support/man/docs/ulink2/ulink2_trace_itm_viewer_select.png)


> Khi sử dụng printf, ta có kết quả như sau :


![http://www.keil.com/support/man/docs/ulink2/ulink2_trace_itm_viewer.png](http://www.keil.com/support/man/docs/ulink2/ulink2_trace_itm_viewer.png)


# SOURCE CODE DOWNLOAD #


[EASY\_STM32\_ITM.rar](http://armtutorial.googlecode.com/svn/trunk/src/EASY_STM32_ITM.rar)


---

## Reference link ##

http://www.keil.com/support/man/docs/ulink2/ulink2_trace_itm_viewer.htm
