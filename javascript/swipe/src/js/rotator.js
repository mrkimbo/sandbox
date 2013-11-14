/**
 * Created with JetBrains PhpStorm.
 * User: kimh
 * Date: 12/09/13
 * Time: 11:22 AM
 */

/**
 * Basic event carousel.
 * Note:
 * The carousel does not retain data references.
 * Data is discarded once the page views have been created.
 *
 * @param {HTMLElement} containerElement
 * @param {string} pageTemplateId
 * @constructor
 */
var Rotator = function(containerElement, pageTemplateId, isMobile)
{
  this._template  = document.getElementById(pageTemplateId).innerHTML;
  this._container = containerElement;

  // defaults //
  this._onePerPage  = true;
  this._pageDelay   = 2000;
  this._isMobile    = isMobile === true;

  EventDispatcher.init(this);

  // Create public accessors for internal properties //
  Object.defineProperties(this, {
    pages: {
      get: function(){ return this._pages; }
    },
    results: {
      get: function(){ return this._results; }
    },
    pageIndex: {
      get: function(){ return this._index; }
    },
    isPaused: {
      get: function(){ return this._paused; }
    }
  });
}

/** @const {number} */
Rotator.LEFT = 0;
/** @const {number} */
Rotator.RIGHT = 1;
/** @const {string} */
Rotator.ALIGN = 'TOP'; // accepted values: TOP,MIDDLE,BOTTOM

/** @const @type {string}*/
Rotator.CHANGE = 'Rotator:onChange';

/**
 * Set initial properties and start rotation.
 * @param {Array} results
 * @param {number} pageSize
 * @param {number} maxPages
 */
Rotator.prototype.init = function(results, pageSize, maxPages, onePerPage)
{
  this._index   = this._timeout = -1;
  this._currentItem = this._nextItem = null;
  this._pages   = [];
  this._paused  = false;

  this._results     = results;
  this._pageSize    = pageSize;
  this._maxPages    = maxPages;
  this._onePerPage  = onePerPage;

  this._width   = this._container.clientWidth;
  this._height  = this._container.clientHeight;

  this._anim    = null;
  this._lastDir = null;

  if(!isDef(pageSize))
  {
    throw new Error('createEvents() - pageSize not defined');
  }

  // if only one result, split Selections into pages //
  if(this._results.length == 1) this._results = this._splitSelections();

  this._createPages();
  this.showPage(0);
}

/**
 * Loops through results, creating event nodes.
 * If not one-per-page, will create multiple selection nodes inside
 * the event node until no more can fit on a page.
 *
 * If only one result, split available selections into pages.
 * @private
 */
Rotator.prototype._createPages = function()
{

    var i=0, len=0, market, evts, html;
    while(i<Math.min(this._results.length,this._maxPages))
    {
      // reset //
      if(!html)
      {
        var col = 0xFFFFFF;//Math.round(0xCCCCCC + (Math.random()*(0xFFFFFF-0xCCCCCC))).toString(16);
        html = '<div class="page" data-id="' + this._pages.length + '" style="background-color:#' + col + '">';
        len = 0;
      }
    // Grab event's selections and chop to fit page if required //
    market = this._results[i];
    evts = toArray(market.EventSelections).slice(0,this._pageSize);

    // if can't fit, close current event and move onto next result //
    if(len+evts.length > this._pageSize)
    {
      this._createNode(html + '</div>');
      html = '';
      i++;
      continue;
    }

    // create selection node //
    html += this._createGroup(evts, market.parent.EventID.toString());

    // if only showing one-per-page, close event node //
    if(this._onePerPage)
    {
      this._createNode(html + '</div>');
      html = '';
    }
    else
    {
      // increment selection counter //
      len += evts.length;
    }

    i++;
  }

  // close last event if necessary //
  if(html.length) this._createNode(html + '</div>');
}

/**
 * Create a group element
 * @param {Array} selections
 * @param {string} id
 * @returns {string} html
 * @private
 */
Rotator.prototype._createGroup = function(selections, id)
{
  var s = '<div class="group" data-event="' + id + '">';
  each(selections, function(item){
    s += this._template
      .replace(/{NAME}/g, item.EventSelectionName.substr(0,23))
      .replace(/{ODDS}/g, item.Bet.Odds)
      .replace(/{FLAG}/g, item.EventSelectionName.toLowerCase());
  }, this);
  return s+'</div>';
}

/**
 * Create a page element.
 * @param html
 * @private
 */
Rotator.prototype._createNode = function(html)
{
  var node = document.createElement('div');
  node.innerHTML = html;
  this._pages[this._pages.length] = node.firstElementChild;
  node = null;
}

/**
 * Split single event out into pages so user can view all EventSelections
 * @returns {Array}
 * @private
 */
Rotator.prototype._splitSelections = function()
{
  var i=-1, idx=-1, m, r=[], e;
  m = toArray(this._results[0].EventSelections);
  if(isDef(this._maxPages)) m = m.slice(0,this._pageSize*this._maxPages);
  e = [];
  while(++idx< m.length)
  {
    e[e.length] = m[idx];
    if(e.length%this._pageSize==0)
    {
      r[r.length] = {
        EventSelections: e,
        Type: this._results[0].Type,
        EachWayPlaces: this._results[0].EachWayPlaces,
        parent:this._results[0].parent
      };
      e = [];
    }
  }

  // add left-overs //
  if(e.length)
  {
    r[r.length] = {
      EventSelections: e,
      Type: this._results[0].Type,
      EachWayPlaces: this._results[0].EachWayPlaces,
      parent:this._results[0].parent
    };
  }

  log('Rotator::SplitSelections(' + m.length + ') -> ' + r.length + ' pages');
  return r;
}

/**
 * Show a specific page.
 * @param {number} idx
 */
Rotator.prototype.showPage = function(idx)
{
  if(idx<0||idx>=this._pages.length||idx==this._index||this._nextItem) return;

  var dir = idx>this._index ? Rotator.LEFT : Rotator.RIGHT;
  this._createNextItem(idx);
  this._animate(dir);
}

/**
 * Show Next Item (right to left)
 */
Rotator.prototype.next = function()
{
  if(this._nextItem) return;
  this._animate(Rotator.LEFT);
}

/**
 * Show Previous Item (left to right)
 */
Rotator.prototype.prev = function()
{
  if(this._nextItem) return;
  this._animate(Rotator.RIGHT);
}

/**
 * Setup page for animation.
 * @param {number} idx page index (automatically wraps if outside bounds)
 */
Rotator.prototype._createNextItem = function(idx)
{
  //log('Rotator::createNextItem(' + idx + ')');

  var dir = idx > this._index ? Rotator.LEFT : Rotator.RIGHT;
  idx = idx < 0 ? this._pages.length-1 : idx == this._pages.length ? 0 : idx;

  this._nextItem = this._pages[idx];

  // Setup slider for next animation //
  if(dir == Rotator.LEFT){
    this._container.appendChild(this._nextItem);
  } else {
    this._container.insertBefore(
      this._nextItem, this._container.firstElementChild
    );
    this._container.style.left = (
      parseInt(this._container.style.left.replace(/px$/i,'')) -
       this._nextItem.clientWidth) + 'px';
  }

  // Align page content //
  this._alignPage();
}

/**
 * Clear any queued page.
 */
Rotator.prototype._clearNextPage = function()
{
  if(!this._nextItem) return;
  this._nextItem.parentNode.removeChild(this._nextItem);
  this._nextItem = this._anim = null;
  this._container.style.left = 0;
}

/**
 * Animate container
 * @param {number} dir animation direction
 * @param {number} opt_speed optional speed value
 * @private
 */
Rotator.prototype._animate = function(dir, opt_speed)
{
  if(this._anim) return;

  // Make sure we've got a next page and the correct index //
  if(!this._nextItem) this._createNextItem(this._index+(dir==Rotator.LEFT ? 1:-1));
  this._index = this._pages.indexOf(this._nextItem);

  // Dispatch Change Event for non-mobile devices //
  if(!this._isMobile){
    this.dispatchEvent(Rotator.CHANGE, {
      index: this._index,
      element: this._nextItem,
      data: this._results[this._index],
      target: this
    });
  }

  var dest = dir == Rotator.LEFT ? -this._nextItem.clientWidth : 0;
  if(this._currentItem){
    this._anim = TweenLite.to(
      this._container,opt_speed || .6,
      {
        left: dest,
        ease: Power2.easeOut,
        onComplete: bind(this._animComplete,this)
      }
    );
  } else{
    this._animComplete();
  }
}

/**
 * Set page alignment as per const value.
 * @private
 */
Rotator.prototype._alignPage = function()
{
  var y = 0;
  switch(Rotator.ALIGN.toLowerCase())
  {
    case 'top':
      pos = 0;
      break;

    case 'center':
    case 'middle':
      y = (this._height-this._nextItem.clientHeight)*.5;
      break;

    case 'bottom':
      y = this._height-this._nextItem.clientHeight;
      break;
  }
  this._nextItem.style.top = y + 'px';
}

/**
 * Clean up references after animation
 * @private
 */
Rotator.prototype._animComplete = function()
{
  if(!this._nextItem) return;

  if(this._currentItem)
    this._currentItem.parentNode.removeChild(this._currentItem);
  this._currentItem = this._nextItem;
  this._nextItem = this._anim = null;
  this._container.style.left = 0;

  // Dispatch Change Event //
  if(this._isMobile){
    this.dispatchEvent(Rotator.CHANGE, {
      index: this._index,
      element: this._currentItem,
      data: this._results[this._index],
      target: this
    });
  }

  if(!this._paused) this._startAuto();
}

/**
 * Start the rotator
 * @private
 */
Rotator.prototype.start = Rotator.prototype._startAuto = function()
{
  this._killAuto();

  if(this._pages.length == 1) return;

  this._paused = false;
  this._timeout = setTimeout(
    bind(this.next, this), this._pageDelay
  );
}

/**
 * Stop the rotator
 * @private
 */
Rotator.prototype.stop = Rotator.prototype._killAuto = function()
{
  this._paused = true;
  if(this._timeout != -1)
  {
    clearTimeout(this._timeout);
    this._timeout = -1;
  }
}

/**
 * Wire up touch/swipe navigation using Hammer.js.
 */
Rotator.prototype.enableSwipeNavigation = function()
{
  if(!isDef(window.Hammer))
  {
    throw new Error('Hammer.js not loaded');
    return;
  }

  Hammer(
    document.getElementById('data-container'),{
      drag_max_touches: 1,
      drag_block_vertical: true,
      drag_lock_to_axis: true
    }).on(
      'touch release dragleft dragright swipeleft swiperight',
      bind(this._handleTouchEvent, this)
    );
}

/**
 * Handle events generated by Hammer.js
 * @param {Object} evt Event Object
 */
Rotator.prototype._handleTouchEvent = function(evt)
{
  // disable default browser scrolling //
  evt.gesture.preventDefault();

  // If an animation is already in progress, then ignore other events //
  if(this._anim) return;

  //log(evt.type);
  switch(evt.type)
  {
    case 'touch':
      var event = document.createEvent('Event');
      event.initEvent('interaction',true)
      this._container.dispatchEvent(event);
      break;

    case 'dragleft':
      if(this._lastDir != Rotator.LEFT) this._clearNextPage();
      if(!this._nextItem) {
        this._createNextItem(this._index+1);
        this._lastDir = Rotator.LEFT;
      }
      this._setDragPos(evt.gesture.deltaX);
      break;

    case 'dragright':
      if(this._lastDir != Rotator.RIGHT) rotator._clearNextPage();
      if(!this._nextItem) {
        this._createNextItem(this._index-1);
        this._lastDir = Rotator.RIGHT;
      }
      this._setDragPos(evt.gesture.deltaX);
      break;

    case 'swipeleft':
      evt.gesture.stopDetect();
      if(!this._nextItem) this._createNextItem(this._index+1);
      this._animate(Rotator.LEFT);
      break;

    case 'swiperight':
      evt.gesture.stopDetect();
      if(!this._nextItem) this._createNextItem(this._index-1);
      this._animate(Rotator.RIGHT);
      break;

    case 'release':
      if(!this._nextItem) break;
      if(Math.abs(evt.gesture.deltaX) > (this._nextItem.clientWidth *.3))
      {
        this._animate(this._lastDir,.3);
      }
      else {
        var dest = 0;
        if(this._lastDir == Rotator.RIGHT) dest = -this._nextItem.clientWidth;
        this._anim = TweenLite.to(
          this._container,.3,
          {
            left: dest,
            ease: Power2.easeOut,
            onComplete: bind(this._clearNextPage, this)
          }
        );
      }
      this._lastDir = null;
      break;

    default:
      this._lastDir = null;
      break;
  }
}

/**
 * Update slider position whilst dragging.
 * @param {number} deltaX Amount moved since first touch (+/-).
 */
Rotator.prototype._setDragPos = function(deltaX)
{
  var x, px, w = this._nextItem.clientWidth;
  x = (100/w) * deltaX;

  px = (w/100) * x;
  px = Math.max(-w,Math.min(w, px));
  if(this._lastDir == Rotator.RIGHT) px -= w;
  this._container.style.left = px + 'px';

  //log(rotator._container.style.left);
}
