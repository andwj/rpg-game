//
//  ENTITY SYSTEM
//
//  Copyright (c) 2015 Andrew Apted
//
//  under the GNU GPL v3 license
//______________________________________


function player_Init()
{
  Player =
  {
    health: 250,

    sprite:
    {
      ref: "player",
      img_name: "mons/player1.png",
      origin_x: 0.5,
      origin_y: 1.0
    }
  };

  loader_addImage(Player.sprite.ref, Player.sprite.img_name);
}


function entity_Init()
{
  //
  // loads all the images for actors and objects.
  //

  player_Init();
}

