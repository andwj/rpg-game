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
	// already consumed?
	if (ev.defaultPrevented)
		return;

	// ignore unknown buttons (especially for RMB context menus)
	if (ev.button != 0)
		return;

	var mx = ev.clientX;
	var my = ev.clientY;

	if (! mx) return;
	if (! my) return;

	ev.preventDefault();

	console.log("MouseDown event: " + mx + " x " + my);

	// TODO
}


function event_KeyDown(ev)
{
	// already consumed?
	if (ev.defaultPrevented)
		return;

	// ignore unknown keys
	if (! ev.key || ev.key == "" || ev.key == "Unidentified")
		return;

	// ignore dead keys / composing sequences
	if (ev.key == "Dead" || ev.isComposing)
		return;

	// ignore CTRL or ALT or META modifiers
	if (ev.ctrlKey || ev.altKey || ev.metaKey)
		return;

	console.log("KeyDown event: key=" + ev.key);

	ev.preventDefault();

	if (game_mode == "waiting" && (ev.key == " " || ev.key == "Space"))
	{
		main_BeginGame();
		return;
	}

	// TODO

}


function event_Init()
{
	window.addEventListener("mousedown", event_MouseDown, true);
	window.addEventListener("keydown",   event_KeyDown,   true);

	return true;
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
