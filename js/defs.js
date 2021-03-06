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


// current game state, can be:
//    init     : initializing
//    loading  : loading the resources
//    waiting  : waiting for player to start game
//    active   : game in progress
//    over     : victory or defeat
//    saved	   : game was saved (no longer playing)
var game_state = "init";


// the player entities
var Players;


// the whole world (all the rooms, monsters, items, etc...)
var World;


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
