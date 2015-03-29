//
//  EVENT HANDLING
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


function event_MouseDown(ev)
{
  ev.preventDefault();

  // TODO
}


function event_KeyDown(ev)
{
  ev.preventDefault();

  // TODO
}


function event_Init()
{
  window.addEventListener("mousedown", event_MouseDown, true);
  window.addEventListener("keydown",   event_KeyDown,   true);

  return true;
}

