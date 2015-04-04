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

	// main tile to draw here (a floor or wall)
	this.tile = "A1";

	// all the objects here
	this.objects = [];

	// the monster or player here (null if none)
	this.actor = null;

	// has been seen?
	this.seen = true;	// FIXME
};


Tile.prototype =
{
	sayHello: function()
	{
		render_AddText(this.info.kind + " says hello!\n");
	},

	// return what should be rendered here (null for nothing at all)
	getTile: function()
	{
		if (! this.seen)
			return null;

		if (this.actor)
			return this.actor.info.tile;

		if (this.objects.length > 0)
		{
			var obj = this.objects[this.objects.length - 1];

			return obj.info.tile;
		}

		return this.tile;
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

		entities: [],

		rescued: 0
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
