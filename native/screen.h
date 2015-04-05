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

#ifndef __UI_SCREEN_H__
#define __UI_SCREEN_H__


extern int screen_w, screen_h;


void Screen_Init(void);
void Screen_Shutdown(void);

void Screen_OpenWindow(void);
void Screen_Update(void);

/* canvas drawing functions */

void Screen_SetColor(int r, int g, int b, int a);
void Screen_SetFont (int size, int face);

void Screen_SetClip  (int x, int y, int w, int h);
void Screen_ResetClip(void);

void Screen_DrawRect(int x, int y, int w, int h, _Bool filled);
void Screen_DrawLine(int x1, int y1, int x2, int y2);
void Screen_DrawText(const char *str, int x, int y);

int  Screen_LoadImage(const char *image_name);
void Screen_GetImageSize(int id, int *w, int *h);

void Screen_DrawImage(int id, int x, int y, int w, int h);
void Screen_DrawImagePart(int id, int x, int y, int w, int h, int sx, int sy, int sw, int sh);


#endif /* __UI_SCREEN_H__ */

//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
