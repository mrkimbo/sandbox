/**
 * Created with PhpStorm.
 * User: kimh
 * Date: 16/12/13
 * Time: 3:39 PM
 */

define([],function(){

  var Background = function(game, pitchSize){

    this._pitchSize = pitchSize;
    this._game = game;

    this._bmp = null;
    this._bg = null;
    this._clouds = null;
    this._scoreBg = null;

    this.redraw();
  }

  Background.prototype.redraw = function()
  {
    log(this + '::redraw()');

    // Background //
    if(!this._bmp){
      this._bmp = this._game.add.bitmapData(
        this._game.world.width,this._game.world.height
      );
    }
    this._bmp.clear();
    this._bmp.fillStyle('#70B5E8');
    this._bmp.fillRect(
      0,0,
      this._game.world.width,this._game.world.height-this._pitchSize
    );
    this._bmp.fillStyle('#4A87B3');
    this._bmp.fillRect(
      0,this._game.world.height-this._pitchSize-103,
      this._game.world.width,103
    );
    this._bmp.fillStyle('#769A56');
    this._bmp.fillRect(
      0,this._game.world.height-this._pitchSize,
      this._game.world.width,this._pitchSize
    );

    if(!this._bg)
    {
      this._bg = this._game.add.sprite(0,0);
      this._bmp.add(this._bg);
    }

    // Clouds //
    if(!this._clouds)
    {
      this._clouds = this._game.add.group();
      this._clouds.create(38,0,'sprite').frameName = 'cloud';
      this._clouds.create(446,186,'sprite').frameName = 'cloud';
    }

    if(!this._scoreBg)
    {
      this._scoreBg = this._game.add.sprite(636,-82,'sprite');
      this._scoreBg.frameName = 'cloud';
    }

    // find cloud group height //
    var h = 0;
    this._clouds.forEach(function(item){
      h = Math.max(h,item.y + item.height);
    },this);
    this._clouds.y = ((this._game.world.height-this._pitchSize-103)-h)*.5;
  }

  Background.prototype.toString = function()
  {
    return 'Background';
  }

  return Background;

});