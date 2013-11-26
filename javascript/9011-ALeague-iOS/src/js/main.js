/**
 * User: kimh
 * Date: 22/11/13
 * Time: 2:40 PM
 */

'use strict';

var idx = 0, totalPages = 4, offscreenX = -150;
var page, container, content, mainDiv, soccerman, ball;
var screenW;
var tabTimeout, transformProp;
var frame = 1, runAnim, bounce, ballTimeline, introTimeline;

var kickDelay = 2000;
var kickTimeout = -1;

var _raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function init()
{
  mainDiv = document.getElementById('content');
  container = document.getElementById('page-container');
  content = document.getElementById('content-container');
  soccerman = document.getElementById('soccerman');
  ball = document.getElementById('ball');

  TweenLite.set(soccerman,{x:offscreenX});
  TweenLite.set(ball,{x:offscreenX});

  ballTimeline = new TimelineMax({
    onComplete: soccerAnimComplete,
    paused: true
  });
  introTimeline = new TimelineMax({paused: true});
  bounce = new TimelineLite({
    onComplete: function(){ this.restart() }
  });

  window.addEventListener('resize',onResize,false);
  onResize(null);

  createTweens();

  soccerman.className = 'idle';
  ball.className = '';

  container.className = content.className = container.className.replace(/\s?hidden\s?/,'');
  tabTimeout = setTimeout(animatePageTabs,3000);

  onTransitionEnd();
}

function onResize(evt)
{
  screenW = mainDiv.clientWidth;
  redrawPages();
  redrawTweens();
}

function animatePageTabs()
{
  var tab = currentPage().querySelector('.page-tab');
  tab.style.backgroundPosition =
    (getComputedStyle(tab).backgroundPosition.substr(0,4) == '100%') ?
    '0% 0' : '100% 0';

  tabTimeout = setTimeout(animatePageTabs,3000);
}

function currentPage()
{
  return document.getElementById('page' + (idx+1));
}

function onTransitionEnd()
{
  var p = parseInt(container.style[transformProp].match(/\(-?([0-9]+?)px/)[1]) % page.width;
  if(p>0) return;

  log('onTransitionEnd');
  container.removeEventListener('webkitTransitionEnd',onTransitionEnd,false);

  bounce.restart();
  runAnim.restart();
  introTimeline.restart();

  kickTimeout = setTimeout(kick, kickDelay);
}

function updateSprite()
{
  //log('updateSprite:',frame);
  soccerman.className = 'run' + frame;
}

function kick()
{
  bounce.pause();
  soccerman.className = 'kick';
  ballTimeline.play();
}

function soccerAnimComplete()
{
  log('soccerAnimComplete');
  if(kickTimeout!=-1) clearTimeout(kickTimeout);
  ballTimeline.seek(0);
  ballTimeline.pause();
  runAnim.seek(0);
  runAnim.pause();
  soccerman.className = 'idle';
  bounce.restart();

  introTimeline.pause();
  introTimeline.seek(0);

  TweenLite.set(soccerman,{x:offscreenX});
  TweenLite.set(ball,{x:offscreenX});
}

function updateSprite()
{
  //log('updateSprite:',frame);
  soccerman.className = 'run' + frame;
}

function interruptAnim()
{
  if(!ballTimeline.paused() || !introTimeline.paused())
  {
    soccerAnimComplete();
  }
}

