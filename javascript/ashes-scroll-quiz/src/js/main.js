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
  pages: document.findAll('.page'),
  btns: document.findAll('.options .btn')
}
var answers = [0,0,0];
var dirty = false, pos;
var maxScroll, timeScale = 1;
var screenSize = new Rect();

init();

function init()
{
  Hammer(
    elements.root,{
      drag_max_touches: 1,
      drag_block_horizontal: true,
      drag_lock_to_axis: true
    }
  ).on('touch dragup dragdown swipeup swipedown release',handleTouchEvent);

  elements.scrollBox.addEventListener('scroll',redraw,false);

  elements.scrollBox.addEventListener('click',function(evt){
    var style;
    elements.btns.forEach(function(item){
      style = getComputedStyle(item);
      //log('btn: ' + style.left + ',' + style.top + ', click: ' + evt.pageX + ',' + evt.pageY);
    });
  });

  document.findAll('nav .btn').forEach(function(item){
    item.addEventListener('click', function(evt){
      var t = MainTimeline.getLabelTime('Question' + evt.target.id.match(/[0-9]/)[0]);
      //elements.scrollBox.scrollTop = maxScroll*(t/MainTimeline.totalDuration());
      scrollTo(maxScroll*(t/MainTimeline.totalDuration()));
    })
  });

  if(isTouchEnabled()){
    elements.container.style.left = 0;
    elements.nav.style.right = 0;
  }

  window.addEventListener('resize',onResize,false);
  onResize(null);

  elements.loader.classList.add('hidden');
  elements.container.classList.remove('hidden');
  log('Ready..');
}

function onResize(evt)
{
  redrawPages();
  redrawTweens();
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
    redraw();
    checkDirty();
  }

  _raf(loop);
}
loop();

function redraw(evt)
{
  onTimelineUpdate();

  // layout / update stuff here.. //
  pos = getScrollTime();
  //MainTimeline.tweenTo(pos,{timeScale:2});
  MainTimeline.seek(pos);
}

var lastScrollPos;
function handleTouchEvent(evt)
{
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
      scrollTo(lastScrollPos - evt.gesture.deltaY);
      break;

    case 'swipeup':
      scrollTo(lastScrollPos + 1000);
      evt.gesture.stopDetect();
      break;

    case 'swipedown':
      scrollTo(lastScrollPos - 1000);
      evt.gesture.stopDetect();
      break;

    case 'release':
      break;
  }

  // disable default browser scrolling //
  evt.gesture.preventDefault();
}

function checkDirty()
{
  dirty = false;
}
