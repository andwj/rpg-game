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

int tile_pix[34][34];


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


void calc_pixels(int x, int y, int tx, int ty)
{
	// Map of the pixels:  I|E F|J
	//                     -+---+-
	//                     G|A B|K
	//                     H|C D|L
	//                     -+---+-
	//                     M|N O|P

	int I = tile_pix[x  ][y];
	int E = tile_pix[x+1][y];
	int F = tile_pix[x+2][y];
	int J = tile_pix[x+3][y];

	int G = tile_pix[x  ][y+1];
	int A = tile_pix[x+1][y+1];
	int B = tile_pix[x+2][y+1];
	int K = tile_pix[x+3][y+1];

	int H = tile_pix[x  ][y+2];
	int C = tile_pix[x+1][y+2];
	int D = tile_pix[x+2][y+2];
	int L = tile_pix[x+3][y+2];

	int M = tile_pix[x  ][y+3];
	int N = tile_pix[x+1][y+3];
	int O = tile_pix[x+2][y+3];
	int P = tile_pix[x+3][y+3];

	if ((colorA == colorD) && (colorB != colorC))
	{
		if (((colorA == colorE) && (colorB == colorL)) ||
				((colorA == colorC) && (colorA == colorF)
				 && (colorB != colorE) && (colorB == colorJ)))
		{
			product = colorA;
		}
		else
		{
			product = INTERPOLATE (colorA, colorB);
		}

		if (((colorA == colorG) && (colorC == colorO)) ||
				((colorA == colorB) && (colorA == colorH)
				 && (colorG != colorC) && (colorC == colorM)))
		{
			product1 = colorA;
		}
		else
		{
			product1 = INTERPOLATE (colorA, colorC);
		}
		product2 = colorA;
	}
	else if ((colorB == colorC) && (colorA != colorD))
	{
		if (((colorB == colorF) && (colorA == colorH)) ||
				((colorB == colorE) && (colorB == colorD)
				 && (colorA != colorF) && (colorA == colorI)))
		{
			product = colorB;
		}
		else
		{
			product = INTERPOLATE (colorA, colorB);
		}

		if (((colorC == colorH) && (colorA == colorF)) ||
				((colorC == colorG) && (colorC == colorD)
				 && (colorA != colorH) && (colorA == colorI)))
		{
			product1 = colorC;
		}
		else
		{
			product1 = INTERPOLATE (colorA, colorC);
		}
		product2 = colorB;
	}
	else if ((colorA == colorD) && (colorB == colorC))
	{
		if (colorA == colorB)
		{
			product = colorA;
			product1 = colorA;
			product2 = colorA;
		}
		else
		{
			int r = 0;

			product1 = INTERPOLATE (colorA, colorC);
			product = INTERPOLATE (colorA, colorB);

			r += GetResult1 (colorA, colorB, colorG, colorE, colorI);
			r += GetResult2 (colorB, colorA, colorK, colorF, colorJ);
			r += GetResult2 (colorB, colorA, colorH, colorN, colorM);
			r += GetResult1 (colorA, colorB, colorL, colorO, colorP);

			if (r > 0)
				product2 = colorA;
			else if (r < 0)
				product2 = colorB;
			else
			{
				product2 =
					Q_INTERPOLATE (colorA, colorB, colorC,
							colorD);
			}
		}
	}
	else
	{
		product2 = Q_INTERPOLATE (colorA, colorB, colorC, colorD);

		if ((colorA == colorC) && (colorA == colorF)
				&& (colorB != colorE) && (colorB == colorJ)) {
			product = colorA;
		}
		else if ((colorB == colorE) && (colorB == colorD)
				&& (colorA != colorF) && (colorA == colorI)) {
			product = colorB;
		}
		else
		{
			product = INTERPOLATE (colorA, colorB);
		}

		if ((colorA == colorB) && (colorA == colorH)
				&& (colorG != colorC) && (colorC == colorM)) {
			product1 = colorA;
		}
		else if ((colorC == colorG) && (colorC == colorD)
				&& (colorA != colorH) && (colorA == colorI)) {
			product1 = colorC;
		}
		else
		{
			product1 = INTERPOLATE (colorA, colorC);
		}
	}

	*(dP) = colorA;
	*(dP + 1) = product;
	*(dP + (dstPitch >> 2)) = product1;
	*(dP + (dstPitch >> 2) + 1) = product2;
}


void process_tile(int tx, int ty)
{
	int x, y;

	// Copy tile pixels into a separate buffer which has a spare pixel
	// on all four sides.  Those spare pixels are set to the same as the
	// nearest in-tile pixel.  This is done to prevent neighboring tiles
	// from "bleeding" into each other.

	for (x = 0 ; x < 34 ; x++)
	for (y = 0 ; y < 34 ; y++)
	{
		// real pixel
		int rx = x-1;
		int ry = y-1;

		if (rx < 0)  rx = 0;
		if (rx > 31) rx = 31;

		if (ry < 0)  ry = 0;
		if (ry > 31) ry = 31;

		tile_pix[x][y] = in_pix[tx*32 + rx][ty*32 + ry];
	}

	// perform the upscale algorithm

	for (x = 0 ; x < 34 ; x++)
	for (y = 0 ; y < 34 ; y++)
	{
		calc_pixels(x, y, tx, ty);
	}
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

	// process each tile
	for (x = 0 ; x <  WIDTH/32 ; x++)
	for (y = 0 ; y < HEIGHT/32 ; y++)
	{
		process_tile(x, y);
	}

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
