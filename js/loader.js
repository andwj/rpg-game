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
	load_count = 0;
	load_total = 0;

	// draw an empty progress bar
	render_ClearBackground();
	render_Progress(0, 0);

	return true;
}


function loader_GotImage()
{
	load_count += 1;

	render_Progress(load_count, load_total);

	if (load_count == load_total)
		main_FinishLoading();
}


function load_Image(url)
{
	load_total += 1;

	var img = new Image;

	img.src = url;

	img.addEventListener("load", loader_GotImage);

	return img
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
