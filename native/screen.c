//----------------------------------------------------------------------
//  SCREEN STUFF (via Allegro)
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


static ALLEGRO_DISPLAY * display;

static ALLEGRO_BITMAP * canvas;

static ALLEGRO_EVENT_QUEUE * queue;

static ALLEGRO_MOUSE_STATE     mouse_state;
static ALLEGRO_KEYBOARD_STATE  kbd_state;


static int display_flags = ALLEGRO_WINDOWED;

static int display_width  = 640;
static int display_height = 480;

// these are determined after opening the display
int screen_w;
int screen_h;


typedef struct
{
	ALLEGRO_COLOR color;

	ALLEGRO_FONT * font;

} drawing_context_t;

static drawing_context_t ctx;


void Screen_Init(void)
{
	LogPrintf("Screen_Init....\n");

	if (! al_init())
	{
		Main_FatalError("Failed to init Allegro.\n");
	}

	al_init_native_dialog_addon();
	al_init_primitives_addon();
	al_init_image_addon();
	al_init_font_addon();
	al_init_ttf_addon();

	al_install_mouse();
	al_install_keyboard();

	// reset the drawing context
	memset(&ctx, 0, sizeof(ctx));

	// check some arguments

	if (aj_arg_Exists('f', "fullscreen"))
		display_flags = ALLEGRO_FULLSCREEN_WINDOW;

	int index;
	int parms;

	index = aj_arg_Find('g', "geom", &parms);

	if (index >= 0)
	{
		if (parms < 1)
			Main_FatalError("Missing size (like 800x600) for -geom option.\n");

		const char * geom = aj_arg_Param(index, 0);

		if (sscanf(geom, "%dx%d", &display_width, &display_height) != 2)
			Main_FatalError("Invalid size (like 800x600) for -geom option.\n");

		if (display_width < 100 || display_height < 100)
			Main_FatalError("Invalid -geom size (too small).\n");
	}
}


void Screen_Shutdown(void)
{
	if (display)
		al_set_target_backbuffer(display);

	if (canvas)
	{
	   al_destroy_bitmap(canvas);
	   canvas = NULL;
	}

	if (display)
	{
		al_destroy_display(display);
		display = NULL;
	}
}


void Screen_OpenWindow(void)
{
	LogPrintf("Screen: opening window %dx%d (flags %d)\n",
				display_width, display_height, display_flags);

	al_set_new_display_flags(display_flags);

	display = al_create_display(display_width, display_height);

	if (! display)
		Main_FatalError("Failed to create window\n");

	screen_w = al_get_display_width (display);
	screen_h = al_get_display_height(display);

	LogPrintf("Screen: actual window is %dx%d\n", screen_w, screen_h);


	canvas = al_create_bitmap(screen_w, screen_h);

	if (! canvas)
		Main_FatalError("Failed to create canvas bitmap\n");

	// the canvas bitmap is always the current target EXCEPT when copying to the back-buffer

	al_set_target_bitmap(canvas);

	al_clear_to_color(al_map_rgb(0,64,0));


	// input handling

	queue = al_create_event_queue();

	if (! queue)
		Main_FatalError("Failed to create event queue\n");
	
	if (al_get_keyboard_event_source())
		al_register_event_source(queue, al_get_keyboard_event_source());

	if (al_get_mouse_event_source())
		al_register_event_source(queue, al_get_mouse_event_source());
}


void Screen_ProcessEvents(void);


void Screen_Update(void)
{
	Screen_ResetClip();
	Screen_ProcessEvents();

	// copy the canvas bitmap to the back-buffer
	al_set_target_backbuffer(display);
	al_draw_bitmap(canvas, 0, 0, 0 /* flags */);

	al_flip_display();

	// go back to drawing on the canvas again
	al_set_target_bitmap(canvas);

	al_rest(0.005);
}


//----------------------------------------------------------------------
//    DRAWING ONTO CANVAS
//----------------------------------------------------------------------

// font caching stuff
typedef struct
{
	int size;

	// only support two faces (0 = sans, 1 = mono)
	int face;

	ALLEGRO_FONT *font;

} cached_font_t;

#define MAX_CACHED_FONTS	64
static cached_font_t cached_fonts[MAX_CACHED_FONTS];

static int num_cached_fonts;


static ALLEGRO_FONT * LookupFont(int size, int face)
{
	for (int i = 0 ; i < num_cached_fonts ; i++)
	{
		cached_font_t * CF = &cached_fonts[i];

		if (CF->size == size && CF->face == face)
			return CF->font;
	}

	// not cached, load it now

	if (num_cached_fonts >= MAX_CACHED_FONTS)
		Main_FatalError("Too many fonts used.\n");

	cached_font_t * CF = &cached_fonts[num_cached_fonts];
	num_cached_fonts += 1;

	const char *font_file;

	if (face == 0)
		font_file = "font/DejaVuLGCSans.ttf";
	else
		font_file = "font/DejaVuLGCSansMono.ttf";

	CF->size = size;
	CF->face = face;

	CF->font = al_load_font(font_file, size, 0 /* flags */);

	if (! CF->font)
		Main_FatalError("Failed to load font: %s\n", font_file);

	return CF->font;
}


