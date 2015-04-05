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


static duk_context * js_ctx;


static duk_ret_t Native_set_font(duk_context *ctx)
{
	int size = duk_require_int(ctx, 0);
	int face = duk_require_int(ctx, 1);

	Screen_SetFont(size, face);

	return 0;
}


//----------------------------------------------------------------------


void JS_Init(void)
{
	LogPrintf("JS_Init....\n");

	js_ctx = duk_create_heap_default();

	if (! js_ctx)
		Main_FatalError("Failed to create JS context.\n");
}


void JS_Close(void)
{
	// TODO
	// duk_destroy_heap(js_ctx);
}


static void JS_RegisterFunc(const char *func_name, int FUNC)
{
	// TODO
}


static void JS_SetupNativeObject(void)
{
	// set Native.active to true

	duk_push_global_object(js_ctx);

	if (! duk_get_prop_string(js_ctx, -1 /*index*/, "Native"))
		Main_FatalError("Failed to setup Native object.\n");

	duk_push_boolean(js_ctx, 1);

	if (! duk_put_prop_string(js_ctx, -2, "active"))
		Main_FatalError("Failed to setup Native object.\n");

	// add callback API

	// FIXME  JS_RegisterFunc("set_font", &Native_set_font);
}


void JS_LoadFile(const char *filename)
{
	LogPrintf("Loading JS file: %s\n", filename);

	if (duk_peval_file(js_ctx, filename) != 0)
	{
		Main_FatalError("Failed to load javascript file: %s\n%s\n",
			filename, duk_safe_to_string(js_ctx, -1));
	}

	// ignore any result
	duk_pop(js_ctx);
}


void JS_Load(void)
{
	// read a list of script files to load

	char line_buf[256];
	char *s;

	FILE *fp = fopen("js/all_files.txt", "r");

	if (! fp)
		Main_FatalError("Failed to open js/all_files.txt\n");

	while ((s = fgets(line_buf, sizeof(line_buf), fp)))
	{
		// skip whitespace
		while (isspace(*s))
			s++;

		// remove trailing newline character
		if (strchr(s, '\n'))
			strchr(s, '\n')[0] = 0;

		// ignore blank lines
		if (strlen(s) == 0)
			continue;

		JS_LoadFile(s);
	}

	LogPrintf("Finished loading scripts.\n\n");
}


void JS_BeginScript(void)
{
	// flesh out the 'Native' object

	JS_SetupNativeObject();

	// call the 'init()' function

	// FIXME
}

//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
