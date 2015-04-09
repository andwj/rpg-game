//
//  PLAYER HANDLING
//
//  by Andrew Apted, 2015
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


var PLAYER_CLASSES =
{
	Miner:	// hmmm
	{
		class_: "Miner",
		health: 90,
		strength: 7,
		tile: "G2"
	},

	Brute:
	{
		class_: "Brute",
		health: 125,
		strength: 10,
		tile: "G3"
	},

	Scout:
	{
		class_: "Scout",
		health: 75,
		strength: 3,
		tile: "G4"
	},

	Archer:
	{
		class_: "Archer",
		health: 85,
		strength: 5,
		tile: "G5"
	},

	Knight:
	{
		class_: "Knight",
		health: 100,
		strength: 8,
		tile: "G6"
	},

	Wizard:
	{
		class_: "Wizard",
		health: 60,
		strength: 3,
		tile: "G7"
	},

	Enchanter:
	{
		class_: "Enchanter",
		health: 60,
		strength: 3,
		tile: "G8"
	}
};


// Player class : extends Entity

var Player = function(class_)
{
	var info = PLAYER_CLASSES[class_];

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
		render_AddLine(this.info.class_ + " says hello!");
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

		render_DirtyMap();
	}
};


//________________________________________________


function player_NewGame()
{
	Players = [ null, null, null ];

	Players[0] = new Player("Miner");
	Players[1] = new Player("Wizard");
	Players[2] = new Player("Scout");

	// FIXME : spawn spot
	var tx = 8;
	var ty = 5;

	world_AddEntity(Players[0], tx, ty);
	world_AddEntity(Players[1], tx + 1, ty);
	world_AddEntity(Players[2], tx, ty - 1);

	world_FocusPlayer(Players[0]);
}


function player_HandleKey(ev)
{
	var pl = Players[0];

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
