//
//  PLAYER HANDLING
//
//  by Andrew Apted, 2015
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


var all_players =
{
	barbarian:
	{
		kind: "Barbarian",
		health: 100,
		tile: "G3"
	}
};


// Player class : extends Entity

var Player = function(info)
{
	// The 'info' parameter must be looked up in all_players[].
	// For example: x = new Player(all_players.barbarian)

	this.info	= info;
	this.health = info.health;

	// TODO : inventory items
};


Player.prototype =
{
	sayHello: function()
	{
		render_AddText(this.info.kind + " says hello!\n");
	}
};



function player_NewGame()
{
	Players = [ null ];

	Players[1] = new Player(all_players.barbarian);

	// temp : spawn spot

	Players[1].tx = 5;
	Players[1].ty = 5;
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
