//
//  THE WORLD
//
//  by Andrew Apted, 2015
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


var MiniTilesetConv =
{
	A8: "A5",	// lava
	A9: "A3",	// water
	B8: "A4",	// grass
	B9: "B2",	// hallway
	C8: "A2",	// cave floor
	C9: "B1",	// cave wall

	// floors
	A1: "A2", A2: "A2", A3: "A2", A4: "A2", A5: "A2", A6: "A2", A7: "A2",
	B1: "A2", B2: "A2", B3: "A2", B4: "A2", B5: "A2", B6: "A2", B7: "A2",
	C3: "A2", C7: "A2"
};


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
	},

	miniTile: function()
	{
		if (! this.seen)
			return null;

		if (this.actor && this.actor.kind == "player")
			return "C1";

		if (this.actor && this.actor.is_pet)
			return "D1";

		if (! this.tile)
			return null;

		return MiniTilesetConv[this.tile] || "A1";
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
		var tile = "A1";

		if (x_wall || y_wall)
		{
			kind = "wall";
			tile = "C1";
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
