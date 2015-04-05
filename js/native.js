//
//  NATIVE INTERFACE
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


var Native = {};


function native_ctx_fillRect(x, y, w, h)
{
	Native.setColor(this.fillStyle);
	Native.fillRect(x, y, w, h);
}

function native_ctx_strokeRect(x, y, w, h)
{
	Native.setColor(this.strokeStyle);
	Native.strokeRect(x, y, w, h);
}

function native_ctx_fillText(str, x, y)
{
	Native.setColor(this.fillStyle);
	Native.setFont (this.font);

	Native.fillText(str, x, y);
}

function native_ctx_measureText(str)
{
	Native.setFont(this.font);

	print("native_ctx_measureText : ", str);
}

function native_ctx_drawImage(img)  // FIXME
{
	print("native_ctx_drawImage");
}

function native_ctx_setClip(x, y, w, h)
{
	print("native_ctx_nativeClip");
}

function native_ctx_clearClip(x, y, w, h)
{
	print("native_ctx_restore");
}


function native_window_addListener(type, listener, useCapture)
{
	print("native_window_addListener : ", type);
}


//_______________________________________________


function native_Init()
{
	// check if running on native binary
	if (! Native.active)
		return;

	// create a rendering context

	Native.ctx =
	{
		fillRect:		native_ctx_fillRect,
		strokeRect:		native_ctx_strokeRect,
		fillText:		native_ctx_fillText,
		measureText:	native_ctx_measureText,
		drawImage:		native_ctx_drawImage,
		nativeClip:		native_ctx_setClip,
		restore:		native_ctx_clearClip
	};

	// create a dummy 'window' object

print("Native screen size:", Native.screen_w, Native.screen_h);

	global.window =
	{
		// window size is set by the native player
		innerWidth:  Native.screen_w,
		innerHeight: Native.screen_h,

		addEventListener: native_window_addListener
	};

	// create a dummy 'document' global

	global.document =
	{
		spacer:
		{
			style: {}
		},

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

	// create our own Image class

	global.Image = function()
	{
		// TODO
	};

	global.Image.prototype =
	{
		addEventListener: function(type, listener)
		{
			// TODO
		}
	};
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
