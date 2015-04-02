//----------------------------------------------------------------------
//  ALL INCLUDES
//----------------------------------------------------------------------
//
//  Copyright (C) 2015  Andrew Apted
//
//  This program is free software; you can redistribute it and/or
//  modify it under the terms of the GNU General Public License
//  as published by the Free Software Foundation; either version 3
//  of the License, or (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this software.  If not, please visit the following
//  web page: http://www.gnu.org/licenses/gpl.html
//
//----------------------------------------------------------------------

#ifndef __ALL_HEADERS_H__
#define __ALL_HEADERS_H__

/* OS specifics */
#ifdef WIN32
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#endif

/* C library (C99) */

#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <stdint.h>
#include <limits.h>
#include <assert.h>

#include <string.h>
#include <ctype.h>
#include <math.h>
#include <errno.h>
#include <time.h>

/* Allegro 5 */

#include <allegro5/allegro.h>
#include <allegro5/allegro_image.h>
#include <allegro5/allegro_native_dialog.h>
#include <allegro5/allegro_primitives.h>
#include <allegro5/allegro_font.h>
#include <allegro5/allegro_ttf.h>

/* AJ's utilities */

#include "aj_macros.h"
#include "aj_arg_lib.h"

#define SYS_ASSERT(x)   assert(x)

// FIXME : temp crud
#define StringDup(x)    strdup(x)
#define StringFree(x)   free(((void *)(x)))

/* Program stuff */

#include "main.h"
#include "js_api.h"
#include "screen.h"
#include "util.h"

#define MSG_BUF_LEN		2000

/* Note : duktape is NOT included here */

#endif /* __ALL_HEADERS_H__ */

//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
