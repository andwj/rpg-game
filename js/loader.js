//
//  RESOURCE LOADING
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


// load information for progress bar
var load_count;
var load_total;


function loader_Init()
{
  all_images = {};

  load_count = 0;
  load_total = 0;

  // draw an empty progress bar
  render_Progress(0, 0);
}


function loader_GotImage()
{
  load_count += 1;

  render_Progress(load_count, load_total);

  if (load_count == load_total)
    main_StartGame();
}


function load_Image(name, url)
{
  load_total += 1;

  var img = new Image;

  img.src = url;

  img.addEventListener("load", loader_GotImage);

  all_images[name] = img
}

