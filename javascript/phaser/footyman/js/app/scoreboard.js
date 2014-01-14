/**
 * Created with PhpStorm.
 * User: kimh
 * Date: 17/12/13
 * Time: 4:50 PM
 */

define([],function(){

  var ScoreBoard = function(maxLives, targetGoals)
  {
    this._lives = maxLives;
    this._targetGoals = targetGoals;
    this._goals = 0;
  }

  ScoreBoard.Events = {
    WIN: 'ScoreBoard:win',
    LOSE: 'ScoreBoard:lose'
  }

  ScoreBoard.prototype.loseLife = function()
  {
    this._lives--;
    this._update();
  }

  ScoreBoard.prototype.addGoal = function()
  {
    this._targetGoals++;
  }

  ScoreBoard.prototype._update = function()
  {

  }

  ScoreBoard.prototype.toString = function()
  {
    return 'ScoreBoard';
  }

  EventDispatcher.init(ScoreBoard);
  return ScoreBoard;

});