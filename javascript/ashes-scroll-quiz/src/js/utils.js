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

function isTouchEnabled()
{
  return !!('ontouchstart' in window);
}


// ---------------------------- SCORE HANDLING ------------------------------ //
function optionClickHandler(evt)
{
  var idx = Array.prototype.indexOf.call(
    evt.target.parentNode.children, evt.target
  );
  var page = elements.pages.filter(function(item){
    return item.contains(evt.target);
  });

  //log('Clicked option: ' + page[0].id + ' : answer: ' + (idx+1));
  setAnswer(
    parseInt(page[0].id.substr(-1)),
    evt.target.getAttribute('data-correct')=='1'
  );

  exitQuestion();
  scrollToQuestion(Math.min(getCurrentPage()+1,elements.pages.length));
}

function getScore()
{
  return answers.reduce(function(prev,curr){
    return prev+curr;
  });
}

function setAnswer(idx,correct)
{
  log('setAnswer(' + idx + ',' + correct + ')');
  answers[idx] = correct?1:0;
}

// --------------------------------- TIMER  --------------------------------- //
var tStart,t,totalTime;
function resetTimer()
{
  totalTime = 0;
}
function startTimer()
{
  tStart = new Date().getTime();
  timerRunning = dirty = true;
  elements.timer.classList.add('active');
}
function tick()
{
  t = new Date().getTime();
  totalTime += t-tStart;
  tStart = t;
  redrawTimer();
}
function pauseTimer()
{
  timerRunning = false;
  elements.timer.classList.remove('active');
}

var m,s,ms,r;
function getTimeString()
{
  r = totalTime;
  m = Math.floor(totalTime/60000);
  r%=60000;
  s = Math.floor(totalTime/1000);
  r%=1000;
  ms = Math.round(r/1000*100);
  return padNum(m) + ':' + padNum(s) + ':' + padNum(ms);
}
function padNum(n)
{
  return n.toString().length<2 ? '0' + n.toString() : n.toString();
}

// ----------------------------- QUESTION STATE ----------------------------- //
function enterQuestion()
{
  scrollEnabled = false;

  elements.btns.forEach(function(el){
    el.classList.remove('disabled');
  });

  // don't start timer when arriving at last page //
  if(getCurrentPage()<elements.pages.length){
    startTimer();
  }
}
function exitQuestion()
{
  pauseTimer();

  scrollEnabled = true;

  elements.btns.forEach(function(el){
    el.classList.add('disabled');
  });

  // set score //
  redrawScores();
}

