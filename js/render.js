//
//  RENDERING (MAP and UI)
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


// minimum size of canvas
var CANVAS_MIN_W = 512;
var CANVAS_MIN_H = 382;

// panel sizes (there is an 8 pixel buffer too)
var INFO_W = 152;
var INFO_H = 248;

var TEXT_H = 80;
var BUFFER = 8;


// rate of callbacks for redraws
var FPS = 20;


// the drawing context
var ctx = null;


var Screen = {};


function render_SetSmoothing(enable)
{
	ctx.imageSmoothingEnabled = enable;
	ctx.webkitImageSmoothingEnabled = enable;
	ctx.mozImageSmoothingEnabled = enable;
	ctx.oImageSmoothingEnabled = enable;  
}


function render_Dimensions()
{
	//
	// Determine what size to make the canvas, whether to double up, number of
	// tiles to draw, etc...
	//

	var window_w = window.innerWidth;
	var window_h = window.innerHeight;

	Screen.scale = 1;

	if ((window_w >= CANVAS_MIN_W * 2) &&
			(window_h >= CANVAS_MIN_H * 2))
	{
		Screen.scale = 2;

		window_w = window_w / 2;
		window_h = window_h / 2;
	}

	// we don't properly support screens smaller than the minimum
	// [ TODO: should we show an error message instead? ]

	if (window_w < CANVAS_MIN_W)
		window_w = CANVAS_MIN_W;

	if (window_h < CANVAS_MIN_H)
		window_h = CANVAS_MIN_H;

	Screen.tile_w = (window_w - BUFFER - INFO_W) / 32.0;
	Screen.tile_h = (window_h - BUFFER - TEXT_H) / 32.0;

	// compute wanted canvas size
	Screen.width  = Screen.tile_w * 32 + BUFFER + INFO_W;
	Screen.height = Screen.tile_h * 32 + BUFFER + TEXT_H;

	Screen.width  = Screen.width  * Screen.scale;
	Screen.height = Screen.height * Screen.scale;

	// compute padding for vertical centering
	Screen.padding_h = Math.floor((window.innerHeight - Screen.height) / 2);

	if (Screen.padding_h < 0)
		Screen.padding_h = 0;
}


function render_PlacePanels()
{
	// positions for each panel
	var mx  = (INFO_W + BUFFER) * Screen.scale;
	var my  = Screen.height - TEXT_H * Screen.scale;
	var buf = BUFFER * Screen.scale;
	var info_h = INFO_H * Screen.scale

	Screen.info_panel =
	{
		x: 0,
		y: 0,
		w: mx - buf,
		h: info_h,
		bg: "#444"
	};

	Screen.radar_panel =
	{
		x: 0,
		y: info_h + buf,
		w: mx - buf,
		h: Screen.height - info_h - buf,
		bg: "#000"
	};

	Screen.main_panel =
	{
		x: mx,
		y: 0,
		w: Screen.width - mx,
		h: my - buf,
		bg: "#000"
	};

	Screen.text_panel =
	{
		x: mx,
		y: my,
		w: Screen.width - mx,
		h: TEXT_H * Screen.scale,
		bg: "#014"
	};
}


function render_Init()
{
	Screen =
	{
		// the canvas element
		canvas_elem: null,

		// spacer element at top
		spacer_elem: null,

		// size (in pixels) of the canvas bitmap
		width: 0,
		height: 0,

		// the up-scaling factor (either 1 or 2)
		scale: 1,

		// how many tiles we can show (may be fractional)
		tile_w: 0,
		tile_h: 0,

		// padding needed above the canvas
		padding_h: 0,

		// current scroll position of main map, in TILE coords
		// Note that tile Y coords go UPWARDS (0 = bottom-most)
		// So: draw x = main_panel.x + (tx - scroll_x) * 32
		//     draw y = main_panel.y + main_panel.h - (ty + 1 - scroll_y) * 32
		scroll_x: 0,
		scroll_y: 0,

		// scroll position of radar (do not need an X pos here)
		radar_y: 0,

		// lines of text shown in text area (only last 4 or 5 are shown)
		text_lines: []
	};


	Screen.canvas_elem = document.getElementById("game");

	if (Screen.canvas_elem === null)
	{
		alert("Error: Unable to find canvas element");
		return false;
	}


	Screen.spacer_elem = document.getElementById("spacer");

	if (Screen.spacer_elem === null)
	{
		alert("Error: Unable to find spacer element");
		return false;
	}


	render_Dimensions();
	render_PlacePanels();

	Screen.canvas_elem.width  = Screen.width;
	Screen.canvas_elem.height = Screen.height;

	Screen.spacer_elem.style.height = Screen.padding_h + "px";

/* DEBUG
	   alert("Window size: " + window.innerWidth + " x " + window.innerHeight);
	   alert("Canvas size: " + Screen.width + " x " + Screen.height);
	   alert("  Tile size: " + Screen.tile_w + " x " + Screen.tile_h);
*/


	// create the rendering context
	// (must occur _after_ we figure out what size we want)

	ctx = Screen.canvas_elem.getContext("2d");

	if (ctx === null)
	{
		alert("Error: Unable to get canvas context");
		return false;
	}

	// this causes doubled-up images to appear pixelated (instead of blurry)
	render_SetSmoothing(false);


	// OK
	return true
}


