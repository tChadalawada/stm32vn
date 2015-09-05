# GNU ATTRIBUTE HOW TO #

As an example, let's define this structure:

```
struct s {
   char aChar;
   int    anInt;
};
```

A processor that aligns on eight-byte boundaries may compile this so that aChar is in the first byte, followed by seven bytes of unused space, then starting anInt in the ninth byte.

A processor that aligns on four-byte boundaries may compile this so that aChar is in the first byte, followed by three bytes of unused space, then starting anInt in the fifth byte.

To force anInt to begin immediately after aChar, you would define the structure like this:

```
struct s {
   char aChar;
   int anInt __attribute__((packed));
};
```

To test these ideas out, I ran this code on an old Pentium 166:

```
#include <stdio.h>

struct s1 {
   char a;
   int  i;
};

struct s2 {
   char a;
   int i __attribute__((packed));
};

int main( int argc, char* argv[] ) {

  struct s1 s_1;
  struct s2 s_2;

  printf( "sizeof s1 is %d\n" , sizeof(s_1) );
  printf( "sizeof s2 is %d\n" , sizeof(s_2) );

  return( 0 );
}
```

Result:

```
eric.r.turner@turing:~/lab/packed$ ./foo
sizeof s1 is 8
sizeof s2 is 5
```

More example:

```
struct s1 {
void *a;
char b[2];
int i;
};
```

Result: 12

```
struct s2 {
void *a
char b[2];
int i ;
}__attribute__((packed));
```

Result:

void **a => 32-bit processor means this is 32 bits wide (or 4 bytes)
char b[2](2.md) => a char is typically 1 byte. You have two of them. So b occupies 2 bytes
int i => most 32-bit machines also default to 32 bits for plain integers (again, 4 bytes)**

So sizeof(a) + sizeof(b) + sizeof(i) = 4 + 2 + 4 = 10

For your non-packed structure, you processor is aligning to 4-byte boundaries. Thus, a fills one full 4-byte block, b fills two bytes of the next block (leaving 2 other bytes unused), and i occupies the next full 4-byte block. So, in that case:

sizeof(a) + sizeof(b) + sizeof(wasted space) + sizeof(i) = 4 + 2 + 2 + 4 = 12

# Online coding #

> Visit : http://codepad.org/