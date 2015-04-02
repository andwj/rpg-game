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

#include "headers.h"


int StringCaseCmp(const char *A, const char *B)
{
	for ( ; *A || *B ; A++, B++)
	{
		// this test also catches end-of-string conditions
		if (toupper(*A) != toupper(*B))
			return (toupper(*A) - toupper(*B));
	}

	return 0;
}


char * StringNew(int length)
{
	// Note: length does not include the trailing NUL

	char *s = (char *) calloc(length + 1, 1);

	if (! s)
		Main_FatalError("Out of memory (%d bytes for string)\n", length);

	return s;
}


char * StringDup(const char *orig)
{
	char * s = StringNew((int)strlen(orig));

	strcpy(s, orig);

	return s;
}


void StringFree(const char *str)
{
	if (str)
	{
		free((void*) str);
	}
}

//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
