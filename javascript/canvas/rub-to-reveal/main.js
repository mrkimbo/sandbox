/**
 * Created with JetBrains PhpStorm.
 * User: kimh
 * Date: 15/10/13
 * Time: 12:23 PM
 */

var canvas, logEl, stage;
var drawing, mousePos, lastPos;
var imgData, img, tImg;

var touchSize = 60;
var touchSupported = !!('ontouchstart' in window);
var Point = function(x,y){ this.x = x||0; this.y = y||0; }

init();

function init()
{
  canvas = document.querySelector('#canvas');
  logEl = document.querySelector('#log');
  stage = canvas.getContext('2d');

  drawing = false;
  mousePos = new Point();
  lastPos = new Point();

  stage.strokeStyle = '#FFFFFF';
  stage.lineWidth = touchSize;
  stage.lineCap = 'round';
  stage.lineJoin = 'round';
  canvas.onselectstart = function(){ return false; }

  log('touchSupported: ' + touchSupported);

  render();
}

function onTextureLoad(evt)
{
  document.querySelector('.container img').style.display = 'block';
  reset();
  addListeners();
}

function onTextureFail(evt)
{
  log('Load failed');
}

function render()
{
  img = new Image();
  img.onload = onTextureLoad;
  img.onerror = onTextureFail;
  img.src = 'img1.jpg';

  /*tImg = new Image();
  tImg.onload = update;
  tImg.src = '';
  document.body.insertBefore(tImg,document.querySelector('#reset'));*/
}

function addListeners()
{
  canvas.addEventListener(evtName('down'), mousedown);
  canvas.addEventListener(evtName('up'), mouseup);

  document.getElementById('reset').addEventListener(evtName('up'), reset);
}

function mousedown(evt)
{
  if(drawing) return;

  drawing = true;
  stage.beginPath();
  lastPos.x = parseInt(evt.clientX-10);
  lastPos.y = parseInt(evt.clientY-10);

  canvas.addEventListener(evtName('move'), mousemove);
}
function mousemove(evt)
{
  evt.preventDefault();

  if(evt.hasOwnProperty('touches')) evt = evt.touches[0];

  mousePos.x = parseInt(evt.clientX);
  mousePos.y = parseInt(evt.clientY);

  // draw line //
  stage.save();
  stage.globalCompositeOperation = 'destination-out';
  stage.globalAlpha = 1;
  stage.arcTo(lastPos.x, lastPos.y, mousePos.x,mousePos.y, 10);
  stage.stroke();
  stage.restore();

  // snag image data and redraw it to stage with a dropshadow //
  // DOESN'T WORK - dropshadow isn't added to image data //
//  stage.save();
  //imgData = stage.getImageData(0,0,stage.canvas.width,stage.canvas.height);
//  stage.globalCompositeOperation = 'source-over';
//  stage.clearRect(0,0,imgData.width,imgData.height);
//  stage.shadowColor = "black";
//  stage.shadowOffsetX = -2
//  stage.shadowOffsetY = -2;
//  stage.shadowBlur = 1;
//  stage.putImageData(imgData,0,0);
//  stage.restore();

 /*
  // draw image data to image object and then redraw back to screen on
  // img load.

  // IMPRACTICAL - redraw is too slow to give fast updates. Drawing is jerky.
  imgData = canvas.toDataURL();
  tImg.src = imgData;
  */

  // Draw same line again on top, but with transparency and dropshadow. //
  // BEST SOLUTION. - down side is that you need some white in the line or
  // nothing will be seen.
  /*stage.save();
  stage.globalCompositeOperation = 'source-over';
  stage.shadowColor = "black";
  stage.shadowOffsetX = -2
  stage.shadowOffsetY = -2;
  stage.shadowBlur = 0;
  stage.globalAlpha = 0.1;
  stage.arcTo(lastPos.x, lastPos.y, mousePos.x,mousePos.y, 10);
  stage.stroke();
  stage.restore();*/

  lastPos = mousePos;
}
function mouseup()
{
  drawing = false;
  stage.closePath();

  canvas.removeEventListener(evtName('move'), mousemove);
}

function update()
{
 /* stage.globalCompositeOperation = 'source-over';
  stage.clearRect(0,0,stage.canvas.width,stage.canvas.height);
  stage.shadowColor = "black";
  stage.shadowOffsetX = -5;
  stage.shadowOffsetY = -5;
  stage.shadowBlur = 0;
  stage.drawImage(tImg,0,0);*/
  //requestAnimationFrame(update);
}

function reset()
{
  //log('reset()');
  stage.globalCompositeOperation = 'source-over';
  stage.clearRect(0,0,stage.canvas.width,stage.canvas.height);
  stage.drawImage(img,0,0);
  stage.globalCompositeOperation = 'destination-out';
}

function evtName(evt)
{
  switch(evt.toLowerCase())
  {
    case 'down': return touchSupported ? 'touchstart' : 'mousedown';
    case 'move': return touchSupported ? 'touchmove' : 'mousemove';
    case 'up': return touchSupported ? 'touchend' : 'mouseup';
  }
}

function log(msg)
{
  logEl.value += msg + '\n';
  logEl.scrollTop = logEl.scrollHeight-logEl.clientHeight;
}