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

#include "headers.h"

#include "duktape.h"


void JS_Init(void)
{
	// TODO
}


void JS_LoadFile(const char *filename)
{
}


void JS_Load(void)
{
	// read a list of script files to load

	char line_buf[256];
	char *s;

	FILE *fp = fopen("js/all_files.txt", "r");

	if (! fp)
		Main_FatalError("Failed to open js/all_files.txt");

	while ((s = fgets(line_buf, sizeof(line_buf), fp)))
	{
		// skip whitespace
		while (isspace(*s))
			s++;

		// remove trailing newline character
		if (strchr(s, '/'))
			strchr(s, '/')[0] = 0;

		// ignore blank lines
		if (strlen(s) == 0)
			continue;

		JS_LoadFile(s);
	}
}

//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
