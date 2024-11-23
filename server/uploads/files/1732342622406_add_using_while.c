#include <stdio.h>

void main()
{
  int a = 0;

  for (int i = 1; i <= 10; i++)
  {
    a += 8;
  }

  printf("%d", a);
}