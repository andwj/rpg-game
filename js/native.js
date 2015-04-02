//
//  NATIVE INTERFACE
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


var Native_check = this.Native;


function native_Init()
{
	// check if running on native binary
	if (! Native_check)
		return;

	// TODO : setup stuff....

	alert("WTF : native?");
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
