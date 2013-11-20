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
var bg = document.querySelector('#content .bg');
var mountain = document.querySelector('#content .mountain');

var maxscroll = scrollDiv.scrollHeight-scrollDiv.clientHeight;
var pos, diff, v = 0;
var touchPoint = {x:ball.clientWidth *.5,y:ball.clientHeight *.5};
var spd = .01, vx =0,vy = 0, dx = 0,dy = 0;
var LEFT = -1, RIGHT = 1, UP = -1, DOWN = 1;
var dragging = false;

var ballXY = {width:ball.clientWidth *.5,height:ball.clientHeight *.5};
var scrollDest = -1, scrollDiff = 0;
var dirty = true;

var ballPath = [
  {x:0,y:0,scale:1},{x:143,y:-67,scale:1},{x:314,y:-11,scale:1},
  {x:479,y:-33,scale:1},{x:725,y:-92,scale:1},{x:914,y:-23,scale:1},
  {x:996,y:-22,scale:1},{x:1091,y:-61,scale:1},{x:1161,y:-52,scale:1},
  {x:1405,y:-93,scale:1},{x:1679,y:0,scale:0}
];
var tween = TweenMax.to(ball, 100, {
  bezier: { values:ballPath, autoRotate:false },
  rotationX: 359,
  paused: true,
  ease: Linear.easeNone
});
tween.progress(0);


var log = function(args)
{
  if(window.console && window.console.log)
  {
    console.log.apply(console,arguments);
  }
}

document.getElementById('nav').addEventListener('click',onNavClick);

function onNavClick(evt)
{
  var id = evt.target.id.substr(-1);
  scrollDest = Math.min(
    parseInt(getComputedStyle(document.getElementById('s' + id)).top.replace(/px$/,'')) - (screen.availHeight*.3),
    maxscroll
  );
  dirty = true;
}

// Add content scrollwheel listener to update scrolldiv position //
contentDiv.addEventListener('mousewheel',onContentScroll,false);
function onContentScroll(evt)
{
  spd = .01;
  scrollDest = scrollDiv.scrollTop - (evt.wheelDelta*.5);
  dirty = true;
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
      //scrollDiv.scrollTop += 1000;
      scrollDest = scrollDiv.scrollTop + 1000;
      break;

    case 'swiperight':
      //scrollDiv.scrollTop -= 1000;
      scrollDest = scrollDiv.scrollTop - 1000;
      break;
  }
  dirty = true;
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
  dirty = true;
}


// Add scroll listener to trigger redraws //
scrollDiv.onscroll = function(){
  dirty = true;
}

update();

function update()
{
  if(!dirty){
    _raf(update);
    return;
  }

  if(scrollDest != -1)
  {
    scrollDiff = scrollDest-scrollDiv.scrollTop;
    if(Math.abs(scrollDiff)<=1) {
      scrollDiv.scrollTop = scrollDest;
      scrollDest = -1;
    }
    if(Math.abs(scrollDiff) > 0)
    {
      scrollDiv.scrollTop += scrollDiff > 0 ?
        Math.ceil(scrollDiff *.05) : Math.floor(scrollDiff *.05);
      //log('scrolldiff: ' + scrollDiff);
    }
  }

  v = scrollDiv.scrollTop/maxscroll;
  //log('update: ' + v.toFixed(3) + ',' + pos);
  bg.style.backgroundPosition = (10000*v) + '% 0%';
  //mountain.style.backgroundPosition = -(5000*v) + '% 0%';

  if(!dragging && Math.abs(vx)+Math.abs(vy)>0)
  {
    //log(vx,vy);
    touchPoint.x += 20*vx;
    touchPoint.y += 20*vy;
    vx*=.9
    vy*=.9;
    if(Math.abs(vx)<.01) vx = 0;
    if(Math.abs(vy)<.01) vy = 0;

    constrainBall();
  }

  //ball.style.left = touchPoint.x-ballXY.width + 'px';
  //ball.style.top =  touchPoint.y-ballXY.height + 'px';

  tween.progress(v);

  if((Math.abs(vx)+Math.abs(vy))+Math.abs(scrollDiff) == 0)
  {
    dirty = false;
  }

  _raf(update);
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

