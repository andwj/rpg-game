//
//  RENDERING (MAP and UI)
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________


var ROOM_W = 608;
var ROOM_H = 368;

var  BG_COLOR = "#3C3630";
var DIV_COLOR = "#604030";
var TEXT_BG   = "#003640";


function render_Init()
{
  canvas_elem = document.getElementById("gamecanvas");

  if (canvas_elem === null)
  {
    alert("Error: Unable to find canvas element");
    return false;
  }

//// TEST
// canvas_elem.width  = 680 * 2;
// canvas_elem.height = 472 * 2;


  ctx = canvas_elem.getContext("2d");

  if (ctx === null)
  {
    alert("Error: Unable to get canvas context");
    return false;
  }


  // OK
  return true
}


function render_clearBackground()
{
//  alert("Inner size: " + window.innerWidth + " x " + window.innerHeight);
//  alert("Canvas size: " + canvas_elem.width + " x " + canvas_elem.height);

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, 680, 472);
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

