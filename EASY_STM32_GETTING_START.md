# 1> GIỚI THIỆU #

EASY\_STM32 là header board sử dụng chíp ARM Cortex-M3 STM32 của ST Microelectronics. Phần debug tích hợp sẵn trên board vì thế chỉ cần 1 máy tính, 1 sợi dây cable USB, và một header board EASY\_STM32 người lập trình viên có thể coding và test theo cách tiện lợi nhất. Ngoài ra, board còn được thiết kế hỗ trợ cho nhiều dòng ARM MCU khác nhau bao gồm STM32F1, STM32F2 và STM32F4. Hỗ trợ đồng thời 2 dạng package thông dụng bao gồm LQFP-48 và LQFP-64.

EASY\_STM32 thích hợp cho người mới tìm hiểu ARM CM3 hoặc có thể dùng làm kit phát triển sản phẩm mẫu trước khi cho ra các sản phẩm chính thức.

http://ujtag.googlecode.com/svn/trunk/Image/EASY_STM32_PL.PNG

# 2> TÍNH NĂNG #

## EASY\_STM32 bao gồm các tính năng sau: ##

  * Hỗ trợ các dòng STM32 F1, F2 & F4.
  * Hỗ trợ package LQFP-48 và LQFP64.
  * On board debugger : JTAG, UART, Power Supply (via USB cable).

## EASY\_STM32 bao gồm các ngoại vi như sau: ##

  * JTAG Interface.
  * UART Interface.
  * Power Supply (external or via USB cable).
  * MicroSD Card Interface (SPI or SDIO, fefault SPI).
  * RF Module Interface (RFM12, SPI).
  * RTC clock source 32.768 KHz.
  * User LED (PB1).
  * Externsion GPIO pin header.

# 3> SCHEMATIC #

[EASY STM32 SCHEMATIC REVA](http://stm32vn.googlecode.com/svn/trunk/hardware/EASY_STM32/hardware/schematic/schematic_easy_stm32_revA.pdf)

**BUG REPORT**

Hardware EASY\_STM32 REVA đang tồn tại những bug như sau:
> - JTAG buffer U5 (TDI) --> Không dùng U5, nối tắc các đường tín hiệu tương ứng.

> - Chân port PA3 chưa được đưa ra ngoài header.

=> Các bug này sẽ được fix ở phiên bản tiếp theo kèm theo những cải tiến mới.


---


# 4> GETTING START #

> Phần này hướng dẫn cách setup môi trường và cách sử dụng EASY\_STM32.

## 4.1> Cài đặt USB driver ##

> Khi khi kết nối USB JTAG vào máy tính sẽ hiện lên hộp thoại, khi đó ta trỏ đến thư mục chứa driver là có thể hoàn tất việc cài đặt. Driver có thể download ở link sau:

[CDM20802 WHQL Certified.zip](http://ujtag.googlecode.com/svn/trunk/ujtag_files/CDM20802%20WHQL%20Certified.zip)

## 4.2> Sử dụng chương trình nạp standalone CoFlash ##

> Có thể sử dụng chương trình nạp standalone CoFlash, đây là chương trình miễn phí được hỗ trợ bởi trang http://www.coocox.org, ta có thể download [CoFlash-1.3.6](http://ujtag.googlecode.com/svn/trunk/ujtag_files/CoFlash-1.3.6.exe) và cài đặt vào máy tính.

> Các hình minh họa sau chỉ ra cách sử dụng CoFlash để nạp firmware (file.bin) vào ARM CM3. Trước tiên ta chọn loại cable và MCU cho phù hợp, rồi sau đó thực hiện lập trình flash ở tab Command (xem hình):

http://ujtag.googlecode.com/svn/trunk/Image/CooFlash_Config_2.PNG

Cấu hình CooFlash

http://ujtag.googlecode.com/svn/trunk/Image/CooFlash_Prog.PNG

Các thao tác lập trình Flash cho chíp STM32F103RC

## 4.3> Sử dụng với Keil IDE ##

> Trước tiên ta download và cài đặt các gói phần mềm sau:

> a) [KEIL-FOR-ARM-4.10.rar](http://ujtag.googlecode.com/svn/trunk/tools/KEIL-FOR-ARM-4.10.rar)

> b) [CooCox\_Colink\_MDK\_Plugin\_V1.82\_Setup.exe](http://ujtag.googlecode.com/svn/trunk/ujtag_files/CooCox_Colink_MDK_Plugin_V1.82_Setup.exe)

> Chúng ta sẽ cài đặt KEIL IDE trước, rồi mới cài đặt plugin. Sau đó chúng ta có thể cấu hình theo các bước minh họa sau:

http://www.arm.vn/Portals/0/CongCu/UJTAG/UJTAG8.JPG

  * Ở toolbar chọn menu Flash à Configurable Flash Tools.
  * Chọn Use Target Driver for Flash Programming.
  * Ở mục drop-down chọn CooCox Colink Debugger.
  * Tick vào mục Update Target before Debugging.

http://www.arm.vn/Portals/0/CongCu/UJTAG/UJTAG9.JPG

Có thể xem tham số của plugin bằng cách lick vào nút Settings

http://stm32vn.googlecode.com/svn/trunk/image/EASY_STM32/JTAG_SETTING.PNG

http://www.arm.vn/Portals/0/CongCu/UJTAG/UJTAG10.JPG

Ở table debug, chọn Use: Coocox Colink Debugger (xem hình dưới), các thuộc tính khác để mặc định.
Ta có thể thay đổi thông số Jtag clk bằng cách ấn vào nút Settings phía bên phải. Giá trị Jtag clk thông thường được chọn cỡ < 1/10 tần số thạch anh trên board. Nếu set quá thấp thì tốc độ download firmware và debug sẽ giảm, nếu quá cao Jtag tap controller không thể đáp ứng kịp gây ra tình trạng treo chương trình debug.

http://www.arm.vn/Portals/0/CongCu/UJTAG/UJTAG11.JPG

http://www.arm.vn/Portals/0/CongCu/UJTAG/UJTAG12.JPG

Sau khi hoàn tất các bước trên chúng ta có thể download firmware vào chíp hoặc chạy chương trình debug 1 cách bình thường.


---


# 5> SOURCE CODE DEMO #

> Source code demo có thể down load ở link sau:

> http://stm32vn.googlecode.com/svn/trunk/src/EASY_STM32/


---


# 6> HÌNH ẢNH BOARD THỰC TẾ #

> http://stm32vn.googlecode.com/svn/trunk/image/EASY_STM32/IMG_0717.JPG

> http://stm32vn.googlecode.com/svn/trunk/image/EASY_STM32/IMG_0718.JPG


---


# NEW MDK PLUGIN #

http://ujtag.googlecode.com/svn/trunk/ujtag_files/CoMDKPlugin-1.3.2.exe






