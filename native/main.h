//----------------------------------------------------------------------
//  MAIN DEFINITIONS
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

#ifndef __MAIN_DEFS_H__
#define __MAIN_DEFS_H__


#define PROG_TITLE  "Rpg-Game"

#define PROG_VERSION  "0.11"
#define PROG_HEX_VER  0x011


extern const char *install_dir;

extern bool want_quit;


void Main_FatalError(const char *msg, ...);


#endif /* __MAIN_DEFS_H__ */

//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
