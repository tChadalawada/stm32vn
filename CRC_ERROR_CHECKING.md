# Cách tính CRC-8 trong việc kiểm soát lỗi dữ liệu được truyền #
## Cách 1: Phương pháp Direct Calculation ##

Giả sử ta có chuỗi data như sau:

MSB LSB
10000000 00000001 10100011 = Data String (80 01 A3 h)

Đa thức sử dụng để tính CRC-8:

g(D) = D8 + D2 + D + 1	 => 1 0000 0111 (Polynomial) (CRC-8-CCITT)

Tư tưởng chính là ta cứ thực hiện phép XOR giữa data string và polynomial.

Đối với chuỗi data string, ta thêm 8 bits 0 vào cuối (ở vị trí LSB) 1 lần duy nhất trước khi thực hiện các phép XOR sau đó.

Lưu ý là bit đầu tiên trong Polynomial ( 1 0000 0111 ) được align thẳng hàng với bit có giá trị là 1 đầu tiên trong data string tính từ MSB ( 1 0000000 00000001 10100011 00000000 )

Phép XOR có rule như sau:

0 + 0 => 0
1 + 1 => 0
0 + 1 => 1
1 + 0 => 1

Điều kiện dừng của phép lặp XOR là khi ta align polynomial với data string thì tính từ vị trí xuất hiện giá trị 1 đầu tiên của data string đến cuối data string không đủ 8 bit.

Nên kết quả data string của phép XOR cuối cùng chính là CRC-8

```
10000000 00000001 10100011 => data string 

10000000 00000001 10100011 00000000 (add 8 bits value 0) 
10000011 1 (polynomial) 
00000011 10000001 10100011 00000000 (XOR between data string and polynomial) 
10 0000111 (move polynomial to the next appear of value 1 in data string) 
01 10001111 10100011 00000000 
1 00000111 
0 10001000 10100011 00000000 
10000011 1 
00001011 00100011 00000000 
1000 00111 
0011 00011011 00000000 
10 0000111 
01 00010101 00000000 
1 00000111 
0 00010010 00000000 
10000 0111 
00010 01110000 
10 0000111 
00 01111110 
100000111 
```

## Cách 2: Phương pháp Table-Driven ##

Giả sử ta có chuỗi data như sau:

MSB LSB
10000000 00000001 10100011 00000000 = Data String (80 01 A3 h)

1. Khởi tạo 1 biến 1 byte với giá trị là 0 (8 bits đều là 0)

2. Thực hiện phép XOR giữa data string với byte vừa khởi tạo đó

3. Giá trị sau khi XOR của byte đầu tiên được sử dụng để tra trong bảng tìm kiếm

Cách tra như sau:

- Bảng có giá trị index từ 0->255 (ví dụ tên bảng là tbl) nên khi giá trị cần tra là 00010010b (18 dec) => kết quả trả về là tbl[18 ](.md) là 0x7E (01111110b)

4. Dịch chuỗi data string 8 bits về bên trái

5. Tiếp tục thực hiện phép XOR giữa chuỗi data string và kết quả vừa tra được trong bảng tìm kiếm (lưu ý là chúng ta luôn so byte đầu tiên bên MSB)

6. Thực hiện tương tự cho đến byte cuối cùng thì kết quả tra được chính là CRC-8

```
10000000 00000001 10100011 00000000 (data string) 
00000000 (init variable) 
10000000 00000001 10100011 00000000 (XOR result) 

10001001 (result in lookup table) 

00000001 10100011 00000000 (shift 8th bit of data string to left) 
10001001 (XOR with above result lookup table) 

10110001 (result in lookup table) 

10100011 00000000 (shift 8th bit of data string to left) 
00010010 (XOR with above result lookup table) 

01111110 (result in lookup table) 

00000000 (shift 8th bit of data string to left) 
01111110 => CRC
```

**Cách tạo bảng tham chiếu CRC:**

Để tạo bảng tham chiếu CRC, ta làm như sau:

1. Tạo 1 mảng 1 chiều 256 phần tử

2. Duyệt từng phần tử trong bảng, gán giá trị của crc bằng index của phần tử đang xét

3. Duyệt từng bit trong crc đang xét, nếu bit đầu của crc là 0x01 thì dịch trái crc 1 bit và thực hiện hiện phép bù bit với 0x07, còn nếu không thì chỉ thực hiện dịch trái 1 bit mà thôi. Thực hiện với tất cả các bit của crc

