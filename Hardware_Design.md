# THIẾT KẾ SCHEMATIC VỚI STM32 #

Phần này trình bày các nguyên tắc cơ bản cho cho việc thiết kế schematic sử dụng MCU STM32.

Board cơ bản cho package QFP64:

http://stm32vn.googlecode.com/svn/trunk/image/STM32_SCH_BASIC.PNG

Phần Reset cực kỳ đơn giản, chỉ cần 1 con trở 10k + 1 tụ 100nF là có thể reset tự động khi bật nguồn. Nếu bạn muốn cầu kỳ hơn thì có thể sử dụng một số IC reset chuyên dụng ví dụ MAX811T chẳng hạn.

http://stm32vn.googlecode.com/svn/trunk/image/STM32_SCH_RESET.PNG

Phần chọn mode (Boot) cho STM32 có thể sử dụng DIP SW hoặc Jumper tùy ý.

STM32F hiện nay có các dòng F1, F2, F4, theo tài liệu của ST thì chúng khá tương thích với nhau về chân, ví dụ như package  QFP64 thì F2 và F4 giống nhau, F1 có khác 1 chút, cụ thể là chân 31 và 47. Khi thiết kế chúng ta có thể đưa các option vào giống như hình minh họa ở trên, hoặc chỉ cần dùng 2 con điện trở 0R, khi lắp ráp tùy vào dòng của MCU mà ta có thể gắn tụ hoặc trở tương ứng.

VBAT có thể nối trực tiếp với nguồn 3V3 nếu không muốn lưu giữ thông tin ngày giờ khi mất điện, ngược lại, chúng ta cần đến Pin backup hoặc dùng Supper Cap thực hiện việc duy trì hoạt động của RTC. Có thể thao khảo mạch sau:

http://stm32vn.googlecode.com/svn/trunk/image/STM32_SCH_VBAT.PNG

Về mạch nguồn, chúng ta có thể sử dụng LM1117-3V3 mà không đòi hỏi cầu kỳ cho lắm:

http://stm32vn.googlecode.com/svn/trunk/image/STM32_SCH_POWER.PNG

Giao tiếp SD card:

Có thể sử dụng 1 trong 2 option, lưu ý rằng SDIO chỉ hỗ trợ cho những dòng High Density mà thôi, hình sau minh họa sơ đồ giao tiếp cho 2 loại kết nối trên:

http://stm32vn.googlecode.com/svn/trunk/image/STM32_SCH_SDCARD.PNG

Đối với giao tiếp SDIO chúng ta cần có 1 số điện trở 10K (terminal) kéo lên, ở giao tiếp SPI không có cũng được. Về phần mạch cho Card detect có thể khác nhau tùy vào chủng loại của socket. Sơ đồ trên P thực hiện cho microSD socket thông dụng (có thể tìm thấy ở TME VN).

Giao tiếp USB:

http://stm32vn.googlecode.com/svn/trunk/image/STM32_SCH_USB.PNG

Theo khuyến cáo của ST thì cần phải có bảo vệ ESD (USBLC6-2P6) trên thực tế phần này chỉ là option, mạch của bạn không dùng đến IC này cũng được. Mạng điện trở và 2 BJT dùng để thực hiện connect or disconnect USB ra khỏi host. Khi muốn connect thì ta chỉ việc lập trình PA8 cho xuống mức low, và set PA8 high Z cho trường hợp ngược lại. Chú ý không nên set PA8 lên mức 1 bởi vì đang nối trực tiếp với cực B của BJT. Chúng ta có thể bổ sung thêm con điện trở 1k nằm giữa PA8 và cực B của BJT để được an toàn. Hoặc ta có thể cải tiến bằng cách sử dụng duy nhất 1 transistor PNP (A1015...)

http://stm32vn.googlecode.com/svn/trunk/image/EASY_STM32/USB_Schematic_Modified.PNG

Về đường PA11 và PA12 được layout song hành (diff pair), trở kháng Z diff 100 - 120 ohm. Hiện nay chúng ta thường dùng PCB 2 lớp với độ dày 1.2mm vì thế có thể layout 2 đường song hành với độ rộng trace width cỡ 0.3 - 0.35 mm và khoảng cách giữa 2 dây (gap) 0.2 mm là ok.

Chú ý: Giả sử nếu ta đi dây ở mặt TOP thì mặt BOTOM chúng ta cần phủ một lớp coper (GND) chạy dọc theo đường song hành từ MCU đến Connector để đảm bảo Z diff được duy trì trên suốt đường đi.

Như trên P đã giới thiệu một số thủ thuật đơn giản, các bạn cố gắn tìm hiểu và thực hiện thì sẽ không mắc lỗi mất thời gian cho việc lập trình, phát triển...