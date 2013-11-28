/**
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
    var field = document.getElementById('debug-text');
    if(field){
      var i = arguments.length;
      while(i--) field.value += arguments[i] + '\n';
      field.scrollTop = field.scrollHeight;
    }
  }
};

// QuerySelector helpers that automatically return results as arrays
(function(){
  Element.prototype.find = document.find = function(args){
    return this.querySelector.apply(this, arguments);
  };
  Element.prototype.findAll = document.findAll = function(args){
    var r = this.querySelectorAll.apply(this, arguments);
    return r.length ? Array.prototype.constructor.apply(null,r) : [];
  };
})();

