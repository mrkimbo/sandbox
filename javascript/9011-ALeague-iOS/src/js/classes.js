/**
 * Created with PhpStorm.
 * User: kimh
 * Date: 22/11/13
 * Time: 4:56 PM
 */

var Rect = function(w,h)
{
  this.width = w||0;
  this.height = h||0;
}
Rect.prototype.clone = function()
{
  return new Rect(this.width,this.height);
}

var Point = function(x,y)
{
  this.x = x||0;
  this.y = y||0;
}
Point.prototype.clone = function()
{
  return new Rect(this.x,this.y);
}

var log = function(args)
{
  if(window.console && window.console.log)
  {
    console.log.apply(console,arguments);
  }
}