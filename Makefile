#
# GNU Makefile for Unices with system-wide install
#
# Using this makefile (make, make install) will place the
# executable, script and data files in standard Unixy places.
#
# NOTE: a system-wide FLTK library is assumed.
#
# LICENSE: this makefile is under the zlib license.
#

PROGRAM=rpg-game

# prefix choices: /usr  /usr/local  /opt
PREFIX=/usr/local

DATA_DIR=$(PREFIX)/share/rpg-game

CC=gcc

OBJ_DIR=obj_linux

OPTIMISE=-O0 -g3

# operating system choices: UNIX WIN32
OS=UNIX


#--- Internal stuff from here -----------------------------------

AL_FLAGS=
AL_LDFLAGS=
AL_LIBS=\
	-lallegro  \
	-lallegro_main  \
	-lallegro_color  \
	-lallegro_font  \
	-lallegro_memfile  \
	-lallegro_dialog  \
	-lallegro_primitives  \
	-lallegro_image  \
	-lallegro_ttf  \


CFLAGS=$(OPTIMISE) -Wall -Wno-unused-variable -D$(OS) $(AL_FLAGS)
LDFLAGS=$(AL_LDFLAGS)
LIBS=-lm -lz $(AL_LIBS)


#----- Program Objects ----------------------------------------------

OBJS=	$(OBJ_DIR)/main2.o

##	$(OBJ_DIR)/input.o   +
##	$(OBJ_DIR)/window.o

##!!!	$(OBJ_DIR)/duktape.o

$(OBJ_DIR)/%.o: src/%.c
	$(CC) $(CCFLAGS) -o $@ -c $<


#----- Targets ----------------------------------------------------

all: $(PROGRAM)

clean:
	rm -f $(PROGRAM) ERRS
	rm -f $(OBJ_DIR)/*.o

dirs:
	-mkdir $(OBJ_DIR)

$(PROGRAM): $(OBJS)
	$(CC) -Wl,--warn-common $^ -o $@ $(LDFLAGS) $(LIBS)

stripped: $(PROGRAM)
	strip --strip-unneeded $(PROGRAM)

.PHONY: all clean dirs stripped
.PHONY: install uninstall

#--- editor settings ------------
# vi:ts=8:sw=8:noexpandtab