function render_LoadTileset()
{
	Screen.tileset = load_Image("data/tileset.png");

	Screen.mini_tiles = load_Image("data/mini_tiles.png");
}


function render_BeginClip(x, y, w, h)
{
	if (ctx.nativeClip)
	{
		ctx.nativeClip(x, y, w, h);
		return;
	}

	ctx.save();
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.clip();
}


function render_EndClip()
{
	ctx.restore();
}


function render_ClearBackground()
{
	ctx.fillStyle = "#444";
	ctx.fillRect(0, 0, Screen.width, Screen.height);
}


function render_Progress(count, total)
{
	var x = 150;
	var y = 200;

	var w = 300;
	var h = 40;

	if (count == 0)
	{
		ctx.font = "20px monospace";
		ctx.fillStyle = "#ccc";
		ctx.fillText("Loading resources...", x, y);
	}

	y += 30;

	if (count == 0)
	{
		ctx.strokeStyle = "#999";
		ctx.strokeRect(x, y, w, h);
	}

	x += 1; y += 1;
	w -= 2; h -= 2;

	ctx.fillStyle = "#000"; 
	ctx.fillRect(x, y, w, h);

	w = w * count / total;

	if (w > 0)
	{
		ctx.fillStyle = "#06c"; 
		ctx.fillRect(x, y, w, h);
	}
}


//
// The picture uses the whole canvas area.
// Area around the picture is cleared to the 'back_col' color.
//
function render_BigPicture(img, back_col, text_dy, text)
{
	var w = img.width  * Screen.scale;
	var h = img.height * Screen.scale;

	var panel = Screen.main_panel;

	var mx = Screen.width  / 2;
	var my = Screen.height / 2;

	// place the image directly in the center (horizontally and vertically)
	var x = mx - (w / 2);
	var y = my - (h / 2);

	x = Math.floor(x);
	y = Math.floor(y);

	ctx.fillStyle = back_col;
	ctx.fillRect(0, 0, Screen.width, Screen.height);

	ctx.drawImage(img, x, y, w, h);

	if (text)
	{
		x = mx;
		y = my + text_dy * Screen.scale;

		render_SetTextFont();

		ctx.fillStyle = "#ddd";

		var size = ctx.measureText(text);

		x = Math.floor(x - size.width / 2);
		y = Math.floor(y);

		ctx.fillText(text, x, y);
	}
}


function render_PanelFrames()
{
	// Clears the canvas and draws the separator elements.
	// If we ever need to redraw the whole screen, this must be called
	// (before or after everything else).

	var ix = Screen.info_panel.w;
	var iy = Screen.info_panel.h;

	var buf  = BUFFER * Screen.scale;
	var ofs  = 2 * Screen.scale;
	var ofs2 = buf - ofs - 1;

	var frame_color = "#777";

	// vertical bar next to info/radar panels

	ctx.fillStyle = "#000"; // Screen.info_panel.bg;
	ctx.fillRect(ix, 0, buf, Screen.height);

	ctx.fillStyle = frame_color;
	ctx.fillRect(ix + ofs,  0, 1, Screen.height);
	ctx.fillRect(ix + ofs2, 0, 1, Screen.height);

	// horizontal bar below the info panel

	ctx.fillStyle = "#000"; // Screen.info_panel.bg;
	ctx.fillRect(0, iy, ix, buf);

	ctx.fillStyle = frame_color;
	ctx.fillRect(0, iy + ofs,  ix + ofs, 1);
	ctx.fillRect(0, iy + ofs2, ix + ofs, 1);

	// horizontal bar above text panel

	var ty = Screen.main_panel.h;

	ctx.fillStyle = "#000"; // Screen.text_panel.bg;
	ctx.fillRect(ix + buf, ty, Screen.width - ix, buf);

	ctx.fillStyle = frame_color;
	ctx.fillRect(ix + ofs2, ty + ofs,  Screen.width, 1);
	ctx.fillRect(ix + ofs2, ty + ofs2, Screen.width, 1);
}


