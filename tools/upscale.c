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
	// Map of input pixels:  I|E F|J
	//                       -+---+-
	//                       G|A B|K
	//                       H|C D|L
	//                       -+---+-
	//                       M|N O|P

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

	// Output pixels:  p1  p2
	//
	//                 p3  p4

	int p1 = A;
	int p2 = A;
	int p3 = A;
	int p4 = A;

	if ((A == D) && (B != C))
	{
		p4 = A;

		if (((A == E) && (B == L)) || ((A == C) && (A == F) && (B != E) && (B == J)))
		{
			p2 = A;
		}
		else
		{
			p2 = INTERPOLATE(A, B);
		}

		if (((A == G) && (C == O)) || ((A == B) && (A == H) && (G != C) && (C == M)))
		{
			p3 = A;
		}
		else
		{
			p3 = INTERPOLATE(A, C);
		}
	}
	else if ((B == C) && (A != D))
	{
		p4 = B;

		if (((B == F) && (A == H)) || ((B == E) && (B == D) && (A != F) && (A == I)))
		{
			p2 = B;
		}
		else
		{
			p2 = INTERPOLATE(A, B);
		}

		if (((C == H) && (A == F)) || ((C == G) && (C == D) && (A != H) && (A == I)))
		{
			p3 = C;
		}
		else
		{
			p3 = INTERPOLATE(A, C);
		}
	}
	else if ((A == D) && (B == C))
	{
		if (A == B)
		{
			p2 = A;
			p3 = A;
			p4 = A;
		}
		else
		{
			int r = 0;

			p3 = INTERPOLATE(A, C);
			p2 = INTERPOLATE(A, B);

			r += GetResult1 (A, B, G, E, I);
			r += GetResult2 (B, A, K, F, J);
			r += GetResult2 (B, A, H, N, M);
			r += GetResult1 (A, B, L, O, P);

			if (r > 0)
				p4 = A;
			else if (r < 0)
				p4 = B;
			else
			{
				p4 = Q_INTERPOLATE(A, B, C, D);
			}
		}
	}
	else
	{
		p4 = Q_INTERPOLATE(A, B, C, D);

		if ((A == C) && (A == F) && (B != E) && (B == J))
		{
			p2 = A;
		}
		else if ((B == E) && (B == D) && (A != F) && (A == I))
		{
			p2 = B;
		}
		else
		{
			p2 = INTERPOLATE(A, B);
		}

		if ((A == B) && (A == H) && (G != C) && (C == M))
		{
			p3 = A;
		}
		else if ((C == G) && (C == D) && (A != H) && (A == I))
		{
			p3 = C;
		}
		else
		{
			p3 = INTERPOLATE(A, C);
		}
	}

	out_pix[tx*64 + 0][ty*64 + 0] = p1;
	out_pix[tx*64 + 1][ty*64 + 0] = p2;
	out_pix[tx*64 + 0][ty*64 + 1] = p3;
	out_pix[tx*64 + 1][ty*64 + 1] = p4;
}


void process_tile(int tx, int ty)
{
	int x, y;

	// Copy tile pixels into a separate buffer which has a spare pixel
	// on all four sides.  Those spare pixels are set to the same as the
	// nearest in-tile pixel.  This is done to prevent neighboring tiles
	// from "bleeding" into each other.

	for (x = 0 ; x < 35 ; x++)
	for (y = 0 ; y < 35 ; y++)
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

	for (x = 0 ; x < 32 ; x++)
	for (y = 0 ; y < 32 ; y++)
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