4. Cập nhật lại giá trị crc mới vào bảng và duyệt tiếp các phần tử còn lại.

```
void CCRC8Dlg::gen_crc8_table()  
{                         
	uint16_t  index_ui16;    /*table index*/             
	uint8_t   bit_ui8;           /*bit counter*/             
	uint8_t   crc_ui8;          /* CRC result*/            
	
	for ( index_ui16 = 0;  index_ui16 < 256;  index_ui16++ )            
	{                    
		crc_ui8 = index_ui16;                  
		for ( bit_ui8 = 0;  bit_ui8 < 8;  bit_ui8++ )                  
		{                          
			if ( crc_ui8 & 0x80 )                                  
				crc_ui8 = ( crc_ui8 << 1 ) ^ 0x07;                          
			else                                   
				crc_ui8 = ( crc_ui8 << 1 );                  
		}                        
		crc8Table_ui8[index_ui16] = crc_ui8;      
	}  
}

```


---

# Coding #

```
#include "../precompiled.h"
#pragma hdrstop

/*
   CRC-8
*/

#define CRC8_INIT_VALUE		0x0000
#define CRC8_XOR_VALUE		0x0000

#ifdef CREATE_CRC_TABLE

static byte crctable[256];

/*
   Generate a table for a byte-wise 8-bit CRC calculation on the polynomial:
   x^8 + x^2 + x^1 + x^0
*/

void make_crc_table( void ) {
	int i, j;
	unsigned long poly, c;
	/* terms of polynomial defining this crc (except x^8): */
	static const byte p[] = {0,1,2};

	/* make exclusive-or pattern from polynomial (0x07) */
	poly = 0L;
	for ( i = 0; i < sizeof( p ) / sizeof( byte ); i++ ) {
		poly |= 1L << p[i];
	}

	for ( i = 0; i < 256; i++ ) {
		c = i;
		for ( j = 0; j < 8; j++ ) {
			c = ( c & 0x80 ) ? poly ^ ( c << 1 ) : ( c << 1 );
		}
		crctable[i] = (byte) c;
	}
}

#else

/*
  Table of CRC-8's of all single-byte values (made by make_crc_table)
*/
static byte crctable[256] = {
	0x00, 0x07, 0x0E, 0x09, 0x1C, 0x1B, 0x12, 0x15,
	0x38, 0x3F, 0x36, 0x31, 0x24, 0x23, 0x2A, 0x2D,
	0x70, 0x77, 0x7E, 0x79, 0x6C, 0x6B, 0x62, 0x65,
	0x48, 0x4F, 0x46, 0x41, 0x54, 0x53, 0x5A, 0x5D,
	0xE0, 0xE7, 0xEE, 0xE9, 0xFC, 0xFB, 0xF2, 0xF5,
	0xD8, 0xDF, 0xD6, 0xD1, 0xC4, 0xC3, 0xCA, 0xCD,
	0x90, 0x97, 0x9E, 0x99, 0x8C, 0x8B, 0x82, 0x85,
	0xA8, 0xAF, 0xA6, 0xA1, 0xB4, 0xB3, 0xBA, 0xBD,
	0xC7, 0xC0, 0xC9, 0xCE, 0xDB, 0xDC, 0xD5, 0xD2,
	0xFF, 0xF8, 0xF1, 0xF6, 0xE3, 0xE4, 0xED, 0xEA,
	0xB7, 0xB0, 0xB9, 0xBE, 0xAB, 0xAC, 0xA5, 0xA2,
	0x8F, 0x88, 0x81, 0x86, 0x93, 0x94, 0x9D, 0x9A,
	0x27, 0x20, 0x29, 0x2E, 0x3B, 0x3C, 0x35, 0x32,
	0x1F, 0x18, 0x11, 0x16, 0x03, 0x04, 0x0D, 0x0A,
	0x57, 0x50, 0x59, 0x5E, 0x4B, 0x4C, 0x45, 0x42,
	0x6F, 0x68, 0x61, 0x66, 0x73, 0x74, 0x7D, 0x7A,
	0x89, 0x8E, 0x87, 0x80, 0x95, 0x92, 0x9B, 0x9C,
	0xB1, 0xB6, 0xBF, 0xB8, 0xAD, 0xAA, 0xA3, 0xA4,
	0xF9, 0xFE, 0xF7, 0xF0, 0xE5, 0xE2, 0xEB, 0xEC,
	0xC1, 0xC6, 0xCF, 0xC8, 0xDD, 0xDA, 0xD3, 0xD4,
	0x69, 0x6E, 0x67, 0x60, 0x75, 0x72, 0x7B, 0x7C,
	0x51, 0x56, 0x5F, 0x58, 0x4D, 0x4A, 0x43, 0x44,
	0x19, 0x1E, 0x17, 0x10, 0x05, 0x02, 0x0B, 0x0C,
	0x21, 0x26, 0x2F, 0x28, 0x3D, 0x3A, 0x33, 0x34,
	0x4E, 0x49, 0x40, 0x47, 0x52, 0x55, 0x5C, 0x5B,
	0x76, 0x71, 0x78, 0x7F, 0x6A, 0x6D, 0x64, 0x63,
	0x3E, 0x39, 0x30, 0x37, 0x22, 0x25, 0x2C, 0x2B,
	0x06, 0x01, 0x08, 0x0F, 0x1A, 0x1D, 0x14, 0x13,
	0xAE, 0xA9, 0xA0, 0xA7, 0xB2, 0xB5, 0xBC, 0xBB,
	0x96, 0x91, 0x98, 0x9F, 0x8A, 0x8D, 0x84, 0x83,
	0xDE, 0xD9, 0xD0, 0xD7, 0xC2, 0xC5, 0xCC, 0xCB,
	0xE6, 0xE1, 0xE8, 0xEF, 0xFA, 0xFD, 0xF4, 0xF3
};

#endif

void CRC8_InitChecksum( unsigned char &crcvalue ) {
	crcvalue = CRC8_INIT_VALUE;
}

void CRC8_Update( unsigned char &crcvalue, const byte data ) {
	crcvalue = crctable[crcvalue ^ data];
}

void CRC8_UpdateChecksum( unsigned char &crcvalue, const void *data, int length ) {
	unsigned char crc;
	const unsigned char *buf = (const unsigned char *) data;

	crc = crcvalue;
	while( length-- ) {
		crc = crctable[crc ^ *buf++];
	}
	crcvalue = crc;
}

void CRC8_FinishChecksum( unsigned char &crcvalue ) {
	crcvalue ^= CRC8_XOR_VALUE;
}

unsigned char CRC8_BlockChecksum( const void *data, int length ) {
	unsigned char crc;

	CRC8_InitChecksum( crc );
	CRC8_UpdateChecksum( crc, data, length );
	CRC8_FinishChecksum( crc );
	return crc;
}
```


