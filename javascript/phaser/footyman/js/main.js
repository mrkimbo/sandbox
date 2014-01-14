/**
 * Created with PhpStorm.
 * User: kimh
 * Date: 16/12/13
 * Time: 3:39 PM
 */

'use strict';

require.config({

  baseUrl: 'js/app',
  paths: {
    'img': '../img/'
  }

});

require(['game','scoreboard','config'],function(Game,ScoreBoard,config){

  var game = window.game = config.game = new Game();
  game.init(config);

  var scoreboard = new ScoreBoard(config.maxLives);

});