//
//  MAIN
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


var start_image = null;
var death_image = null;
var  vict_image = null;


function init()
{
	game_mode = "loading";

	native_Init();

	if (! render_Init())
		return;

	if (! event_Init())
		return;

	loader_Init();

	render_LoadTileset();

	main_Init();

	// HACK

	if (Native.active)
		main_BeginGame();
}


function main_Init()
{
	start_image = load_Image("data/start.png");
	death_image = load_Image("data/death.png");
	 vict_image = load_Image("data/victory.png");
}


function main_waiting_HandleKey(ev)
{
	if (ev.key == " " || ev.key == "Space")
	{
		main_BeginGame();
		return;
	}
}


function main_active_HandleKey(ev)
{
	/* handle pop-up dialogs, inventory screen, etc.. */

	//....

	/* handle "global" keys, e.g. shortcut to save game */

	//....

	/* everything else will be a command for the player */

	player_HandleKey(ev);

	// FIXME #1 : if (made_a_turn) MOVE_MONSTERS

	// FIXME #2 : if (render stuff dirty) refresh...
}


function main_FinishLoading()
{
	// called by loader once all resources are loaded.

	game_mode = "waiting";

	render_BigPicture(start_image, "#000", 75, "Press SPACE to start");

	event_SetKeyHandler(main_waiting_HandleKey);
}


function main_BeginGame()
{
	// user has pressed SPACE to start a new game

	game_mode = "active";

	render_ClearBackground();

	event_SetKeyHandler(main_active_HandleKey);

	 world_NewGame();
	player_NewGame();

	render_AddLine("Welcome to Rpg-Game !");

	render_DirtyAll();

	window.setInterval(render_Redraw, 50 /* 20 times per second */);
}


function main_EndGame()
{
	game_mode = "over";

	event_SetKeyHandler(null);

	var message = "";

	if (World.rescued > 0)
		message = "Rescued " + World.rescued + " Rabbits";

	render_BigPicture(death_image, "#000", 70, message);
}


function main_Victory()
{
	game_mode = "over";

	event_SetKeyHandler(null);

	render_BigPicture(vict_image, "#99ccff");
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
