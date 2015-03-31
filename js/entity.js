//
//  ENTITY SYSTEM
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


function player_Init()
{
	Players = [ null, null, null, null ];

	Players[1] =
	{
		health: 250,

		sprite:
		{
			ref: "player",
			img_name: "mons/player1.png",
			origin_x: 0.5,
			origin_y: 1.0
		}
	};

	load_Image(Players[1].sprite.ref, Players[1].sprite.img_name);
}


function entity_Init()
{
///!!!  player_Init();

	return true;
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
