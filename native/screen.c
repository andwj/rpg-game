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

static ALLEGRO_MOUSE_STATE     mouse_state;
static ALLEGRO_KEYBOARD_STATE  kbd_state;


void Screen_Init(void)
{
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


void Screen_OpenWindow(int w, int h)
{
	display = al_create_display(w, h);

	if (! display)
		Main_FatalError("Failed to create window\n");

	canvas = al_create_bitmap(w, h);

	if (! canvas)
		Main_FatalError("Failed to create canvas bitmap\n");

	// the canvas bitmap is always the current target EXCEPT when copying to the back-buffer

	al_set_target_bitmap(canvas);

	al_clear_to_color(al_map_rgb(0,64,0));
}


void Screen_HandleInput(void)
{
	al_get_mouse_state(&mouse_state);
	al_get_keyboard_state(&kbd_state);

	if (al_key_down(&kbd_state, ALLEGRO_KEY_ESCAPE))
		want_quit = true;
}


void Screen_Update(void)
{
// TEST
static int r = 0; r++;
al_clear_to_color(al_map_rgb(r & 0xff, 0x80, 0));

	Screen_HandleInput();

	// copy the canvas bitmap to the back-buffer
	al_set_target_backbuffer(display);
	al_draw_bitmap(canvas, 0, 0, 0 /* flags */);

	al_flip_display();

	al_set_target_bitmap(canvas);

	al_rest(0.005);
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