void Screen_SetFont(int size, int face)
{
	ctx.font = LookupFont(size, face);
}


void Screen_SetColor(int r, int g, int b, int a)
{
	ctx.color = al_map_rgba(r, g, b, a);
}


void Screen_SetClip(int x, int y, int w, int h)
{
	al_set_clipping_rectangle(x, y, w, h);
}


void Screen_ResetClip(void)
{
	al_reset_clipping_rectangle();
}


void Screen_DrawRect(int x, int y, int w, int h, _Bool filled)
{
	if (filled)
	{
		al_draw_filled_rectangle(x, y, x+w, y+h, ctx.color);
	}
	else
	{
		al_draw_rectangle(x, y, x+w, y+h, ctx.color, 1.0 /* thickness */);
	}
}


void Screen_DrawLine(int x1, int y1, int x2, int y2)
{
	al_draw_rectangle(x1, y1, x2, y2, ctx.color, 1.0 /* thickness */);
}


void Screen_DrawText(const char *str, int x, int y)
{
	// silently ignore when no font has been set yet
	if (! ctx.font)
		return;

	al_hold_bitmap_drawing(true);

	al_draw_text(ctx.font, ctx.color, x, y, 0 /* flags */, str);

	al_hold_bitmap_drawing(false);
}


//
//  Image caching
//

typedef struct
{
	ALLEGRO_BITMAP * bitmap;

} cached_image_t;

#define MAX_CACHED_IMAGES	256
static cached_image_t cached_images[MAX_CACHED_IMAGES];

static int num_cached_images;


int  Screen_LoadImage(const char *image_name)
{
	if (num_cached_images >= MAX_CACHED_IMAGES)
		Main_FatalError("Too many images used.\n");
	
	int id = num_cached_images;
	num_cached_images += 1;

	cached_image_t * CI = &cached_images[id];

	CI->bitmap = al_load_bitmap(image_name);

	if (! CI->bitmap)
		Main_FatalError("Failed to load image: %s\n", image_name);

	return id;
}


void Screen_DrawImagePart(int id, int x, int y, int w, int h, int sx, int sy, int sw, int sh)
{
	const cached_image_t * CI;

	if (id < 0 || id >= num_cached_images)
		Main_FatalError("Screen_DrawImage: bad id number\n");

	CI = &cached_images[id];

	if (! CI->bitmap)
		Main_FatalError("Screen_DrawImage: bad id number\n");

	// negative source width/height means use the whole image
	if (sw < 0) sw = al_get_bitmap_width (CI->bitmap);
	if (sh < 0) sh = al_get_bitmap_height(CI->bitmap);

	al_draw_scaled_bitmap(CI->bitmap, sx, sy, sw, sh, x, y, w, h, 0 /* flags */);
}


void Screen_DrawImage(int id, int x, int y, int w, int h)
{
	Screen_DrawImagePart(id, x, y, w, h, 0, 0, -1, -1);
}


//----------------------------------------------------------------------
//    INPUT HANDLING
//----------------------------------------------------------------------

static void Event_KeyDown(ALLEGRO_EVENT *ev)
{
	// TODO
}

static void Event_KeyUp(ALLEGRO_EVENT *ev)
{
	// TODO
}


static void Event_MouseDown(ALLEGRO_EVENT *ev)
{
	// TODO
}

static void Event_MouseUp(ALLEGRO_EVENT *ev)
{
	// TODO
}


void Screen_ProcessEvents(void)
{
	ALLEGRO_EVENT ev;

	al_get_mouse_state(&mouse_state);
	al_get_keyboard_state(&kbd_state);

	// TODO : use event system
	if (al_key_down(&kbd_state, ALLEGRO_KEY_ESCAPE))
		want_quit = true;

	while (al_get_next_event(queue, &ev))
	{
		switch (ev.type)
		{
			case ALLEGRO_EVENT_KEY_DOWN:
				Event_KeyDown(&ev);
				break;

			case ALLEGRO_EVENT_KEY_UP:
				Event_KeyUp(&ev);
				break;

			case ALLEGRO_EVENT_MOUSE_BUTTON_DOWN:
				Event_MouseDown(&ev);

			case ALLEGRO_EVENT_MOUSE_BUTTON_UP:
				Event_MouseUp(&ev);

			default:
				break;
		}
	}
}

//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
