/**
 * Created with PhpStorm.
 * User: kimh
 * Date: 25/11/13
 * Time: 12:47 PM
 */

var prop, style = document.documentElement.style;
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

function easeOutIn(t, b, c, d)
{
  t/=d/2;
  return c/2*(--t*t*t*t*t+1) + b;
}