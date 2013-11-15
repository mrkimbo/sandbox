/**
 * User: kimh
 * Date: 14/11/13
 * Time: 12:06 PM
 */

'use strict';

var _raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var scrollDiv = document.getElementById('scroll');
var contentDiv = document.getElementById('content');
var ball = document.getElementById('ball');
var maxscroll = scrollDiv.scrollHeight-scrollDiv.clientHeight;
var pos, diff, v = 0;
var touchPoint = {x:ball.clientWidth *.5,y:ball.clientHeight *.5};
var spd = .01, vx,vy, dx,dy;
var LEFT = -1, RIGHT = 1, UP = -1, DOWN = 1;
var dragging = false;

var ballXY = {width:ball.clientWidth *.5,height:ball.clientHeight *.5};


var log = function(args)
{
  if(window.console && window.console.log)
  {
    console.log.apply(console,arguments);
  }
}

// Add content scrollwheel listener to update scrolldiv position //
contentDiv.addEventListener('mousewheel',onContentScroll,false);
function onContentScroll(evt)
{
  spd = .01;
  scrollDiv.scrollTop -= evt.wheelDelta*.5;
}

/*Hammer(contentDiv,{
  drag_max_touches: 1,
  drag_block_vertical: true,
  drag_lock_to_axis: true
}).on(
  //'touch release dragleft dragright swipeleft swiperight',
  'swipeleft swiperight', handleSwipe
);*/

Hammer(ball,{
  drag_max_touches: 1//,
  //drag_block_horizontal: true,
  //drag_lock_to_axis: true
}).on(
  'touch drag dragend', handleDrag
);

function handleSwipe(evt)
{
  //log('touch: '+evt.type);
  spd = .01;
  switch(evt.type)
  {
    case 'swipeleft':
      scrollDiv.scrollTop += 1000;
      break;

    case 'swiperight':
      scrollDiv.scrollTop -= 1000;
      break;
  }
}

function handleDrag(evt)
{
  //log('touch: '+evt.type);
  if(!evt.gesture) return;

  evt.gesture.preventDefault();

  spd = .01;
  switch(evt.type)
  {
    case 'touch':
      dragging = true;
      vx = vy = 0;
      break;

    case 'drag':
      dx = evt.gesture.srcEvent.pageX > touchPoint.x ? RIGHT : LEFT;
      dy = evt.gesture.srcEvent.pageY > touchPoint.y ? DOWN : UP;
      vx = vy = 0;
      touchPoint.x = evt.gesture.srcEvent.pageX;
      touchPoint.y = evt.gesture.srcEvent.pageY;
      break;

    case 'dragend':
      dragging = false;
      vx = evt.gesture.velocityX * dx;
      vy = evt.gesture.velocityY * dy;

      log('Throw - direction: ' +
        (dy == DOWN ? 'S' : 'N') + (dx == RIGHT ? 'E' : 'W') +
        ', velocity: ' + vx.toFixed(3) + ',' + vy.toFixed(3)
      );

      break;
  }
  _raf(update);
}


// Add scroll listener to trigger redraws //
scrollDiv.onscroll = function(){
  _raf(update);
}

update();

function update()
{
  pos = scrollDiv.scrollTop/maxscroll;
  if(Math.abs(pos-v)<.0001) v = pos;
  if(v!=pos)
  {
    v += (pos-v)*spd;
  }

  //log('update: ' + v.toFixed(3) + ',' + pos);
  document.querySelector('#s1 .bg').style.backgroundPosition = (v*650) + '% 0%';
  document.querySelector('#s1 .mountain').style.backgroundPosition = -(v*500) + '% 0%';

  if(!dragging && Math.abs(vx)+Math.abs(vy)>0)
  {
    //log(vx,vy);
    touchPoint.x += 20*vx;
    touchPoint.y += 20*vy;
    vx*=.98
    vy*=.98;
    if(Math.abs(vx)<.01) vx = 0;
    if(Math.abs(vy)<.01) vy = 0;

    constrainBall();
  }

  ball.style.left = touchPoint.x-ballXY.width + 'px';
  ball.style.top =  touchPoint.y-ballXY.height + 'px';

  //scrollDiv.scrollTop ++;//

  if(v!=pos || (Math.abs(vx)+Math.abs(vy))>0) _raf(update);
}

function constrainBall()
{
  if(touchPoint.x < ballXY.width){
    touchPoint.x = ballXY.width;
    vx*=-1;
  }
  if(touchPoint.x > contentDiv.clientWidth-ballXY.width){
    touchPoint.x = contentDiv.clientWidth-ballXY.width;
    vx*=-1;
  }
  if(touchPoint.y < ballXY.height){
    touchPoint.y = ballXY.height;
    vy*=-1;
  }
  if(touchPoint.y > contentDiv.clientHeight-ballXY.height){
    touchPoint.y = contentDiv.clientHeight-ballXY.height;
    vy*=-1;
  }
}

// ball click //
ball.onclick = function()
{
  //spd = .04;
  //scrollDiv.scrollTop = Math.round(Math.random()*maxscroll);
}

