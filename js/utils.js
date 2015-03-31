//
//  UTILITY FUNCTIONS
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________

"use strict";


//
// Break the string into words, returning the array of words.
// The returned array may be empty.
//
var token_regexp = /\S+/g;

function util_Tokenize(str)
{
	var words = str.match(token_regexp);

	if (words)
		return words;

	return [];
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab
