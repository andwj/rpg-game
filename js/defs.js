//
//  GLOBAL DEFINITIONS
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________


// version strings
var VERSION = "0.05";
var VER_X   = "005";


// rendering info goes here
var Screen =
{
  // the canvas element
  canvas_elem: null,

  // spacer element at top
  spacer_elem: null,

  // the drawing context
  ctx: null,

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


// all the images that we need  [ FIXME : REMOVE ]
var all_images;


// the player entity
var Player;

// the whole world (all the rooms, monsters, items, etc...)
var World;

