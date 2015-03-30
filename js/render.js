//
//  RENDERING (MAP and UI)
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


// minimum size of canvas
var CANVAS_MIN_W = 632;
var CANVAS_MIN_H = 472;

// maximum number of tiles
var TILE_MAX_W = 22;
var TILE_MAX_H = 16;

// panel sizes (there is an 8 pixel buffer too)
var LEFT_W = 240;
var BOTTOM_H = 80;


// FIXME: REMOVE
var ROOM_W = 608;
var ROOM_H = 368;

var  BG_COLOR = "#3C3630";
var DIV_COLOR = "#604030";
var TEXT_BG   = "#003640";


// the drawing context
var ctx = null;


var Screen =
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
  padding_h: 0
};



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
    
  Screen.tile_w = (window_w - 8 - LEFT_W)   / 32.0;
  Screen.tile_h = (window_h - 8 - BOTTOM_H) / 32.0;

  if (Screen.tile_w > TILE_MAX_W)
    Screen.tile_w = TILE_MAX_W;

  if (Screen.tile_h > TILE_MAX_H)
    Screen.tile_h = TILE_MAX_H;

  // compute wanted canvas size
  Screen.width  = Screen.tile_w * 32 + 8 + LEFT_W;
  Screen.height = Screen.tile_h * 32 + 8 + BOTTOM_H;

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
  var mx  = 248 * Screen.scale;
  var my  = Screen.height - 80 * Screen.scale;
  var buf = 8 * Screen.scale;

  Screen.info_panel =
  {
    x: 0,
    y: 0,
    w: mx - buf,
    h: my - buf
  };

  Screen.radar_panel =
  {
    x: 0,
    y: my,
    w: mx - buf,
    h: 80 * Screen.scale
  };

  Screen.main_panel =
  {
    x: mx,
    y: 0,
    w: Screen.width - mx,
    h: my - buf
  };

  Screen.text_panel =
  {
    x: mx,
    y: my,
    w: Screen.width - mx,
    h: 80 * Screen.scale
  };
}


function render_Init()
{
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


  // prepare for drawing loading progress bar

  render_ClearBackground();


  // OK
  return true
}


function render_LoadTileset()
{
  if (Screen.scale > 1)
    Screen.tileset = load_Image("img/tileset_2x.png");
  else
    Screen.tileset = load_Image("img/tileset.png");
}


function render_BeginClip(x, y, w, h)
{
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
}


function render_EndClip(x, y, w, h)
{
  ctx.restore();
}


function render_ClearBackground()
{
  ctx.fillStyle = BG_COLOR;
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
    ctx.font = "20px serif";
    ctx.fillStyle = "#ccc";
    ctx.fillText("Loading resources", x, y)
  }

  y += 30;

  if (count == 0)
  {
    ctx.strokeStyle = "#fff";
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


function render_Picture(img, back_col, text)
{
  var w = img.width  * Screen.scale;
  var h = img.height * Screen.scale;

  var panel = Screen.main_panel;

  // place the image directly in the center (horizontally and vertically)
  var x = panel.x + (panel.w / 2) - (w / 2);
  var y = panel.y + (panel.h / 2) - (h / 2);

  x = Math.floor(x);
  y = Math.floor(y);

  render_BeginClip(panel.x, panel.y, panel.w, panel.h);

  ctx.fillStyle = back_col;
  ctx.fillRect(panel.x - 2, panel.y - 2, panel.w + 4, panel.h + 4);

  ctx.drawImage(img, x, y, w, h);

  if (text)
  {
    x = panel.x + (panel.w / 2);
    y = panel.y + (panel.h * 0.65);

    if (Screen.scale > 1)
      ctx.font = "28px Arial";
    else
      ctx.font = "16px Arial";

    ctx.fillStyle = "#ddd";

    var size = ctx.measureText(text);

    x = Math.floor(x - size.width / 2);
    y = Math.floor(y);

    ctx.fillText(text, x, y);
  }

  render_EndClip();
}


function render_UI()
{
  var room_x = 800 - ROOM_W;

  var text_y = ROOM_H
  var text_h = 500 - ROOM_H

  var thick = 3;

  ctx.fillStyle = DIV_COLOR;
  ctx.fillRect(room_x - thick, 0, thick, 500);

  ctx.fillStyle = TEXT_BG;
  ctx.fillRect(room_x, text_y, ROOM_W, text_h);

  ctx.fillStyle = DIV_COLOR;
  ctx.fillRect(room_x, text_y, ROOM_W, thick);

}


function render_Sprite(rx, ry, sprite)
{
  var img = sprite.img;

  if (! img)
    return;

  var x = (800 - ROOM_W + ROOM_W * rx);
  var y = (               ROOM_H * ry);

  // FIXME : apply proper origin

  x = x - img.width / 2;
  y = y - img.height;

  x = Math.floor(x);
  y = Math.floor(y);

  ctx.drawImage(img, x, y);
}

