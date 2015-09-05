# VI ĐIỀU KHIỂN STM32 LÀ GÌ #

[STM32 From Wikipedia](http://en.wikipedia.org/wiki/STM32)

[STM32F10X DATASHEET](http://stm32vn.googlecode.com/svn/trunk/doc/STM32F107/CD00220364_Datasheet.pdf)

[STM32F10X USER MANUAL](http://stm32vn.googlecode.com/svn/trunk/doc/STM32F_User_Manual.pdf)


# BẮT ĐẦU VỚI LẬP TRÌNH ARM CORTEX-M3 #

Sau đây là phần hướng dẫn cho mem mới học STM32. Chủ yếu chỉ ra các thao tác cần thiết để có được chương trình Hello World xuất ra cổng USART hoặc là chớp tắt đèn LED (PB1) sử dụng Keil IDE như thế nào.

Project cơ bản:  [stm32\_base.rar](http://stm32vn.googlecode.com/svn/trunk/src/EASY_STM32/Keil/stm32_base.rar)

Mục đích của stm32\_base nhằm tạo ra project nền tảng để áp dụng cho nhiều project khác nhau, ta có thể  xem qua cấu trúc của project như sau:

http://stm32vn.googlecode.com/svn/trunk/image/EASY_STM32/BASE_PROJECT_STRUCTURE.PNG

1. Phần cố định bao gồm thư mục Libraries, ta chỉ sử dụng phần này, không được phép modify, chỉnh sửa source.

2. Phần user project : Ở trên hình có 1 project đã được tạo sẵn có tên là BASE, và sau này nếu muốn tạo project mới ta chỉ cần COPY thư mục BASE và RENAME nó thành tên project mà bạn cần làm.

Tiện thể xem qua các thành phần trong BASE project như thế nào :

http://stm32vn.googlecode.com/svn/trunk/image/EASY_STM32/BASE_PROJECT_EXPLORER.PNG

BASE project được tạo ra với 1 số thành phần được xem là cần thiết cho tất cả các project thông thường, ví dụ như GPIO và USART. USART được retarget để chúng ta có thể hoàn toàn sử dụng các hàm xuất nhập C chuẩn trong thư viện stdio.h ví dụ như printf(), scanf(), getchar(), putchar()---> rất hữu ích cho việc debug firmware.

+ main.c : Chứa code chính của project

+ stm32f10x\_it.c : Các hàm interrupt handler được khai báo trong đây.

+ StdPeriph\_Driver: Các hàm thư viện ngoại vi chuẩn của ST (Phần này ta chỉ sử dụng và ko được phép chỉnh sửa)

+ CMSIS: Các hàm thư viện chuẩn liên quan đến Core ARM Cortex-M3 (Chỉ sử dụng và không được phép chỉnh sửa)

+ Startup: Code Assembly cho việc startup hệ thống (nằm trong thư viện chuẩn, chỉ được phép sửa nếu thực sự cảm thấy cần thiết)

+ Retarget: Định nghĩa lại các hàm xuất nhập để thư viện stidio.h có thể làm việc được với USART1.

# VIẾT CHƯƠNG TRÌNH HELLO WORLD #

Chương trình hello world có thể được viết 1 cách dễ dàng theo bước sau:

Ở dòng 140 add vào đoạn code printf ("Hello World") (xem hình)

http://stm32vn.googlecode.com/svn/trunk/image/EASY_STM32/BASE_PROJECT_HELLO_WORLD.PNG

# VIẾT CHƯƠNG TRÌNH CHỚP TẮT LED TRÊN PB1 #

Các bước thực hiện như sau:

- Tích cực lock cho port B. Mỗi khi sử dụng port nào đó thì ít nhất ta phải tích cực clock periph cho port này. Người ta chủ ý cho phép bật tắt ngoại vi với lý do tiết kiệm điện năng tiêu thụ. Những ngoại vi nào thực sự cần thiết thì mới được bật lên. Do LED được gắn ở chân PortB (PB1, EASY\_STM32 cho tích cực mức thấp) vì thế ta cần tích cực portB trước khi sử dụng. Thao tác này được thực hiện ở hàm RCC\_APB2PeriphClockCmd(), chúng ta add thêm 1 thành phần RCC\_APB2Periph\_GPIOB vào tham số đầu tiên của hàm (ở dòng 78) theo hình sau:

http://stm32vn.googlecode.com/svn/trunk/image/EASY_STM32/BASE_PROJECT_GPIO_PERIPH_ENA.PNG

- Định nghĩa thêm 1 số hàm, macro để tiện cho việc lập trình, ở ví dụ này ta thực hiện thao tác đảo trạng thái sáng tắt của đèn LED, các macro sẽ được định nghĩa như sau (đặt ở phía trên hàm main (line 45):

http://stm32vn.googlecode.com/svn/trunk/image/EASY_STM32/BASE_PROJECT_MACRO.PNG

> Khi muốn thực hiện đảo trạng thái (toggle) ta có thể viết theo cú pháp sau:

```
 LED((BitAction)(1-LED_STATUS)); 
```

- Công việc kế đến là cấu hình chân port điều khiển LED (PB1)

http://stm32vn.googlecode.com/svn/trunk/image/EASY_STM32/BASE_PROJECT_INIT_GPIO_STRUCTURE.PNG

Ở trường hợp này ta set PB1 ở mode GPIO\_Mode\_Out\_PP ( output push pull)

- Kế đến chúng ta cần có 1 đoạn code thực hiện chức năng delay 1 khoảng thời gian nào đó:

http://stm32vn.googlecode.com/svn/trunk/image/EASY_STM32/BASE_PROJECT_DELAY_FUNCTION.PNG

- Cuối cùng, chúng ta add đoạn code toggle LED vào vòng loop chính của hàm main():

http://stm32vn.googlecode.com/svn/trunk/image/EASY_STM32/BASE_PROJECT_BLINK_LED.PNG

Với project cơ bản [stm32\_base.rar](http://stm32vn.googlecode.com/svn/trunk/src/EASY_STM32/Keil/stm32_base.rar) chúng ta có thể viết chương trình chớp tắt đèn LED trong vòng 5 phút.

Sau khi biên dịch vào load firmware vào MCU thì chương trình sẽ in ra console dòng chữ Hello World và đồng thời chớp tắt đèn LED trên portB PB1.