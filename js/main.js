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
	game_state = "init";

	native_Init();

	if (! render_Init())
		return;

	if (! event_Init())
		return;

	loader_Init();

	render_LoadTileset();

	main_Init();

	game_state = "loading";

	loader_CheckFinished();
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
		main_NewGame();
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

	if (player_CheckEndOfTurn())
	{
		world_MakeTurn();

		player_NewTurn();
	}
}


function main_FinishLoading()
{
	// called by loader once all resources are loaded.

	game_state = "waiting";

	render_BigPicture(start_image, "#000", 75, "Press SPACE to start");

	event_SetKeyHandler(main_waiting_HandleKey);
}


function main_NewGame()
{
	// user has pressed SPACE to start a new game

	game_state = "active";

	render_ClearBackground();

	event_SetKeyHandler(main_active_HandleKey);

	 world_NewGame();
	player_NewGame();

	render_AddLine("Welcome to Rpg-Game !");
	render_AddLine("Press '?' for help.");

	render_DirtyAll();

	render_BeginIntervalTimer();
}


function main_Die()
{
	game_state = "over";

	event_SetKeyHandler(null);

	render_EndIntervalTimer();

	var message = "";

	render_BigPicture(death_image, "#000", 70, message);
}


function main_Victory()
{
	game_state = "over";

	event_SetKeyHandler(null);

	render_EndIntervalTimer();

	render_BigPicture(vict_image, "#99ccff");
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
