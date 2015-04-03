//
//  THE WORLD
//
//  by Andrew Apted, 2015
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


// Tile class

var Tile = function(kind)
{
	// the kind of tile [ FIXME : describe ]
	this.kind = kind;

	// all the objects here
	this.objects = [];

	// the monster or player here (if any)
	this.actor = null;
};


Tile.prototype =
{
	sayHello: function()
	{
		render_AddText(this.info.kind + " says hello!\n");
	}
};


//________________________________________________


function world_NewTileRow(w)
{
	var row = [];

	for (var i = 0 ; i < w ; i++)
		row.push(null);

	return row;
}


function world_NewGame()
{
	World =
	{
		tiles: [],

		areas: [],

		entities: []
	};


	// create tile grid
	// Note: unused tiles are _null_!

	World.tw = 60;
	World.th = 60;

	for (var ty = 0 ; ty < World.th ; ty++)
	{
		World.tiles.push(world_NewTileRow);
	}
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
