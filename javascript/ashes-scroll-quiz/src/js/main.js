/**
* User: kimh
* Date: 27/11/13
* Time: 12:21 PM
*/

'use strict';

// --------------------------- INITIALISATION ------------------------------- //
var elements = {
  root: document.find('#main-container'),
  loader: document.find('#loader'),
  header: document.find('#header'),
  scrollBox: document.find('#scroll-box'),
  scroll: document.find('#scroll'),
  container: document.find('#page-container'),
  nav: document.find('nav'),
  score: document.find('#score'),
  timer: document.find('#timer'),
  results: {
    score: document.find('#page4 .results .title'),
    timer: document.find('#page4 .results .time'),
    prize: document.find('#page4 .value')
  },
  pages: document.findAll('.page'),
  btns: document.findAll('.options .btn'),
  ctaBtn: document.find('.cta .btn')
}
var answers = [0,0,0];
var prizes = ['$10','$10','$100','$500'];
var dirty = false, pos;
var maxScroll, timeScale = 1;
var screenSize = new Rect();
var timerRunning = false;

init();

function init()
{
  window.scrollEnabled = true;

  Hammer(
    elements.root,{
      drag_max_touches: 1,
      drag_block_horizontal: true,
      drag_lock_to_axis: true
    }
  ).on('touch dragup dragdown swipeup swipedown release',handleTouchEvent);

  elements.scrollBox.addEventListener('scroll',redraw,false);

  // Wire up side-nav buttons //
  /*document.findAll('nav .btn').forEach(function(item){
    item.addEventListener('click', function(evt){
      if(!scrollEnabled) return;
      scrollToQuestion(evt.target.id.match(/[0-9]/)[0]);
    })
  });*/

  // Wire up question buttons //
  elements.btns.forEach(function(item){
    item.addEventListener('click',optionClickHandler,false);
  });

  // Wire up CTA btn //
  elements.ctaBtn.addEventListener('click', ctaClickHandler, false);

  if(isTouchEnabled()){
    elements.container.style.left = 0;
    elements.nav.style.right = 0;
  }

  window.addEventListener('resize',onResize,false);
  onResize(null);

  // hide loader and show page container //
  elements.loader.classList.add('hidden');
  elements.container.classList.remove('hidden');

  // remove loading state //
  elements.root.classList.remove('loading');

  resetTimer();
  snapToQuestion();
  redrawScores();
  redrawTimer();

  log('Ready..');
}

function onResize(evt)
{
  redrawPages();
  redrawTweens();
  onTimelineUpdate();
}

function redrawPages()
{
  var el;
  elements.scrollBox.style.height = elements.root.clientHeight-78 + 'px';
  maxScroll = elements.scrollBox.scrollHeight - elements.scrollBox.clientHeight;

  screenSize.width = elements.scrollBox.clientWidth;
  screenSize.height = elements.scrollBox.clientHeight;

  // align dude options //
  el = elements.pages[2].find('.options');
  TweenLite.set(el,{x:(screenSize.width-1008)*.5});

  // align ball //
  el = elements.pages[1].find('.cricket-ball');
  TweenLite.set(el,{
    x:(screenSize.width *.5)-100,
    y:screenSize.height + 100}
  );
}

// -------------------------- MAIN UPDATE LOOP ------------------------------ //
function loop()
{
  if(dirty)
  {
    tick();
    checkDirty();
  }

  _raf(loop);
}
loop();

function redraw(evt)
{
  // layout / update stuff here.. //
  pos = getScrollTime();
  MainTimeline.seek(pos);
  onTimelineUpdate();
}
function redrawScores()
{
  // update html to reflect score //
  elements.score.textContent = elements.results.score.textContent =
    getScore().toString() + '/' + (elements.pages.length-1).toString();

  elements.results.prize.textContent = prizes[getScore()];
}

function redrawTimer()
{
  elements.timer.textContent =
    elements.results.timer.textContent = getTimeString();
}

var lastScrollPos;
function handleTouchEvent(evt)
{
  if(!scrollEnabled) return;

  //log(evt.type);
  switch(evt.type)
  {
    case 'touch':
      if(evt.target instanceof HTMLButtonElement){
        return;
      }

      lastScrollPos = elements.scrollBox.scrollTop;
      break;

    case 'dragup':
    case 'dragdown':
      if(scrollTween) scrollTween.kill();
      elements.scrollBox.scrollTop = (lastScrollPos - evt.gesture.deltaY);
      break;

    case 'swipeup':
      var q = Math.min(elements.pages.length,getCurrentPage()+1);
      scrollToQuestion(q);
      evt.gesture.stopDetect();
      break;

    case 'swipedown':
      var q = Math.max(1,getCurrentPage()-1);
      scrollToQuestion(q);
      evt.gesture.stopDetect();
      break;

    case 'release':
      // snap to question points /
      snapToQuestion();
      break;
  }

  // disable default browser scrolling //
  evt.gesture.preventDefault();
}

function checkDirty()
{
  dirty = timerRunning;
}

function ctaClickHandler()
{
  alert('CTA Button clicked');
}

// ScrollEnabled property to enable/disable scroll interaction //
var _scrollEnabled = true;
Object.defineProperty(window,'scrollEnabled',{
  set: function(b){
    _scrollEnabled = b;
    if(b){
      elements.scrollBox.classList.remove('disabled');
    } else {
      elements.scrollBox.classList.add('disabled');
    }
  },
  get: function(){
    return _scrollEnabled;
  }
});