---

Tính trực tiếp không dùng bảng:

```
A simple C implementation of the above polynom is shown in the following code. Again, you can directly copy the source snippet to your code (distributed under LGPL):


// ==========================================================================
// CRC Generation Unit - Linear Feedback Shift Register implementation
// (c) Kay Gorontzi, GHSi.de, distributed under the terms of LGPL
// ==========================================================================
char *MakeCRC(char *BitString)
   {
   static char Res[9];                                 // CRC Result
   char CRC[8];
   int  i;
   char DoInvert;
   
   for (i=0; i<8; ++i)  CRC[i] = 0;                    // Init before calculation
   
   for (i=0; i<strlen(BitString); ++i)
      {
      DoInvert = ('1'==BitString[i]) ^ CRC[7];         // XOR required?

      CRC[7] = CRC[6];
      CRC[6] = CRC[5];
      CRC[5] = CRC[4] ^ DoInvert;
      CRC[4] = CRC[3] ^ DoInvert;
      CRC[3] = CRC[2];
      CRC[2] = CRC[1];
      CRC[1] = CRC[0];
      CRC[0] = DoInvert;
      }
      
   for (i=0; i<8; ++i)  Res[7-i] = CRC[i] ? '1' : '0'; // Convert binary to ASCII
   Res[8] = 0;                                         // Set string terminator

   return(Res);
   }

// A simple test driver:

#include <stdio.h>

int main()
   {
   char *Data, *Result;                                       // Declare two strings

   Data = "1101000101000111";
   Result = MakeCRC(Data);                                    // Calculate CRC
   
   printf("CRC of [%s] is [%s] with P=[100110001]\n", Data, Result);
   
   return(0);
   }
```



---

Reference

Online CRC check tool:

http://ghsi.de/CRC/

