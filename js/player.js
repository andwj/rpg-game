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
		species: "Barbarian",
		health: 125,
		tile: "G3"
	},

	knight:
	{
		species: "Knight",
		health: 100,
		tile: "G6"
	}
};


// Player class : extends Entity

var Player = function(info)
{
	// The 'info' parameter must be looked up in all_players[].
	// For example: x = new Player(all_players.barbarian)

	this.kind     = "player";
	this.is_actor = true;

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


//________________________________________________


function player_NewGame()
{
	Players = [ null ];

	Players[1] = new Player(all_players.barbarian);

	// FIXME : spawn spot
	var tx = 10;
	var ty = 5;

	world_AddEntity(Players[1], tx, ty);
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
