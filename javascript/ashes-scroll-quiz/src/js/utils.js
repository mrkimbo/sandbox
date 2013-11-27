/**
 * User: kimh
 * Date: 25/11/13
 * Time: 12:47 PM
 */

var prop, style = document.documentElement.style;
var _raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


function getSupportedProp(props)
{
  while(props.length)
  {
    prop = props.pop();
    if(style.hasOwnProperty(prop)) return prop;
  };
  return null;
}

function getTransformProp()
{
  return getSupportedProp(
    [
      'transform', 'MozTransform', 'WebkitTransform',
      'msTransform', 'OTransform'
    ]
  );
}

function optionClickHandler(evt)
{
  var idx = Array.prototype.indexOf.call(
    evt.target.parentNode.children, evt.target
  );
  var page = elements.pages.filter(function(item){
    return item.contains(evt.target);
  });
  log('Clicked option: ' + page[0].id + ' : answer: ' + (idx+1));
}

function getScore()
{
  return answers.reduce(function(prev,curr){
    return prev+curr;
  });
}

function setAnswer(idx,correct)
{
  answers[idx] = correct?1:0;
}
