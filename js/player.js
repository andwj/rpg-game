//
//  PLAYER HANDLING
//
//  by Andrew Apted, 2015
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


function player_NewGame()
{
	Players = [ null ];

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
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
