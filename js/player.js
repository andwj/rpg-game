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
			return;

		world_MoveEntity2(this, T.neighbor(dir));

		render_DirtyMap();

		this.has_moved = true;
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


function player_SelectPlayer(idx)
{
	var pl = Players[idx];

	if (! pl)
		return;

	// player has had their turn
	if (pl.has_moved)
		return;

	world_FocusPlayer(pl);	
}


function player_HandleKey(ev)
{
	// digit keys select a new player to control
	if (ev.key == "1" || ev.key == "2" || ev.key == "3" || ev.key == "4")
	{
		// not allowed in battle mode
		if (World.mode == "battle")
			return;

		player_SelectPlayer((+ ev.key) - 1);
		return;
	}

	var pl = World.player;

	if (ev.key == "Up")
		pl.moveStep(8);

	if (ev.key == "Down")
		pl.moveStep(2);

	if (ev.key == "Left")
		pl.moveStep(4);

	if (ev.key == "Right")
		pl.moveStep(6);
}


function player_NewTurn()
{
	// reset has_moved flags of the players
	for (var i = 0 ; i < 4 ; i++)
	{
		if (Players[i])
			Players[i].has_moved = false;
	}

	if (World.mode == "battle")
	{
		player_SelectPlayer(0);
	}
}


function player_CheckEndOfTurn()
{
	// in EXPLORE mode, only one player can make a "real" turn.
	// in BATTLE mode, each player can make _one_ real turn.

	if (! World.player.has_moved)
		return false;

	if (World.mode == "explore")
	{
		// other players use AI to move
		player_AI_all();
		return true;
	}


	// select the next player (who has not moved yet)

	var new_idx = -1;

	for (var i = 0 ; i < 4 ; i++)
	{
		var pl = Players[i];

		if (pl && ! pl.has_moved)
		{
			new_idx = i;
			break;
		}
	}

	if (new_idx < 0)
	{
		return true;
	}

	player_SelectPlayer(new_idx);
	return false;
}


function player_ChangeMode(new_mode)
{
	if (new_mode == "toggle")
	{
		new_mode = (World.mode == "explore") ? "battle" : "explore";
	}

	if (World.mode == new_mode)
		return;

	if (World.mode == "battle")
	{
		// if one or more players made a move, need to complete the turn
		if (Players[0].has_moved)
		{
			player_AI_all();
		}
	}
	else
	{
		// enter BATTLE mode, where first player always moves first
		player_SelectPlayer(0);
	}

	World.mode = new_mode;

	render_DirtyInfo();
}


//________________________________________________


function player_AI(pl)
{
	if (! pl)
		return;
	
	if (pl.has_moved)
		return;

	pl.moveStep(8);
}


function player_AI_all()
{
	for (var i = 0 ; i < 4 ; i++)
	{
		player_AI(Players[i]);
	}
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
