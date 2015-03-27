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

	Fl_Color cur_color;
	Fl_Font  cur_font;
	int      cur_font_size;

	int		 cur_clip_x, cur_clip_y;
	int		 cur_clip_w, cur_clip_h;

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
	/* canvas drawing primitives */

	void ResetState();

	void Color(Fl_Color color);
	void Font(int size, Fl_Font font);
	void Clip(int x = -1, int y = -1, int w = -1, int h = -1);

	void Rect(int x, int y, int w, int h);
	void FilledRect(int x, int y, int w, int h);

	void Line(int x, int y, int w, int h);

	void Text(const char *str, int x, int y);
	int  TextWidth(const char *str);
};


extern int screen_w;
extern int screen_h;

extern UI_Window * main_win;


#endif /* __UI_WINDOW_H__ */

//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
