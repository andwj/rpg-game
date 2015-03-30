//
//  MAIN
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


var start_image = null;


function init()
{
  game_mode = "loading";

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
  entity_Init();
  world_Init();
}


function main_Init()
{
  start_image = load_Image("img/start.png");
}


function main_StartGame()
{
  // called by loader once all resources are loaded.

  game_mode = "waiting";

  render_ClearBackground();

  render_BigPicture(start_image, "#000", 75, "Press SPACE to start");
}