function render_BeginPanel(panel)
{
	panel.dirty = false;

	render_BeginClip(panel.x, panel.y, panel.w, panel.h);

	ctx.fillStyle = panel.bg;
	ctx.fillRect(panel.x - 4, panel.y - 4, panel.w + 8, panel.h + 8);
}


function render_EndPanel()
{
	render_EndClip();
}


function render_RefreshAll()
{
	// draws everything from scratch (the whole canvas)

	render_PanelFrames();

	render_WholeMap();
	render_TextArea();
	render_InfoArea();
	render_Radar();

	Screen.all_dirty = false;
}


function render_DirtyMap()
{
	Screen. main_panel.dirty = true;
	Screen.radar_panel.dirty = true;
}

function render_DirtyText()
{
	Screen.text_panel.dirty = true;
}

function render_DirtyInfo()
{
	Screen.info_panel.dirty = true;
}

function render_DirtyAll()
{
	Screen.all_dirty = true;
}


function render_RedrawCallback()
{
	// This is called FPS times per second, and redraws the screen (or
	// parts thereof) which have been marked as "dirty".

	if (Screen.all_dirty)
	{
		render_RefreshAll();
		return;
	}

	if (Screen.main_panel.dirty)
		render_WholeMap();

	if (Screen.text_panel.dirty)
		render_TextArea();

	if (Screen.info_panel.dirty)
		render_InfoArea();

	if (Screen.radar_panel.dirty)
		render_Radar();
}


function render_BeginIntervalTimer()
{
	Screen.interval_id = window.setInterval(render_RedrawCallback, 1000 / FPS);
}

function render_EndIntervalTimer()
{
	if (Screen.interval_id)
		window.clearInterval(Screen.interval_id);
	
	Screen.interval_id = null;
}


//----------------------------------------------------------------------
//  MAP DRAWING
//----------------------------------------------------------------------

function render_CalcDrawX(tx)
{
	// relative to left edge of main panel
	return (tx - Screen.scroll_x) * 32 * Screen.scale;
}

function render_CalcDrawY(ty)
{
	// relative to bottom of main panel
	return Screen.main_panel.h - (ty + 1 - Screen.scroll_y) * 32 * Screen.scale;
}


function render_TileRaw(x, y, id)
{
	var W = 32 * Screen.scale;

	x = x + Screen.main_panel.x;
	y = y + Screen.main_panel.y;

	// Convert id string to position in tileset.
	// The id string is always <uppercase letter><digit>, e.g. "A3" or "M0".
	// The letter is the row, the digit is the column (1,2,3...8,9,0).

	var row = id.charCodeAt(0);
	var col = id.charCodeAt(1);

	// strange ID?
	if (! row || row < 65 || row > 90) return;
	if (! col || col < 48 || col > 57) return;

	row = row - 65;
	col = col - 49;

	if (col < 0) col = 9;

	// actually draw it
	var sx = col * 32;
	var sy = row * 32;

	ctx.drawImage(Screen.tileset, sx, sy, 32, 32, x, y, W, W);
}


function render_Tile(tx, ty, id)
{
	var W = 32 * Screen.scale;

	// get coordinate in main panel (for top-left corner)
	var x = render_CalcDrawX(tx);
	var y = render_CalcDrawY(ty);

	// skip if not visible
	if (x < -W || x > Screen.main_panel.w) return;
	if (y < -W || y > Screen.main_panel.h) return;

	render_TileRaw(x, y, id);
}


function render_WholeMap()
{
	// whenever the map scrolls, must call this

	render_BeginPanel(Screen.main_panel);

	// figure out what range of tiles we need to draw
	var tx1, ty1, tx2, ty2;

	tx1 = Math.floor(Screen.scroll_x);
	ty1 = Math.floor(Screen.scroll_y);

	tx2 = Math.ceil(Screen.scroll_x + Screen.tile_w);
	ty2 = Math.ceil(Screen.scroll_y + Screen.tile_h);

	if (tx1 < 0) tx1 = 0;
	if (ty1 < 0) ty1 = 0;

	if (tx2 > Screen.tile_w - 1)
		tx2 = Screen.tile_w - 1;

	if (ty2 > Screen.tile_h - 1)
		ty2 = Screen.tile_h - 1;

//console.log("render_WholeMap : (" + tx1 + " " + tx2 + ") .. (" + ty1 + " " + ty2 + ")");

	for (var tx = tx1 ; tx <= tx2 ; tx++)
	for (var ty = ty1 ; ty <= ty2 ; ty++)
	{
		var w = World.tiles[tx][ty];

		if (! w)
			continue;

		var id1 = w.bgTile();
		var id2 = w.fgTile();

		if (id1) render_Tile(tx, ty, id1);
		if (id2) render_Tile(tx, ty, id2);
	}

	render_EndPanel();
}


//----------------------------------------------------------------------
//  RADAR
//----------------------------------------------------------------------

