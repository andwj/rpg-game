
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
*  no separate levels, the dungeon is one large playfield
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

*  get basic code structure in place [DONE]
*  sort out the tileset [DONE]
*  title screen, press a key to start [DONE]
*  code to draw the text panel and add text to it [DONE]
*  code to create a single room with player in it [DONE]
*  code to render this map [DONE]
*  allow player to move around the room with arrow keys [DONE]


Milestone 2
-----------

*  scroll map when needed (radar too)
*  create larger map (60x60 tiles), multiple rooms, corridors
*  draw some player stats (health, armor, gold, strength, wisdom)
*  create a monster, have it move around
*  monster can attack player and vice versa, can die
*  ability for player to die
*  decorative entities (drawn on corner of tiles)


Milestone 3
-----------

*  press '/' key to type in a command (e.g. yellow text)
*  create a simple object, add to map, get it drawn
*  ability to 'g' get an object
*  inventory screen, highlight a current object, scrolling
*  have small menu on inventory : 'd' drop, 'u' use, 'g' give, 't' throw
   'w' wear, 'o' take off, etc....  [ woah too many! ]


