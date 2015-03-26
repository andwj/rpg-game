//----------------------------------------------------------------------
//  KEY / MOUSE INPUT HANDLING
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

#include "main.h"
#include "m_input.h"
#include "m_lua.h"

#include "r_sprite.h"


#define WHEEL_ZOOM_FACTOR  1.26
#define   KEY_ZOOM_FACTOR  1.26


extern void R_CheckSprite_Highlight();


int Input_RawKey(int event)
{
	// only handle real keypresses here
	if (event == FL_SHORTCUT)
		return 0;


	int key = Fl::event_key();

	//
	// handle keys which can be held down
	//

	if (event == FL_KEYUP)
	{
		main_win->Action_Clear();
		return 1;
	}

	if (key == ' ')
	{
		main_win->Action_Set(ACT_ScrollMap);
		return 1;
	}

	if (key == '/')
	{
		main_win->Action_Set(ACT_ZoomMap);
		return 1;
	}

	//
	// handle all other keys
	//

#if 0  // DEBUG
	fprintf(stderr, "Input_RawKey : %d\n", key);
#endif

	switch (key)
	{
		case FL_Home:
			main_win->map->GoHome();
			return 1;

		case FL_Insert:
		{
			int tx = main_win->map->TILE_X(Fl::event_x());
			int ty = main_win->map->TILE_Y(Fl::event_y());

			main_win->map->ZoomIn(tx, ty);
			return 1;
		}

		case FL_End:
			main_win->map->ZoomOut();
			return 1;
		
		case '-': case '_':
			main_win->map->Zoom(1.0 / KEY_ZOOM_FACTOR);
			return 1;

		case '+': case '=':
			main_win->map->Zoom(KEY_ZOOM_FACTOR);
			return 1;

		case FL_Escape:
		case FL_BackSpace:
			amb_user_action("key", "back");
			return 1;

		// function keys:
		//    F1 = HELP
		//    F3 = OPTIONS
		//    F5 = CONSOLE

		case FL_F+1:
			amb_user_action("key", "help");
			return 1;

		case FL_F+3:
			amb_user_action("key", "options");
			return 1;

		case FL_F+5:
#if 0  // DISABLED FOR NOW
			main_win->ShowConsole(2 /* toggle */);
#endif
			return 1;

		// arrow keys
		//   TODO 1 : option for how fast
		//   TODO 2 : SHIFT key for slower, CTRL for faster

		case FL_Left:
			main_win->map->Scroll(-0.2, 0);
			return 1;

		case FL_Right:
			main_win->map->Scroll(+0.2, 0);
			return 1;

		case FL_Down:
			main_win->map->Scroll(0, +0.2);
			return 1;

		case FL_Up:
			main_win->map->Scroll(0, -0.2);
			return 1;

		// page up / down : scroll the text area

		case FL_Page_Up:
			main_win->text_box->Scroll(1.5);
			return 1;

		case FL_Page_Down:
			main_win->text_box->Scroll(-1.5);
			return 1;
	}

	return 0;
}


int Input_RawButton(int event)
{
	int button = Fl::event_button();

	if (button == 3)   /* FIXME: option */
	{
		if (event == FL_RELEASE)
			main_win->Action_Clear();
		else
			main_win->Action_Set(ACT_ScrollMap);

		return 1;
	}

	if (button == 1)
	{
		if (event == FL_RELEASE && main_win->action == ACT_DragObject)
		{
			main_win->Action_DropObject();
			return 1;
		}

		bool have_draggable = (main_win->action == ACT_Highlight) &&
		                       main_win->act_sprite->isDraggable();

		if (event == FL_RELEASE || ! have_draggable)
			main_win->Action_Clear();
		else
			main_win->Action_Set(ACT_DragObject, main_win->act_sprite);

		return 1;
	}

	// TODO

if (event == FL_PUSH)
	fprintf(stderr, "Input_RawButton : %d\n", Fl::event_button());

	return 1;
}


int Input_RawWheel(int event)
{
	int delta = Fl::event_dy();

	if (delta != 0)
	{
		double factor = WHEEL_ZOOM_FACTOR;

		if (delta > 0)
			factor = 1.0 / factor;

		main_win->map->Zoom(factor, Fl::event_x(), Fl::event_y());
	}

	return 1;
}


// FIXME : RENAME
static void R_CheckSprite_Highlight(int mx, int my)
{

// FIXME: TEST CRUD
/*
drag_x = mouse_x;
drag_y = mouse_y;
if (dragging_sprite) main_win->redraw();
*/

	UI_Map * map = main_win->map;

	if (mx < map->x() || mx >= map->x() + map->w() ||
		my < map->y() || my >= map->y() + map->h())
	{
		// pointer outside of map window
		main_win->Action_Clear();
		return;
	}

	RE_Sprite *sp = R_FindSpriteUnderCursor(mx, my);

	if (! sp)
	{
		main_win->Action_Clear();
		return;
	}

	main_win->Action_Set(ACT_Highlight, sp);
}


static void R_CheckSprite_Drag(int mx, int my)
{
	// check for slot in the Stats panel
	int where = main_win->panel->stat_box->MouseOverSlot(mx, my);

	// TODO : where |= CheckOtherDropPlaces()

	// limit to places where object is allowed to go
	where &= main_win->act_sprite->drag_to;

	main_win->act_target = where;
	main_win->redraw();
}


int Input_RawMouse(int event)
{
	int mouse_x = Fl::event_x();
	int mouse_y = Fl::event_y();

	int delta_x = mouse_x - main_win->act_mouse_x;
	int delta_y = mouse_y - main_win->act_mouse_y;

	bool update_act_mouse = false;


	switch (main_win->action)
	{
		case ACT_NONE:
		case ACT_Highlight:
			R_CheckSprite_Highlight(mouse_x, mouse_y);
			break;

		case ACT_DragObject:
			R_CheckSprite_Drag(mouse_x, mouse_y);
			update_act_mouse = true;
			break;

		case ACT_ScrollMap:
			// TODO: slower when SHIFT is pressed, faster when CTRL is pressed
			main_win->map->Drag(delta_x, delta_y);
			update_act_mouse = true;
			break;

		case ACT_ZoomMap:
			// TODO: slower when SHIFT is pressed, faster when CTRL is pressed
			main_win->map->ZoomWithMouse(delta_y, main_win->act_pos,
				main_win->act_mouse_x, main_win->act_mouse_y);
			break;

		default:
			break;
	}

	if (update_act_mouse)
	{
		main_win->act_mouse_x = mouse_x;
		main_win->act_mouse_y = mouse_y;
	}

	// we never eat mouse motion events
	return 0;
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
