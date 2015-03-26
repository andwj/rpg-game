//----------------------------------------------------------------------
//  MAIN WINDOW
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


#if (FL_MAJOR_VERSION != 1 ||  \
	 FL_MINOR_VERSION != 3)
#error "Require FLTK version 1.3.0 or later"
#endif


#define WINDOW_W  690
#define WINDOW_H  475


UI_Window *main_win;

int screen_w;
int screen_h;


static void quit_Callback(Fl_Widget *w, void *data)
{
//!!!	want_quit = true;
}


UI_Window::UI_Window(const char *title) :
	Fl_Double_Window(WINDOW_W, WINDOW_H, title)
{
	size_range(WINDOW_W, WINDOW_H, WINDOW_W, WINDOW_H);

	callback((Fl_Callback *) quit_Callback);

	box(FL_NO_BOX);

	resizable(NULL);

	end();
}


UI_Window::~UI_Window()
{ }


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
