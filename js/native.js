//
//  NATIVE INTERFACE
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


var Native = { width:1024, height:768 };


function native_ctx_Foo()
{
}


function native_Init()
{
	// check if running on native binary
	if (! Native.active)
		return;

	// create a rendering context

	Native.ctx =
	{
		foo: native_ctx_Foo
	}

	// create a dummy 'window' object

	global.window =
	{
		innerWidth:  Native.width,
		innerHeight: Native.height
	}

	// create a dummy 'document' global

	global.document =
	{
		spacer: {},

		canvas:
		{
			getContext: function()
			{
				return Native.ctx;
			}
		},

		getElementById: function(name)
		{
			if (name == "game")
				return this.canvas;

			if (name == "spacer")
				return this.spacer;

			return null;
		}
	};
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