function render_CalcMiniX(tx)
{
	// relative to left edge of main panel
	return tx * 4 * Screen.scale;
}

function render_CalcMiniY(ty)
{
	// relative to bottom of main panel
	return Screen.radar_panel.h - (ty + 1 - Screen.radar_y) * 4 * Screen.scale;
}


function render_MiniTileRaw(x, y, id)
{
	var W = 4 * Screen.scale;

	x = x + Screen.radar_panel.x;
	y = y + Screen.radar_panel.y;

	// convert id string to position in tileset (see render_TileRaw)

	var row = id.charCodeAt(0);
	var col = id.charCodeAt(1);

	// strange ID?
	if (! row || row < 65 || row > 90) return;
	if (! col || col < 48 || col > 57) return;

	row = row - 65;
	col = col - 49;

	// actually draw it
	ctx.drawImage(Screen.mini_tiles, col * 4, row * 4, 4, 4, x, y, W, W);
}


function render_MiniTile(tx, ty, id)
{
	var W = 4 * Screen.scale;

	// get coordinate in main panel (for top-left corner)
	var x = render_CalcMiniX(tx);
	var y = render_CalcMiniY(ty);

	// skip if not visible
	if (x < -W || x > Screen.radar_panel.w) return;
	if (y < -W || y > Screen.radar_panel.h) return;

	render_MiniTileRaw(x, y, id);
}


function render_Radar()
{
	// whenever the mini-map scrolls, must call this

	render_BeginPanel(Screen.radar_panel);

	// determine range of tiles we need to draw
	var tx1, ty1, tx2, ty2;

	tx1 = 0;
	tx2 = 59;

	ty1 = Math.floor(Screen.radar_y);
	ty2 = Math.ceil (Screen.radar_y + Screen.radar_panel.h / 4);

	if (tx1 < 0) tx1 = 0;
	if (ty1 < 0) ty1 = 0;

	if (tx2 > World.tw - 1)
		tx2 = World.tw - 1;

	if (ty2 > World.th - 1)
		ty2 = World.th - 1;

//console.log("render_Radar : (" + tx1 + " " + tx2 + ") .. (" + ty1 + " " + ty2 + ")");

	for (var tx = tx1 ; tx <= tx2 ; tx++)
	for (var ty = ty1 ; ty <= ty2 ; ty++)
	{
		var w = World.tiles[tx][ty];

		if (! w)
			continue;

		var id = w.miniTile();

		if (id)
			render_MiniTile(tx, ty, id);
	}

	render_EndPanel();
}


//----------------------------------------------------------------------
//   TEXT AREA
//----------------------------------------------------------------------

var MAX_LINES = 400;

var SHOW_LINES = 4;
var LINE_H = 20;	/* TEXT_H / SHOW_LINES */


function render_SetTextFont()
{
	if (Screen.scale > 1)
		ctx.font = "28px Arial";
	else
		ctx.font = "16px Arial";
}


function render_AddLineRaw(line)
{
	if (Screen.text_lines.length >= MAX_LINES)
		Screen.text_lines.shift();
	
	Screen.text_lines.push(line);
}


function render_AddLine(line)
{
	// split lines which are too long to display

	render_SetTextFont();

	var cur_line = "";

	var words = util_Tokenize(line);

	for (var i = 0 ; i < words.length ; i++)
	{
		var word = words[i];

		var size = ctx.measureText(cur_line + " " + word);

		if (size.width + 8 < Screen.text_panel.w)
		{
			if (cur_line.length > 0)
				cur_line = cur_line + " ";

			cur_line = cur_line + word;
		}
		else
		{
			render_AddLineRaw(cur_line);
			cur_line = word;
		}
	}

	if (cur_line.length > 0)
		render_AddLineRaw(cur_line);

	render_DirtyText();
}


function render_TextArea()
{
	render_BeginPanel(Screen.text_panel);
	
	var first = 0;

	if (Screen.text_lines.length > SHOW_LINES)
		first = Screen.text_lines.length - SHOW_LINES;

	render_SetTextFont();

	ctx.fillStyle = "#bdf";

	for (var i = 0 ; i < SHOW_LINES ; i++)
	{
		var line = Screen.text_lines[first + i];

		var tx = Screen.text_panel.x + 4;
		var ty = Screen.text_panel.y + ((i + 1) * LINE_H - 2) * Screen.scale;

		if (line)
			ctx.fillText(line, tx, ty);
	}

	render_EndPanel();
}


//----------------------------------------------------------------------
//   PLAYER INFO AREA
//----------------------------------------------------------------------

function render_InfoArea()
{
	render_BeginPanel(Screen.info_panel);

	// TODO

	render_EndPanel();
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
