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
var INFO_H = 256;

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

	// compute number of text rows (esp. when we have lots of spare vertical room)
	Screen.text_line_h = 20;
	if (window_h >= 400) Screen.text_line_h += 1;
	if (window_h >= 500) Screen.text_line_h += 1;
	if (window_h >= 600) Screen.text_line_h += 1;

	Screen.num_text_rows = 4 + Math.floor((window_h - CANVAS_MIN_H) / 120);
	Screen.info_w = INFO_W + Math.floor((window_w - CANVAS_MIN_W) / 6);

	var text_h = Screen.num_text_rows * Screen.text_line_h;

	Screen.tile_w = (window_w - BUFFER - Screen.info_w) / 32.0;
	Screen.tile_h = (window_h - BUFFER - text_h) / 32.0;

	// compute wanted canvas size
	Screen.width  = window_w * Screen.scale;
	Screen.height = window_h * Screen.scale;

	// compute padding for vertical centering
	Screen.padding_h = Math.floor((window.innerHeight - Screen.height) / 2);

	if (Screen.padding_h < 0)
		Screen.padding_h = 0;
}


function render_PlacePanels()
{
	// positions for each panel
	var text_h = Screen.num_text_rows * Screen.text_line_h;
	var mx  = (Screen.info_w + BUFFER) * Screen.scale;
	var my  = Screen.height - text_h * Screen.scale;
	var buf = BUFFER * Screen.scale;
	var info_h = INFO_H * Screen.scale

	Screen.main_panel =
	{
		x: mx,
		y: 0,
		w: Screen.width - mx,
		h: my - buf,
		bg: "#000",

		// current scroll position of main map, in TILE coords
		// Note that tile Y coords go UPWARDS (0 = bottom-most)
		// So: draw x = main_panel.x + (tx - scroll_x) * 32
		//     draw y = main_panel.y + main_panel.h - (ty + 1 - scroll_y) * 32
		scroll_x: 0,
		scroll_y: 0,

		// buffer (in tiles) to use when scrolling main map
		buffer_x: Math.ceil(Screen.tile_w / 5),
		buffer_y: Math.ceil(Screen.tile_h / 5)
	};

	Screen.text_panel =
	{
		x: mx,
		y: my,
		w: Screen.width - mx,
		h: text_h * Screen.scale,
		bg: "#014"
	};

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
		bg: "#000",
		scroll_x: 0,
		scroll_y: 0
	};

	// radar stuff

	Screen.radar_panel.tile_w = Screen.radar_panel.w / 4 / Screen.scale
	Screen.radar_panel.tile_h = Screen.radar_panel.h / 4 / Screen.scale
}


