/**
* User: kimh
* Date: 27/11/13
* Time: 12:21 PM
*/

'use strict';

// --------------------------- INITIALISATION ------------------------------- //
var elements = {
  root: document.find('#main-container'),
  header: document.find('#header'),
  scrollBox: document.find('#scroll-box'),
  scroll: document.find('#scroll'),
  container: document.find('#page-container'),
  pages: document.findAll('.page'),
  btns: document.findAll('.options .btn')
}
var answers = [0,0,0];
var dirty = false, pos;
var maxScroll;
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
    //log(evt);
    var style;
    elements.btns.forEach(function(item){
      style = getComputedStyle(item);
      //log('btn: ' + style.left + ',' + style.top + ', click: ' + evt.pageX + ',' + evt.pageY);
    });
  });

  document.findAll('nav .btn').forEach(function(item){
    item.addEventListener('click', function(evt){
      log('click');
      var t = MainTimeline.getLabelTime('Page' + evt.target.id.match(/[0-9]/)[0]);
      scrollTo(maxScroll*(t/MainTimeline.totalTime()));
    })
  });


  window.addEventListener('resize',onResize,false);
  onResize(null);
}

function onResize(evt)
{
  redrawPages();
  redrawTweens();
}

function redrawPages()
{
  elements.scrollBox.style.height = elements.root.clientHeight-78 + 'px';
  maxScroll = elements.scrollBox.scrollHeight - elements.scrollBox.clientHeight;

  screenSize.width = elements.scrollBox.clientWidth;
  screenSize.height = elements.scrollBox.clientHeight;
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
  // layout / update stuff here.. //
  pos = getScrollTime();
  MainTimeline.tweenTo(pos,{timeScale:1});
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
