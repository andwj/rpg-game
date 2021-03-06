//----------------------------------------------------------------------
//  JAVASCRIPT INTERFACE (to Duktape)
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

#ifndef __JSFOO_API_H__
#define __JSFOO_API_H__


void JS_Init(void);
void JS_Close(void);

void JS_Load(void);

void JS_BeginScript(void);

bool JS_CheckGameActive(void);

void JS_IntervalCallback(void);

void JS_KeyboardEvent(int code, const char *key, bool repeat,
					  bool is_shift, bool is_ctrl, bool is_alt, bool is_meta);


#endif /* __JSFOO_API_H__ */

//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
