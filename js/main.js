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


	if (! window.addEventListener)
	{
		alert("Error: no event listener api");
		return;
	}


	if (! event_Init())
		return;

	loader_Init();

	render_LoadTileset();

	main_Init();
}


function main_Init()
{
	start_image = load_Image("data/start.png");
	death_image = load_Image("data/death.png");
	 vict_image = load_Image("data/victory.png");
}


function main_FinishLoading()
{
	// called by loader once all resources are loaded.

	game_mode = "waiting";

	render_BigPicture(start_image, "#000", 75, "Press SPACE to start");
}


function main_BeginGame()
{
	// user has pressed SPACE to start a new game

	render_ClearBackground();

	game_mode = "active";

	player_NewGame();
	 world_NewGame();

	// FIXME : create world, set up UI, etc..

	render_RefreshAll();

	render_AddLine("Welcome to Rpg-Game !");
}


function main_EndGame()
{
	game_mode = "over";

	var message = "";

	if (World.rescued > 0)
		message = "Rescued " + World.rescued + " Rabbits";

	render_BigPicture(death_image, "#000", 70, message);
}


function main_Victory()
{
	game_mode = "over";

	render_BigPicture(vict_image, "#99ccff");
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
