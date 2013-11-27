/**
* User: kimh
* Date: 27/11/13
* Time: 12:21 PM
*/

'use strict';

// --------------------------- INITIALISATION ------------------------------- //
var elements = {
  root: document.getElementById('main-container'),
  header: document.getElementById('header'),
  content: document.getElementById('content'),
  container: document.getElementById('page-container'),
  pages: Array.prototype.constructor.apply(
    null, document.querySelectorAll('.page')
  )
}
var answers = [0,0,0];
var dirty = false;
var maxScroll;
var screenSize = new Rect();

init();

function init()
{
  var options;
  elements.pages.forEach(function(item){
    options = Array.prototype.constructor.apply(
      null,item.querySelectorAll('.options li')
    );
    options.forEach(function(btn){
      btn.addEventListener('click',optionClickHandler,false);
    });
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
  elements.content.style.height = elements.root.clientHeight-78 + 'px';
  maxScroll = elements.content.scrollHeight - elements.content.clientHeight;

  screenSize.width = elements.content.clientWidth;
  screenSize.height = elements.content.clientHeight;
}

// -------------------------- MAIN UPDATE LOOP ------------------------------ //
loop();
function loop()
{
  if(dirty)
  {
    redraw();
    checkDirty();
  }

  _raf(loop);
}

function redraw()
{
  // layout / update stuff here..
}

function checkDirty()
{
  dirty = false;
}
