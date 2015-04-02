//----------------------------------------------------------------------
//  UTILITY FUNCTIONS
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

#ifndef __NATFOO_UTIL_H__
#define __NATFOO_UTIL_H__


#define SYS_ASSERT(x)	assert(x)

#define MSG_BUF_LEN		2048


/* string utilities */

int StringCaseCmp(const char *A, const char *B);

char * StringNew(int length);
char * StringDup(const char *orig);
void   StringFree(const char *str);

#endif /* __NATFOO_UTIL_H__ */

//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