function render_Init()
{
	Screen =
	{
		// the canvas element
		canvas_elem: null,

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

		// lines of text shown in text area (only last 4 or 5 are shown)
		text_lines: []
	};


	Screen.canvas_elem = document.getElementById("game");

	if (Screen.canvas_elem === null)
	{
		alert("Error: Unable to find canvas element");
		return false;
	}


	render_Dimensions();
	render_PlacePanels();

	Screen.canvas_elem.width  = Screen.width;
	Screen.canvas_elem.height = Screen.height;

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

function render_CalcTileX(tx)
{
	// relative to left edge of main panel
	return (tx - Screen.main_panel.scroll_x) * 32 * Screen.scale;
}

function render_CalcTileY(ty)
{
	// relative to top of main panel
	return Screen.main_panel.h - (ty + 1 - Screen.main_panel.scroll_y) * 32 * Screen.scale;
}


function render_TileRaw(x, y, id)
{
	var W = 32 * Screen.scale;

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
	var x = render_CalcTileX(tx);
	var y = render_CalcTileY(ty);

	// skip if not visible
	if (x < -W || x > Screen.main_panel.w) return;
	if (y < -W || y > Screen.main_panel.h) return;

	x = x + Screen.main_panel.x;
	y = y + Screen.main_panel.y;

	render_TileRaw(x, y, id);
}


function render_WholeMap()
{
	// whenever the map scrolls, must call this

	var panel = Screen.main_panel;

	render_BeginPanel(panel);

	// figure out what range of tiles we need to draw
	var tx1, ty1, tx2, ty2;

	tx1 = Math.floor(panel.scroll_x);
	ty1 = Math.floor(panel.scroll_y);

	tx2 = Math.ceil(panel.scroll_x + Screen.tile_w);
	ty2 = Math.ceil(panel.scroll_y + Screen.tile_h);

	if (tx1 < 0) tx1 = 0;
	if (ty1 < 0) ty1 = 0;

	if (tx2 > World.tw - 1) tx2 = World.tw - 1;
	if (ty2 > World.th - 1) ty2 = World.th - 1;

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


function render_ScrollTo(tx, ty)
{
	// Possibly scroll main map so that the given tile is near center
	// (not off-screen, or in the buffer zone).

	var panel = Screen.main_panel;

	var size = 32 * Screen.scale;

	var x1 = panel.buffer_x * size;
	var y1 = panel.buffer_y * size;

	var x2 = panel.w - x1;
	var y2 = panel.h - y1;

	var mx = render_CalcTileX(tx) + size / 2;
	var my = render_CalcTileY(ty) + size / 2;

	// handle X and Y separately

	if (mx < x1 || mx > x2)
	{
		var new_scroll_x = panel.scroll_x;

		if (mx > x2)
			new_scroll_x += Math.ceil((mx - x2) / size);
		else
			new_scroll_x -= Math.ceil((x1 - mx) / size);

		if (new_scroll_x > World.tw - Screen.tile_w)
			new_scroll_x = World.tw - Screen.tile_w;

		if (new_scroll_x < 0)
			new_scroll_x = 0;

		if (panel.scroll_x != new_scroll_x)
		{
			panel.scroll_x = new_scroll_x;
			panel.dirty = true;
		}
	}

	if (my < y1 || my > y2)
	{
		var new_scroll_y = panel.scroll_y;

		if (my > y2)
			new_scroll_y -= Math.ceil((my - y2) / size);
		else
			new_scroll_y += Math.ceil((y1 - my) / size);

		if (new_scroll_y > World.th - Screen.tile_h)
			new_scroll_y = World.th - Screen.tile_h;

		if (new_scroll_y < 0)
			new_scroll_y = 0;

		if (panel.scroll_y != new_scroll_y)
		{
			panel.scroll_y = new_scroll_y;
			panel.dirty = true;
		}
	}
}



//----------------------------------------------------------------------
//  RADAR
//----------------------------------------------------------------------

function render_CalcRadarX(tx)
{
	// relative to left edge of radar panel
	return (tx - Screen.radar_panel.scroll_x) * 4 * Screen.scale;
}

function render_CalcRadarY(ty)
{
	// relative to top of radar panel
	return Screen.radar_panel.h - (ty + 1 - Screen.radar_panel.scroll_y) * 4 * Screen.scale;
}


function render_MiniTileRaw(x, y, id)
{
	var W = 4 * Screen.scale;

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
	var x = render_CalcRadarX(tx);
	var y = render_CalcRadarY(ty);

	// skip if not visible
	if (x < -W || x > Screen.radar_panel.w) return;
	if (y < -W || y > Screen.radar_panel.h) return;

	x = x + Screen.radar_panel.x;
	y = y + Screen.radar_panel.y;

	render_MiniTileRaw(x, y, id);
}


function render_Radar()
{
	// whenever the mini-map scrolls, must call this

	var panel = Screen.radar_panel;

	render_BeginPanel(panel);

	// determine range of tiles we need to draw
	var tx1, ty1, tx2, ty2;

	tx1 = Math.floor(panel.scroll_x);
	ty1 = Math.floor(panel.scroll_y);

	tx2 = Math.ceil (panel.scroll_x + panel.tile_w);
	ty2 = Math.ceil (panel.scroll_y + panel.tile_h);

	if (tx1 < 0) tx1 = 0;
	if (ty1 < 0) ty1 = 0;

	if (tx2 > World.tw - 1) tx2 = World.tw - 1;
	if (ty2 > World.th - 1) ty2 = World.th - 1;

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


function render_RadarScrollTo(tx, ty)
{
	// Possibly scroll radar so that the given tile is near center.
	//
	// When we scroll, we move that tile to center of radar (or as close to
	// center as we can) -- different from how the main map scrolls.

	var panel = Screen.radar_panel;

	// coordinates in pixels, used only for testing
	var mx = panel.w / 2;
	var my = panel.h / 2;

	var buf_x = panel.w / 4;
	var buf_y = panel.h / 4;

	var x = render_CalcRadarX(tx) + 2 * Screen.scale;
	var y = render_CalcRadarY(ty) + 2 * Screen.scale;

	// handle X and Y separately

	if (x < mx - buf_x || x > mx + buf_x)
	{
		var new_scroll_x = tx - Math.floor(panel.tile_w / 2);

		if (new_scroll_x > World.tw - panel.tile_w)
			new_scroll_x = World.tw - panel.tile_w;

		if (new_scroll_x < 0)
			new_scroll_x = 0;

		if (panel.scroll_x != new_scroll_x)
		{
			panel.scroll_x = new_scroll_x;
			panel.dirty = true;
		}
	}

	if (y < my - buf_y || y > my + buf_y)
	{
		var new_scroll_y = ty - Math.floor(panel.tile_h / 2);

		if (new_scroll_y > World.th - panel.tile_h)
			new_scroll_y = World.th - panel.tile_h;

		if (new_scroll_y < 0)
			new_scroll_y = 0;

		if (panel.scroll_y != new_scroll_y)
		{
			panel.scroll_y = new_scroll_y;
			panel.dirty = true;
		}
	}
}


//----------------------------------------------------------------------
//   TEXT AREA
//----------------------------------------------------------------------

var MAX_LINES = 400;


function render_SetTextFont()
{
	if (Screen.scale > 1)
		ctx.font = "28px Sans";
	else
		ctx.font = "16px Sans";
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

	var LINE_H     = Screen.text_line_h;
	var SHOW_LINES = Screen.num_text_rows;

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


function render_PlayerInfo(idx, pl)
{
	var x = Screen.info_panel.x;
	var y = Screen.info_panel.y + (64 + idx * 64) * Screen.scale;
	var w = Screen.info_panel.w;
	var h = 64 * Screen.scale;

	var bg = "#444";

	if (pl && pl == World.player)
		bg = "#357";
	else if (idx != 1)
		bg = "#555";

	ctx.fillStyle = bg;
	ctx.fillRect(x, y, w, h);

	if (! pl)
		return;

	render_TileRaw(x + 4, y + 8, pl.info.tile);

	// TODO : health (etc)
}


function render_InfoArea()
{
	render_BeginPanel(Screen.info_panel);

	/* draw the common stuff : mode, time, gold */

	if (Screen.scale > 1)
		ctx.font = "28px Monospace";
	else
		ctx.font = "16px Monospace";

	var dx = 60 * Screen.scale;
	var dy = 20 * Screen.scale;

	var x = Screen.info_panel.x + 6 * Screen.scale;
	var y = Screen.info_panel.y - 2 * Screen.scale + dy;

	ctx.fillStyle = "#aaa";

	ctx.fillText("Time:", x, y + dy * 0);
	ctx.fillText("Gold:", x, y + dy * 1);
	ctx.fillText("Mode:", x, y + dy * 2);

	ctx.fillStyle = "#eee";
	ctx.fillText("0000000", x + dx, y + dy * 0);

	ctx.fillStyle = "#ff0";
	ctx.fillText("$175", x + dx, y + dy * 1);

	if (World.mode == "battle")
	{
		ctx.fillStyle = "#f00";
		ctx.fillText("BATTLE", x + dx, y + dy * 2);
	}
	else
	{
		ctx.fillStyle = "#0c0";
		ctx.fillText("EXPLORE", x + dx, y + dy * 2);
	}


	/* draw a sub-panel for each player */

	for (var idx = 0 ; idx < 3 ; idx++)
	{
		render_PlayerInfo(idx, Players[idx]);
	}

	render_EndPanel();
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
