/**
 * Created with PhpStorm.
 * User: kimh
 * Date: 16/12/13
 * Time: 4:07 PM
 */

define(['background'],function(Background){

  var Game = function()
  {
    this._instance = null;
    this._background = null;
    this._goal = null;
    this._goalie = null;
    this._clouds = null;
    this._config = null;

    this._landscapeScreen = null;
  }

  Game.prototype = {

    init: function(config)
    {
      this._config = config;
      log(this + '::init()');

      var self = this;

      this._instance = new Phaser.Game(768, 938, Phaser.CANVAS, '', {
        preload: function(){self.loadAssets.call(self);}, // initial preload
        loadUpdate: function(){self.onLoadProgress.call(self);}, // load progress updates
        create: function(){self.render.call(self);}, // initial render
        update: function(){self.update.call(self);} // pre-redraw
        //,render: function(){self.showDebug.call(self);} // post-redraw
      });
    },

    loadAssets: function()
    {
      this._instance.load.atlas(
        'sprite','img/beat-the-goalie.png','img/beat-the-goalie.json'
      );
      this._instance.load.image('landscape','img/landscape.png');
    },
    onLoadProgress: function()
    {
      log(this + '::onLoadProgress(' + this._instance.load.progress + ')');
    },
    render: function()
    {
      log(this + '::render()');

      //this._instance.stage.canvas.style['width'] = '100%';
      //this._instance.stage.canvas.style['height'] = '100%';

      this._landscapeScreen = this._instance.add.sprite(0,0,'landscape');
      this._landscapeScreen.exists = this._instance.stage.scale.isLandscape;

      log(this._instance.stage.scale.isLandscape);

      // Background //
      this._background = new Background(
        this._instance,this._config.pitchSize
      );

      // Goal //
      this._goal = this._instance.add.sprite(
        27,this._instance.world.height-this._config.pitchSize,
        'sprite'
      );
      this._goal.frameName = 'goal';
      this._goal.y -= this._goal.height - 47;

      // Goalie //
      this._goalie = this._instance.add.sprite(
        this._instance.world.centerX, this._goal.y + this._goal.height,
        'sprite'
      );
      this._goalie.frameName = 'dude';
      this._goalie.y -= this._goalie.height - 21;
      this._goalie.anchor.setTo(.5,0);

      this.addListeners();
    },
    redraw: function()
    {
      this._background.redraw();
      this._goal.y = this._instance.world.height-this._config.pitchSize-
        (this._goal.height-47);
      this._goalie.y = this._goal.y + this._goal.height -
        (this._goalie.height-21);
    },
    update: function()
    {

    },
    showDebug: function()
    {
      this._instance.debug.renderWorldTransformInfo(
        this._goalie,10,10,'#FFFFFF'
      );
    },

    addListeners: function()
    {
      log('addListeners()');
      this._instance.stage.scaleMode = Phaser.StageScaleMode.NO_SCALE;

      this._instance.stage.scale.enterPortrait.add(this.onOrientationChange,this);
      this._instance.stage.scale.enterLandscape.add(this.onOrientationChange,this);
    },

    onOrientationChange: function(orientation, isLandscape, isPortrait)
    {
      this._landscapeScreen.exists = isLandscape;
    },

    toString: function()
    {
      return 'Game';
    }

  }

  EventDispatcher.init(Game);
  return Game;

});
