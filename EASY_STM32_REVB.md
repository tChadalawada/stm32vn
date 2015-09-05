# 1> GIỚI THIỆU #

> So với phiên bản A, EASY\_STM32\_REVB được thu gọn với kích thước PCB nhỏ hơn (có thể cắm lên breadboard). Adapter on board debugger được chuyển từ OpenOCD FT3232 sang STLinkV2 hoặc CMSIS-DAP (tùy vào cấu hình firmware cho chip debugger). Ngoài ra, phiên bản mới được thêm vào kết nối Ethernet thích hợp cho một số project điều khiển từ xa thông qua mạng LAN, internet.

![http://stm32vn.googlecode.com/svn/trunk/image/PCB_02.png](http://stm32vn.googlecode.com/svn/trunk/image/PCB_02.png)

# 2> TÍNH NĂNG #

> ## Các tính năng ##

  * Hỗ trợ các dòng STM32 F1, F2 & F4.
  * Hỗ trợ package LQFP48 và LQFP64.
  * On board debugger : SWD, Power Supply (via USB cable).

> ## Ngoại vi ##

  * Onboard SWD Interface.
  * Power Supply (external or via USB cable).
  * ETH interface (RMII).
  * User LED.
  * User button.
  * Extension GPIO pin header.

# 3> SƠ ĐỒ MẠCH ĐIỆN #

> [EASY\_STM32\_REVB\_SCH.pdf](http://stm32vn.googlecode.com/svn/trunk/hardware/EASY_STM32/hardware/schematic/EASY_STM32_REVB_SCH.pdf)

> Note : Click chuột phải --> save link as...

# 4> LẮP RÁP LINH KIỆN #

> Chi tiết về danh sách linh kiện, cách lắp ráp có thể download ở link sau:

> [Hướng dẫn lắp ráp link kiện](http://stm32vn.googlecode.com/svn/trunk/hardware/EASY_STM32/hardware/schematic/EASY_STM32_REVB_ASM.rar)

> Note: Firmware của STLinkV2 được nén thành file .rar và có password, dùng mật khẩu : stlinkv2 để giải nén, ta được file firmware xxxx.bin

# 5> CÁCH RÁP THẠCH ANH Y2 #

> Đối với thạch anh cho chip debugger, ta sử dụng loại có tần số 8MHz, trên PCB sử dụng footprint SMD2520, không may, người ta không sản xuất XTAL 8MHz với kích thước SMD2520 mà chỉ có SMD3225 trở lên. Tuy vậy, PCB vẫn còn khoảng trống cho thạch anh 8MHz SMD3225, cách làm như sau:

> ![http://stm32vn.googlecode.com/svn/trunk/image/XTAL_02.png](http://stm32vn.googlecode.com/svn/trunk/image/XTAL_02.png)

> Đường viền chữ nhật màu trắng biểu thị kích thước và vị trí của loại SMD2520, đường viền màu vàng biểu thị kích thước và vị trí khi ta gắn loại SMD3225 vào.

> Trước khi hàn, ta dùng mỏ hàn thêm 1 chút chì vào 2 pad OSC\_IN và OSC\_OUT ( 2 hình chữ nhật màu xanh da trời), 2 pad GND còn lại ta không cần thêm chì vào, thực tế nếu ta không hàn hai pad này với XTAL (chân 2 & 4) thì mạch vẫn hoạt động bình thường.

> Tương tự đối với XTAL 8MHz SMD3225, ta thêm 1 chút chì hàn vào pad 1 & 3 (xem hình)

> ![http://stm32vn.googlecode.com/svn/trunk/Image/SMD3225_XTAL_02.png](http://stm32vn.googlecode.com/svn/trunk/Image/SMD3225_XTAL_02.png)

> Đặt XTAL 8MHz SMD3225 vào vị trí outline màu vàng, dùng máy khò thổi nhẹ ta có thể gắn thạch anh vào PCB một cách dễ dàng. Sau khi làm xong nên dùng đồng hồ VOM kiểm tra để đảm bảo OSC\_IN và OSC\_OUT không bị chạm với GND là được.

# 6> LOAD FIRMWARE CHO DEBUGGER #

> Onboard debugger bao gồm adaper STLinkV2 (phiên bản clone) sử dụng chíp STM32F103C8T6 (U5), trên PCB có dành sẵn 1 connector SWD (J5) dùng để load firmware vào chíp này. Sử dụng debugger bất kỳ STLink hoặc Jlink để nạp file xxxx.bin vào U5. Sau khi nạp xong, chúng ta cần phải update firmware (thông qua kết nối USB với PC, tham khảo tài liệu hướng dẫn STM32 ST-LINK Utility để biết thêm chi tiết).

# 7> CÁC CHƯƠNG TRÌNH DEMO #

> [EASY\_STM32\_ITM.rar](http://armtutorial.googlecode.com/svn/trunk/src/EASY_STM32_ITM.rar)

> [EASY\_STM32\_RTX.rar](http://armtutorial.googlecode.com/svn/trunk/src/EASY_STM32_RTX.rar)

> [EASY\_STM32\_LWIP\_FreeRTOS.rar](http://armtutorial.googlecode.com/svn/trunk/src/EASY_STM32_LWIP_FreeRTOS.rar)

> [EASY\_STM32\_LWIP\_RTX.rar](http://armtutorial.googlecode.com/svn/trunk/src/EASY_STM32_LWIP_RTX.rar)

> [EASY\_STM32\_RTX\_TIMER.rar](http://armtutorial.googlecode.com/svn/trunk/src/EASY_STM32_RTX_TIMER.rar)

# 8> HÌNH ẢNH BOARD HOÀN CHỈNH #

https://stm32vn.googlecode.com/svn/trunk/Image/EASY_STM32_REVB.JPG

