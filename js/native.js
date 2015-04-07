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

	// create the 'size' object here
	// [ IDEA : re-use a single object to save some memory ]
	var size = {};

	Native.measureText(str, size);

	return size;
}

function native_ctx_drawImage(img, sx, sy, sw, sh, x, y, w, h)
{
	if (w && h)
	{
		Native.drawImagePart(img.id, x, y, w, h, sx, sy, sw, sh);
	}
	else
	{
		Native.drawImage(img.id, sx, sy, sw, sh);
	}
}

function native_ctx_setClip(x, y, w, h)
{
	Native.setClip(x, y, w, h);
}

function native_ctx_resetClip()
{
	Native.resetClip();
}


function native_window_addListener(type, listener, useCapture)
{
	print("native_window_addListener : ", type);
}

function native_window_setInterval(func, delay)
{
	Native.interval_func = func;
	Native.setInterval(delay);
}

function native_window_clearInterval(id)
{
	Native.interval_func = null;
	Native.setInterval(-1);
}


function native_image_addListener(type, listener)
{
	// 'this' is an Image instance.

	// Note: calling this actually loads the image
	// [ a little bit hacky, but it works... ]

	this.id = Native.loadImage(this.src);

	this.width  = Native.getImageProp(this.id, "width");
	this.height = Native.getImageProp(this.id, "height");

	// do the callback right now...
	listener();
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
		restore:		native_ctx_resetClip
	};

	// create a dummy 'window' object

	global.window =
	{
		// window size is set by the native player
		innerWidth:  Native.screen_w,
		innerHeight: Native.screen_h,

		addEventListener:	native_window_addListener,
		setInterval:		native_window_setInterval,
		clearInterval:		native_window_clearInterval
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
		/* nothing needed */
	};

	global.Image.prototype =
	{
		addEventListener: native_image_addListener
	};
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
