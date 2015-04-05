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


static const char * CSS1_color_names[] =
{
	"black",	"#000000",
	"blue",		"#0000ff",
	"red",		"#ff0000",
	"fuchsia",	"#ff00ff",
	"lime",		"#00ff00",
	"aqua",		"#00ffff",
	"yellow",	"#ffff00",
	"white",	"#ffffff",

	"gray",		"#808080",
	"grey",		"#808080",
	"silver",	"#c0c0c0",
	"maroon",	"#800000",
	"purple",	"#800080",
	"green",	"#008000",
	"olive",	"#808000",
	"navy",		"#000080",
	"teal",		"#008080",
	"orange",	"#ffa500",

	// end of list
	NULL, NULL
};


static duk_ret_t Native_set_font(duk_context *ctx)
{
	int size = duk_require_int(ctx, 0);
	int face = duk_require_int(ctx, 1);

	Screen_SetFont(size, face);

	return 0;
}


static duk_ret_t Native_set_color(duk_context *ctx)
{
	const char * str = duk_require_string(ctx, 0);

	// find a keyword color (only supports CSS1 names + orange)
	if (str[0] != '#')
	{
		for (int i = 0 ; CSS1_color_names[i] ; i += 2)
		{
			if (StringCaseCmp(CSS1_color_names[i], str) == 0)
			{
				str = CSS1_color_names[i + 1];
				break;
			}
		}
	}

	// unknown color name? --> IGNORE
	if (str[0] != '#')
		return 0;

	// parse RGB color
	int r, g, b;

	str++;

	if (strlen(str) < 3)
		return 0;
	
	if (strlen(str) < 6)
	{
		sscanf(str, "%1x%1x%1x", &r, &g, &b);

		r = r * 17;
		g = g * 17;
		b = b * 17;
	}
	else
	{
		sscanf(str, "%2x%2x%2x", &r, &g, &b);
	}

	Screen_SetColor(r, g, b, 255);

	return 0;
}


static duk_ret_t Native_fill_rect(duk_context *ctx)
{
	int x = duk_require_int(ctx, 0);
	int y = duk_require_int(ctx, 1);
	int w = duk_require_int(ctx, 2);
	int h = duk_require_int(ctx, 3);

	Screen_DrawRect(x, y, w, h, true /* filled */);

	return 0;
}


static duk_ret_t Native_stroke_rect(duk_context *ctx)
{
	int x = duk_require_int(ctx, 0);
	int y = duk_require_int(ctx, 1);
	int w = duk_require_int(ctx, 2);
	int h = duk_require_int(ctx, 3);

	Screen_DrawRect(x, y, w, h, false /* filled */);

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


static void JS_RegisterFunc(const char *func_name, duk_c_function FUNC, duk_idx_t num_args)
{
	duk_push_global_object(js_ctx);

	// assume this works (already tested when setting 'active')
	duk_get_prop_string(js_ctx, -1 /*index*/, "Native");

	duk_push_c_function(js_ctx, FUNC, num_args);

	if (! duk_put_prop_string(js_ctx, -2, func_name))
		Main_FatalError("Failed to register Native function.\n");

	duk_set_top(js_ctx, 0);
}


static void JS_SetupNativeObject(void)
{
	// set Native.active to true

	duk_push_global_object(js_ctx);

	if (! duk_get_prop_string(js_ctx, -1, "Native"))
		Main_FatalError("Failed to find Native object.\n");

	duk_push_boolean(js_ctx, 1);

	if (! duk_put_prop_string(js_ctx, -2, "active"))
		Main_FatalError("Failed to setup Native object.\n");

	duk_set_top(js_ctx, 0);

	// set Native.screen_w and Native.screen_h

	duk_push_global_object(js_ctx);
	duk_get_prop_string(js_ctx, -1, "Native");
	duk_push_number(js_ctx, screen_w);
	duk_put_prop_string(js_ctx, -2, "screen_w");

	duk_push_global_object(js_ctx);
	duk_get_prop_string(js_ctx, -1, "Native");
	duk_push_number(js_ctx, screen_h);
	duk_put_prop_string(js_ctx, -2, "screen_h");

	duk_set_top(js_ctx, 0);

	// add callback API

	JS_RegisterFunc("setFont",  &Native_set_font, 2);
	JS_RegisterFunc("setColor", &Native_set_color, 1);

	JS_RegisterFunc("fillRect",   &Native_fill_rect, 4);
	JS_RegisterFunc("strokeRect", &Native_stroke_rect, 4);
}


void JS_LoadFile(const char *filename)
{
	LogPrintf("Loading JS file: %s\n", filename);

	if (duk_peval_file(js_ctx, filename) != 0)
	{
		Main_FatalError("Failed to load javascript file: %s\n\n%s\n",
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


static int get_stack_raw(duk_context *ctx)
{
	if (! duk_is_object(ctx, -1))
		return 1;

	if (! duk_has_prop_string(ctx, -1, "stack"))
		return 1;

	if (! duk_is_error(ctx, -1))
		return 1;

	duk_get_prop_string(ctx, -1, "stack");  /* caller coerces */
	duk_remove(ctx, -2);

	return 1;
}


/* Print error objects with a stack trace specially.
 * Note that getting the stack trace may throw an error
 * so this also needs to be safe call wrapped.
 */
void JS_ShowStacktrace()
{
	duk_safe_call(js_ctx, get_stack_raw, 1 /*nargs*/, 1 /*nrets*/);

	fprintf(stderr, "%s\n", duk_safe_to_string(js_ctx, -1));

	duk_pop(js_ctx);
}


void JS_BeginScript(void)
{
	// flesh out the 'Native' object

	JS_SetupNativeObject();

	// call the 'init()' function

	duk_push_global_object(js_ctx);

	if (! duk_get_prop_string(js_ctx, -1, "init"))
		Main_FatalError("Failed to find init() function.\n");

	if (duk_pcall(js_ctx, 0) != DUK_EXEC_SUCCESS)
	{
		JS_ShowStacktrace();

		Main_FatalError("JS: init() failed.\n");
	}

	duk_set_top(js_ctx, 0);
}

//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
