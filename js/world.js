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
	bgTile: function()
	{
		if (! this.seen)
			return null;

		return this.tile;
	},

	fgTile: function()
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

		return null;
	}
};


//________________________________________________


function world_NewTileColumn()
{
	var row = [];

	for (var i = 0 ; i < World.th ; i++)
		row.push(null);

	return row;
}


function world_AddEntity(ent, tx, ty)
{
	ent.tx = tx;
	ent.ty = ty;

	var tile = World.tiles[tx][ty];

	if (ent.is_actor)
		tile.actor = ent;
	else
		tile.objects.push(ent);
}


function world_RemoveEntity(ent)
{
	var tile = World.tiles[ent.tx][ent.ty];

	ent.tx = null;
	ent.ty = null;

	if (tile.actor == ent)
		tile.actor = null;
	else
	{
		var idx = tile.objects.indexOf(ent);

		if (idx >= 0)
			tile.objects.splice(idx, 1);
	}
}


function world_MoveEntity(ent, tx, ty)
{
	world_RemoveEntity(ent);
	world_AddEntity(ent, tx, ty);
}


function world_SwapActors(ent1, ent2)
{
	var tile1 = World.tiles[ent1.tx][ent1.ty];
	var tile2 = World.tiles[ent2.tx][ent2.ty];

	tile1.actor = ent2;
	tile2.actor = ent1;

	var tmp;

	tmp = ent1.tx; ent1.tx = ent2.tx; ent2.tx = tmp;
	tmp = ent1.ty; ent1.ty = ent2.ty; ent2.ty = tmp;
}


function world_CreateRoom(tx1, ty1, tx2, ty2, info)
{
	var tx, ty;

	for (tx = tx1 ; tx <= tx2 ; tx++)
	for (ty = ty1 ; ty <= ty2 ; ty++)
	{
		var x_wall = (tx == tx1 || tx == tx2);
		var y_wall = (ty == ty1 || ty == ty2);

		var kind = "floor";
		var tile = "C8";

		if (x_wall || y_wall)
		{
			kind = "wall";
			tile = "C9";
		}

		var w = new Tile(kind);
		w.tile = tile;

		World.tiles[tx][ty] = w;
	}
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

	for (var tx = 0 ; tx < World.tw ; tx++)
	{
		World.tiles.push(world_NewTileColumn());
	}


	world_CreateRoom(1, 1, 14, 9);
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
