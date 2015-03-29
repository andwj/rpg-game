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


  // OK
  return true
}


function render_ClearBackground()
{
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, Screen.width, Screen.height);
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
  var img = all_images[sprite.ref]

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


function render_Room()
{
  var room_x = 800 - ROOM_W;
  var room_y = 0;

  // FIXME : show the base image for the current room
  var img = all_images.room_template;

  ctx.drawImage(img, room_x, room_y);

  // TODO : apply modifiers to base image (e.g. doors)


  // TODO : render all the entities (properly)

  render_Sprite(0.5, 0.85, Player.sprite);

}

