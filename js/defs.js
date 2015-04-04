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


// grab the global namespace
var global = this;


// current game mode, can be:
//    loading  (the resources)
//    waiting  (for player to start)
//    active
//    over     (all player characters dead, or victory)
var game_mode = "loading";


// the player entities
var Players;

// the whole world (all the rooms, monsters, items, etc...)
var World;


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
