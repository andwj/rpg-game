#
# Makefile to recreate the 2x tileset.
#
# Requires GCC to compile upscale.c + NetPBM to do conversions
#

CC=gcc

all: tileset_2x.png

clean:
	rm -f temp_*.ppm

tileset_2x.png: tileset.png upscale.exe
	pngtopnm -mix -background "#313233" tileset.png	> temp_small.ppm
	./upscale.exe < temp_small.ppm > temp_big.ppm
	pnmtopng -transparent "#010101" temp_big.ppm > tileset_2x.png
	rm -f temp_*.ppm

upscale.exe:
	$(CC) -Wall ../tools/upscale.c -o $@

.PHONY: all clean

#--- editor settings ------------
# vi:ts=8:sw=8:noexpandtab
