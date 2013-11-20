/**
 * Created with PhpStorm.
 * User: kimh
 * Date: 20/11/13
 * Time: 1:55 PM
 */

var stage, sprite, text;
var dotContainer, dotMask, dotWidth;
var rect, minX, maxX, dir = 1, spd = 4;

function init()
{
  stage = new createjs.Stage('canvas');
  render();
  addListeners();
}

function render()
{
  // -- Sprite //
  var info = {
    images: ["sprite-test.png"],
    frames: [
      [0,0,80,80,0,0,0],[0,80,80,80,0,0,0],[0,160,80,80,0,0,0],
      [80,0,80,80,0,0,0],[160,0,80,80,0,0,0],[80,80,80,80,0,0,0],
      [80,160,80,80,0,0,0]
    ]
  };
  sprite = new createjs.Sprite(
    new createjs.SpriteSheet(info)
  );
  rect = sprite.spriteSheet.getFrameBounds(0);
  sprite.regX = rect.width*.5;
  sprite.x = sprite.regX;
  sprite.y = 15;
  sprite.framerate = 30;

  // -- Text //
  text = new createjs.Text("Click to toggle animation", "20px Arial", "#CC0000");
  text.textBaseline = "alphabetic";
  text.x = 150;
  text.y = 130;

  // -- Dots //
  dotContainer = new createjs.Container();
  dotContainer.x = 150;
  dotContainer.y = 55;

  var num, dot = new createjs.Shape();
  dot.graphics.f("#003300").dc(0,0,10);
  while(num=dotContainer.getNumChildren()+1, num<10)
  {
    dotContainer.addChild(dot.clone()).x = 25*num;
    dotContainer.getChildAt(num-1).setBounds(25*num,0,20,20); // set shape bounds so container can calculate width //
  }
  dotContainer.cache(0,-20,250,40);

  // -- TextMask //
  dotWidth = 250;
  dotMask = new createjs.Shape();
  dotMask.graphics.f("rgba(200,0,0,0.5)").dr(0,0,dotWidth,30);

  dotMask.x = dotContainer.x;
  dotMask.y = dotContainer.y - 15;
  dotContainer.mask = dotMask;
  //  stage.addChild(dotMask);

  // -- Store values and add to stage //
  minX = sprite.regX;
  maxX = stage.canvas.width-sprite.regX;

  stage.addChild(text,dotContainer,sprite);
}

function addListeners()
{
  createjs.Ticker.timingMode = createjs.Ticker.RAF; // default
  createjs.Ticker.addEventListener('tick',updateStage);

  stage.addEventListener('stagemousedown', toggleAnim);
}


// ------------------------------ Handlers ---------------------------------- //
function updateStage(evt)
{
  stage.update(evt);
  moveSprite();
  updateMask();
}

function moveSprite()
{
  if(sprite.paused) return;
  sprite.x += spd*dir;

  if(sprite.x >= maxX)
  {
    dir*=-1;
    sprite.x = maxX;
    sprite.scaleX = dir;
  }
  if(sprite.x <= minX)
  {
    dir*=-1;minX
    sprite.x = minX;
    sprite.scaleX = dir;
  }
}

var cx,mw;
function updateMask()
{
  cx = sprite.x - (5*dir);
  mw = dotWidth - (cx-text.x);
  if(cx >= text.x)
  {
    dotMask.setBounds(0,0,mw,30);
    dotMask.x = text.x + dotWidth - mw;
    //console.log(mw);
  }
}

function toggleAnim(evt)
{
  //sprite.scaleX *= -1;
  sprite.paused = !sprite.paused;
}


// Startup //
init();