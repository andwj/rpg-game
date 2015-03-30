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
  // ignore unknown buttons
  if (ev.button != 0)
    return;

  ev.preventDefault();

  var mx = ev.client_X;
  var my = ev.client_Y;

  if (! mx) return;
  if (! my) return;

  console.log("MouseDown event: " + mx + " x " + my);

  // TODO
}


function event_KeyDown(ev)
{
  // ignore unknown keys
  if (! ev.key)
    return;

  // FIXME : ignore CTRL or ALT or META modifiers

//  ev.preventDefault();

  console.log("KeyDown event: key=" + ev.key);

  // TODO
}


function event_Init()
{
  window.addEventListener("mousedown", event_MouseDown, true);
  window.addEventListener("keydown",   event_KeyDown,   true);

  return true;
}

