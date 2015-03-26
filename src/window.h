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


class UI_Window : public Fl_Double_Window
{
public:

public:
	UI_Window(const char *title);
	virtual ~UI_Window();
};


extern int screen_w;
extern int screen_h;

extern UI_Window * main_win;


#define isSpecialEdition  (main_win->g_game_sel->value() == 1)


#endif /* __UI_WINDOW_H__ */

//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
