//
//  EVENT HANDLING
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


function handleMouseDown(ev)
{
  ev.preventDefault();

  // TODO
}


function handleKeyDown(ev)
{
  ev.preventDefault();

  // TODO
}


function event_init()
{
  window.addEventListener("mousedown", handleMouseDown, true);
  window.addEventListener("keydown",   handleKeyDown,   true);
}

