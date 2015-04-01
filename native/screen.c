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

	al_install_mouse();
	al_install_keyboard();
}


void Screen_Shutdown(void)
{
}


void Screen_OpenWindow(int w, int h)
{
	display = al_create_display(640, 480);

	if (! display)
	{
		Main_FatalError("Failed to create window\n");
	}
}


void Screen_Render(void)
{
	static int r = 0; r++;

	al_clear_to_color(al_map_rgb(r & 0xff, 0x80, 0));

	al_flip_display();
}


void Screen_HandleInput(void)
{
	al_get_mouse_state(&mouse_state);
	al_get_keyboard_state(&kbd_state);

	if (al_key_down(&kbd_state, ALLEGRO_KEY_ESCAPE))
		want_quit = true;
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
