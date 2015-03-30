/*
 * Upscale the tileset.ppm image using the 2xSaI algorithm.
 * 
 * 2xSaI code is by Derek Liauw ("Kreed") and under the GNU GPL v2+
 */

#include <stdio.h>
#include <stdlib.h>


const int input_trans = 0x313233;

#define WIDTH	(10 * 32)
#define HEIGHT	(26 * 32)

int in_pix[WIDTH][HEIGHT];

int out_pix[WIDTH*2][HEIGHT*2];


int read_pixel()
{
	int r = getchar();
	int g = getchar();
	int b = getchar();

	return (r << 16) | (g << 8) | b;
}


void write_pixel(int pix)
{
	int r = (pix & 0xff0000) >> 16;
	int g = (pix & 0x00ff00) >>  8;
	int b = (pix & 0x0000ff);

	putchar(r);
	putchar(g);
	putchar(b);
}


int main()
{
	int i;
	int x, y;

	// skip header
	for (i = 0 ; i < 15 ; i++)
	{
		getchar();
	}

	// read pixels
	for (y = 0 ; y < HEIGHT ; y++)
	for (x = 0 ; x < WIDTH  ; x++)
	{
		in_pix[x][y] = read_pixel();	
	}

	// FIXME : process

	// write PPM file
	printf("P6\n%d %d\n255\n", WIDTH*2, HEIGHT*2);
	
	for (y = 0 ; y < HEIGHT*2 ; y++)
	for (x = 0 ; x < WIDTH*2  ; x++)
	{
		write_pixel(out_pix[x][y]);
	}
}

// --- editor settings ----
// vi:ts=4:sw=4:noexpandtab
