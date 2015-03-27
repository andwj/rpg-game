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


UI_Window *main_win;

int screen_w;
int screen_h;


static void quit_Callback(Fl_Widget *w, void *data)
{
//!!!	want_quit = true;
}


UI_Window::UI_Window(int W, int H, const char *title) :
	Fl_Window(W, H, title),
	canvas(), canvas_ready(false)
{
	size_range(W, H, W, H);

	callback((Fl_Callback *) quit_Callback);

	box(FL_NO_BOX);

	resizable(NULL);

	end();
}


UI_Window::~UI_Window()
{ }


void UI_Window::CreateCanvas()
{
	canvas = fl_create_offscreen(w(), h());

	canvas_ready = true;

	// FIXME : fill canvas with something

	redraw();
}


int UI_Window::handle(int event)
{
	// treat mouse motion specially, as Fl_Group::handle always eats it
	if (event == FL_MOVE || event == FL_DRAG)
	{
		Input_RawMouse(event);
	}

	// try the normal handling...
	if (Fl_Window::handle(event))
		return 1;

	// otherwise we will process a keyboard or mouse event
	switch (event)
	{
		case FL_KEYDOWN:
		case FL_KEYUP:
		case FL_SHORTCUT:
			return Input_RawKey(event);

		case FL_PUSH:
		case FL_RELEASE:
			return Input_RawButton(event);

		case FL_MOUSEWHEEL:
			return Input_RawWheel(event);

		default:
			return 0;
	}
}


void UI_Window::draw()
{
	if (! canvas_ready)
		return;

	fl_copy_offscreen(0, 0, w(), h(), canvas, 0, 0);
}


void UI_Window::CanvasBegin()
{
	SYS_ASSERT(canvas_ready);

	fl_begin_offscreen(canvas);
}


void UI_Window::CanvasEnd()
{
	fl_end_offscreen();
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
