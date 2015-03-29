
RPG Game
========

This is the beginnings of a graphical rogue-like game.

It will run in the browser, via HTML5/canvas and javascript.
It is also planned to have a "native" version (a C or C++ binary which
opens a window and renders the graphics).

The license is GNU GPL v3 (or any later version).

Planned stuff which will set it apart from other rogue-likes:

*  control a party of several characters
*  try to avoid "yet another stupid death" syndrome
*  better NPC characters, chatting, trading of items
*  no separate levels, the dungeon is one large playfield (e.g. 50 tiles across but 1000 tiles high)
*  ability to type complex commands, like in text adventures
*  no need to identify objects


Author
------

Andrew Apted


Artwork
-------

Main tileset was made by Jerom (user of OpenGameArt.org), which is licensed
under the CC-BY-SA 3.0 license.
Link: http://opengameart.org/content/32x32-fantasy-tileset

The tileset was colorized (no mean feat!) by PriorBlue (user of OpenGameArt.org).
Link: http://opengameart.org/content/recolor-all-the-items

I have merely repacked the colored tiles into a tileset and made some
minor edits.


Milestone 1
-----------

*  get basic code structure in place
*  repack the tileset into two images: one for the items, one for everything else
*  code to create a single room with player in it
*  code to render this map
*  code to render a minimap
*  code to draw the text panel and add text to it
*  allow player to move around the room with arrow keys
*  title screen, press a key to start
*  death screen 

