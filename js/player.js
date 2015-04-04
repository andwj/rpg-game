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
		render_AddLine(this.info.species + " says hello!");
	},

	getTile: function()
	{
		return World.tiles[this.tx][this.ty];
	},

	moveStep: function(dir)
	{
		var T = this.getTile();

		if (! T.canMove(dir, this))
			return false;

		world_MoveEntity2(this, T.neighbor(dir));

		// FIXME!!!
		render_RefreshAll();
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


function player_HandleKey(ev)
{
	var pl = Players[1];

	if (ev.key == "Up")
		pl.moveStep(8);

	if (ev.key == "Down")
		pl.moveStep(2);

	if (ev.key == "Left")
		pl.moveStep(4);

	if (ev.key == "Right")
		pl.moveStep(6);
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
