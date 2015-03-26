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

OBJS=	$(OBJ_DIR)/main.o      \
	$(OBJ_DIR)/m_debug.o   \
	$(OBJ_DIR)/m_cookie.o  \
	$(OBJ_DIR)/m_input.o   \
	$(OBJ_DIR)/m_lua.o     \
	$(OBJ_DIR)/r_render.o  \
	$(OBJ_DIR)/r_sprite.o  \
	\
	$(OBJ_DIR)/ui_console.o \
	$(OBJ_DIR)/ui_dialog.o \
	$(OBJ_DIR)/ui_hyper.o  \
	$(OBJ_DIR)/ui_map.o    \
	$(OBJ_DIR)/ui_panel.o  \
	$(OBJ_DIR)/ui_screen.o \
	$(OBJ_DIR)/ui_stats.o  \
	$(OBJ_DIR)/ui_text.o   \
	$(OBJ_DIR)/ui_window.o

$(OBJ_DIR)/%.o: src/%.cc
	$(CXX) $(CXXFLAGS) -o $@ -c $<


#----- LUA Objects --------------------------------------------------

DUK_OBJS=\
	$(OBJ_DIR)/lua/lapi.o     \
	$(OBJ_DIR)/lua/lcode.o    \
	$(OBJ_DIR)/lua/ldebug.o   \
	$(OBJ_DIR)/lua/ldo.o      \
	$(OBJ_DIR)/lua/ldump.o    \
	$(OBJ_DIR)/lua/lfunc.o    \
	$(OBJ_DIR)/lua/lgc.o      \
	$(OBJ_DIR)/lua/llex.o     \
	$(OBJ_DIR)/lua/lmem.o     \
	$(OBJ_DIR)/lua/lobject.o  \
	$(OBJ_DIR)/lua/lopcodes.o \
	$(OBJ_DIR)/lua/lparser.o  \
	$(OBJ_DIR)/lua/lstate.o   \
	$(OBJ_DIR)/lua/lstring.o  \
	$(OBJ_DIR)/lua/ltable.o   \
	$(OBJ_DIR)/lua/ltm.o      \
	$(OBJ_DIR)/lua/lundump.o  \
	$(OBJ_DIR)/lua/lvm.o      \
	$(OBJ_DIR)/lua/lzio.o     \
	\
	$(OBJ_DIR)/lua/lauxlib.o   \
	$(OBJ_DIR)/lua/lbaselib.o  \
	$(OBJ_DIR)/lua/ldblib.o    \
	$(OBJ_DIR)/lua/liolib.o    \
	$(OBJ_DIR)/lua/lmathlib.o  \
	$(OBJ_DIR)/lua/loslib.o    \
	$(OBJ_DIR)/lua/ltablib.o   \
	$(OBJ_DIR)/lua/lstrlib.o   \
	$(OBJ_DIR)/lua/loadlib.o   \
	$(OBJ_DIR)/lua/linit.o

LUA_CXXFLAGS=$(OPTIMISE) -Wall -DLUA_ANSI -DLUA_USE_MKSTEMP

$(OBJ_DIR)/lua/%.o: lua_src/%.cc
	$(CXX) $(LUA_CXXFLAGS) -o $@ -c $<


#----- Targets ----------------------------------------------------

all: dirs $(PROGRAM)

clean: dirs
	rm -f $(PROGRAM) ERRS
	rm -f $(OBJ_DIR)/*.o
	rm -f $(OBJ_DIR)/duk/*.o

dirs:
	-mkdir $(OBJ_DIR)
	-mkdir $(OBJ_DIR)/duk

halfclean:
	rm -f $(PROGRAM) $(OBJ_DIR)/*.o ERRS

$(PROGRAM): $(OBJS) $(APLIB_OBJS) $(LUA_OBJS)
	$(CXX) -Wl,--warn-common $^ -o $@ $(LDFLAGS) $(LIBS)

stripped: $(PROGRAM)
	strip --strip-unneeded $(PROGRAM)

.PHONY: all clean halfclean stripped install uninstall

#--- editor settings ------------
# vi:ts=8:sw=8:noexpandtab
