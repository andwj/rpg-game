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

CXX=g++

OBJ_DIR=obj_linux

OPTIMISE=-O0 -g3

# operating system choices: UNIX WIN32
OS=UNIX


#--- Internal stuff from here -----------------------------------

# assumes system-wide FLTK installation
FLTK_CONFIG=fltk-config
FLTK_FLAGS=$(shell $(FLTK_CONFIG) --cflags)
FLTK_LIBS=$(shell $(FLTK_CONFIG) --use-images --ldflags)

CXXFLAGS=$(OPTIMISE) -Wall -D$(OS) $(FLTK_FLAGS)
LDFLAGS=-L/usr/X11R6/lib
LIBS=-lm -lz $(FLTK_LIBS)


#----- Program Objects ----------------------------------------------

OBJS=	$(OBJ_DIR)/main.o    \
	$(OBJ_DIR)/input.o   \
	$(OBJ_DIR)/window.o

##!!!	$(OBJ_DIR)/duktape.o

$(OBJ_DIR)/%.o: src/%.cc
	$(CXX) $(CXXFLAGS) -o $@ -c $<


#----- Targets ----------------------------------------------------

all: $(PROGRAM)

clean:
	rm -f $(PROGRAM) ERRS
	rm -f $(OBJ_DIR)/*.o

dirs:
	-mkdir $(OBJ_DIR)

$(PROGRAM): $(OBJS) $(APLIB_OBJS) $(LUA_OBJS)
	$(CXX) -Wl,--warn-common $^ -o $@ $(LDFLAGS) $(LIBS)

stripped: $(PROGRAM)
	strip --strip-unneeded $(PROGRAM)

.PHONY: all clean dirs stripped install uninstall

#--- editor settings ------------
# vi:ts=8:sw=8:noexpandtab
