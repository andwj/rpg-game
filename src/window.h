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

#ifndef __UI_WINDOW_H__
#define __UI_WINDOW_H__


class UI_Window : public Fl_Window
{
private:
	Fl_Offscreen canvas;

	bool canvas_ready;

public:
	UI_Window(int W, int H, const char *title);
	virtual ~UI_Window();

public:
	void CreateCanvas();

	// FLTK event handling method
	int handle(int event);

	// FLTK draw method
	void draw();

public:
	// allow drawing into the canvas
	void CanvasBegin();
	void CanvasEnd();
};


extern int screen_w;
extern int screen_h;

extern UI_Window * main_win;


#endif /* __UI_WINDOW_H__ */

//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
