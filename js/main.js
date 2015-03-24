//
//  MAIN
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________


function init()
{
  canvas_elem = document.getElementById("gamecanvas");

  if (canvas_elem === null)
  {
    alert("Error: Unable to find canvas element");
    return;
  }

  ctx = canvas_elem.getContext("2d");

  if (ctx === null)
  {
    alert("Error: Unable to get canvas context");
    return;
  }

  if (! window.addEventListener)
  {
    alert("Error: no event listener api");
    return;
  }


  render_clearBackground();


  loader_init();

  event_init();

  entity_Init();
  world_Init();
}


function start_game()
{
  // called by loader once all resources are loaded.

  render_clearBackground();

  world_Create();

  render_UI();
  render_Room();
}

