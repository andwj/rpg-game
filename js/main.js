//
//  MAIN
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


function init()
{
  if (! render_Init())
    return;


  if (! window.addEventListener)
  {
    alert("Error: no event listener api");
    return;
  }


  loader_Init();

  event_Init();

  entity_Init();
  world_Init();
}


function main_StartGame()
{
  // called by loader once all resources are loaded.

  render_ClearBackground();

  world_Create();

  render_UI();
  render_Room();
}

