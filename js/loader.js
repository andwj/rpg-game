//
//  LOADER (PROGRESS BAR)
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


// load information for progress bar
var load_count;
var load_total;


function loader_DrawProgress()
{
  var x = 150;
  var y = 200;

  var w = 300;
  var h = 40;

  if (load_count == 0)
  {
    ctx.font = "20px serif";
    ctx.fillStyle = "#ccc";
    ctx.fillText("Loading resources", x, y)
  }

  y += 30;

  if (load_count == 0)
  {
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(x, y, w, h);
  }
 
  x += 1; y += 1;
  w -= 2; h -= 2;

  ctx.fillStyle = "#000"; 
  ctx.fillRect(x, y, w, h);

  w = w * load_count / load_total;

  if (w > 0)
  {
    ctx.fillStyle = "#06c"; 
    ctx.fillRect(x, y, w, h);
  }
}


function loader_Init()
{
  all_images = {};

  load_count = 0;
  load_total = 0;

  // draw an empty progress bar
  loader_DrawProgress();
}


function loader_GotImage()
{
  load_count += 1;

  loader_DrawProgress();

  if (load_count == load_total)
    main_StartGame();
}


function loader_AddImage(name, url)
{
  load_total += 1;

  var img = new Image;

  img.src = url;

  img.addEventListener("load", loader_GotImage);

  all_images[name] = img
}

