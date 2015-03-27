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

	ResetState();

	// fill canvas with something
	FillRect(0, 0, w(), h());

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


void UI_Window::ResetState()
{
	cur_color = fl_rgb_color(128,128,128);

	cur_font = FL_HELVETICA;
	cur_size = 12;

	cur_clip_x = cur_clip_y = -1;
	cur_clip_w = cur_clip_h = -1;
}


void UI_Window::Color(Fl_Color color)
{
	cur_color = color;
}


void UI_Window::Font(int size, Fl_Font font)
{
	cur_font = font;
	cur_size = size;
}


void UI_Window::Clip(int x, int y, int w, int h)
{
	cur_clip_x = x;
	cur_clip_y = y;
	cur_clip_w = w;
	cur_clip_h = h;
}


void UI_Window::Rect(int x, int y, int w, int h)
{
	if (! canvas_ready)
		return;

	fl_begin_offscreen(canvas);

	if (cur_clip_w > 0 && cur_clip_h > 0)
		fl_push_clip(cur_clip_x, cur_clip_y, cur_clip_w, cur_clip_h);

	fl_color(cur_color);
	fl_rect(x, y, w, h);

	if (cur_clip_w > 0 && cur_clip_h > 0)
		fl_pop_clip();

	fl_end_offscreen();
}


void UI_Window::FillRect(int x, int y, int w, int h)
{
	if (! canvas_ready)
		return;

	fl_begin_offscreen(canvas);

	if (cur_clip_w > 0 && cur_clip_h > 0)
		fl_push_clip(cur_clip_x, cur_clip_y, cur_clip_w, cur_clip_h);

	fl_color(cur_color);
	fl_rectf(x, y, w, h);

	if (cur_clip_w > 0 && cur_clip_h > 0)
		fl_pop_clip();

	fl_end_offscreen();
}


void UI_Window::Line(int x1, int y1, int x2, int y2)
{
	if (! canvas_ready)
		return;

	fl_begin_offscreen(canvas);

	if (cur_clip_w > 0 && cur_clip_h > 0)
		fl_push_clip(cur_clip_x, cur_clip_y, cur_clip_w, cur_clip_h);

	fl_color(cur_color);
	fl_line(x1, y1, x2, y2);

	if (cur_clip_w > 0 && cur_clip_h > 0)
		fl_pop_clip();

	fl_end_offscreen();
}


void UI_Window::Text(const char *str, int x, int y)
{
	if (! canvas_ready)
		return;

	fl_begin_offscreen(canvas);

	if (cur_clip_w > 0 && cur_clip_h > 0)
		fl_push_clip(cur_clip_x, cur_clip_y, cur_clip_w, cur_clip_h);

	fl_color(cur_color);
	fl_font(cur_font, cur_size);

	fl_draw(str, x, y);

	if (cur_clip_w > 0 && cur_clip_h > 0)
		fl_pop_clip();

	fl_end_offscreen();
}


int UI_Window::TextWidth(const char *str)
{
	fl_font(cur_font, cur_size);

	return fl_width(str);
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
