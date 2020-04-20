// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture, frame, pointValue)
    {
        super(scene, x, y, texture, frame);
                
        scene.add.existing(this); // add object to existing scene, displayList, updateList
        this.points = pointValue;
    }

    update()
    {
      // move spaceship left
      
      if (keyQ.isDown)
          {
              ship01move = true;

          } else if (keyW.isDown)
          {
              ship02move = true;
           
          } else if (keyE.isDown)
          {
              ship03move = true;
            
          }
        if (this.y == 132)
        {
            if(ship01move)
            {
                this.x -= game.settings.spaceshipSpeed;
            }
        } else if(this.y == 196)
        {
            if(ship02move)
            {
                this.x -= game.settings.spaceshipSpeed;
            }
        }else if(this.y == 260)
        {
            if(ship03move)
            {
                this.x -= game.settings.spaceshipSpeed;
            }
        }
      
      // award p2 points
      if(this.x <= 0 - this.width)
      {
          if (this.y == 132)
          {
            p2Score += 3;         
            this.reset();
          } else if (this.y == 196)
          {
            p2Score += 5;           
            this.reset();
          } else if (this.y == 260)
          {
            p2Score += 10;
            this.reset();
          }
          //Play.updateScores();
      }
    }

    reset()
    {
        this.x = game.config.width;
        if (this.y == 132)
        {
            ship01move = false;
        } else if(this.y == 196)
        {
            ship02move = false;
        }else if(this.y == 260)
        {
            ship03move = false;
        }
    }
}