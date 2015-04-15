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
	Miner:	// hmmm, want a better name
	{
		class_: "Miner",
		race: "dwarf",
		health: 90,
		strength: 7,
		tile: "G2"
	},

	Brute:
	{
		class_: "Brute",
		race: "human",
		health: 125,
		strength: 10,
		tile: "G3"
	},

	Scout:
	{
		class_: "Scout",
		race: "hobbit",
		health: 75,
		strength: 3,
		tile: "G4"
	},

	Archer:
	{
		class_: "Archer",
		race: "elf",
		health: 85,
		strength: 5,
		tile: "G5"
	},

	Knight:
	{
		class_: "Knight",
		race: "human",
		health: 100,
		strength: 8,
		tile: "G6"
	},

	Wizard:
	{
		class_: "Wizard",
		race: "human",
		health: 60,
		strength: 3,
		tile: "G7"
	},

	Enchanter:
	{
		class_: "Enchanter",
		race: "elf",
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
	this.armor  = 4;  // FIXME : TEST

	this.name = "Aravil"; // FIXME

	// TODO : inventory items
};


Player.prototype =
{
	sayHello: function()
	{
		render_Print(this.name + " says hello!");
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

	Players[0] = new Player("Knight");
	Players[1] = new Player("Enchanter");
	Players[2] = new Player("Brute");

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

	// alphabetical characters begin a new command line
	if (ev.key.search(/^[a-zA-Z]$/) >= 0)
	{
		render_BeginCommandLine();
		render_CommandLineKey(ev);
		return;
	}

	if (ev.key == "F1")
		player_ChangeMode("explore");

	if (ev.key == "F2")
		player_ChangeMode("battle");

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
		// leaving BATTLE mode.
		// some players may have moved already, some not.
		// ones who have moved cannot move again (player cannot select them, and
		// the AI will skip them).
		// so it is completely OK to do nothing here.
	}
	else
	{
		// enter BATTLE mode, where first player always moves first
		player_SelectPlayer(0);
	}

	World.mode = new_mode;

	render_DirtyInfo();
}


function player_HandleCommand(cmd)
{
	// TODO

	print("player_HandleCommand:", cmd);
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
