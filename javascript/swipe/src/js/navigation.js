/**
 * Created with JetBrains PhpStorm.
 * User: kimh
 * Date: 22/10/13
 * Time: 2:38 PM
 */

var nav, prevBtn, nextBtn, controls;
var INTERACTION = 'Event:onInteraction';

/*
 * Setup interactions:
 *  - Paging controls (left/right buttons or dot nav).
 *  - Pause/Resume animation on mouse over/out.
 */
function initControls() {
  nav = document.querySelector('#nav');
  prevBtn = document.querySelector('#prev-btn');
  nextBtn = document.querySelector('#next-btn');
  controls = document.querySelector('#controls');

  if (!controls) return;
  controls.style.display = 'block';

  if (rotator.pages.length < 2) {
    disableNavigation();
    return;
  }

  enablePauseResume();
  enableDotNavigation();
  enableLeftRightNavigation();
  rotator.enableSwipeNavigation();
}

/**
 * Disable left/right arrows if only one page.
 */
function disableNavigation()
{
  if (nav) nav.className = nav.className.replace(/\s?$/, ' disabled');
  if (prevBtn) prevBtn.className = prevBtn.className.replace(/\s?$/, ' disabled');
  if (nextBtn) nextBtn.className = nextBtn.className.replace(/\s?$/, ' disabled');
}

/**
 * Setup main hover pause/resume functionality.
 */
function enablePauseResume()
{
  hover($('#main')[0],
    function () {
      try { clearTimeout(_timeout); } catch (e) {}
      rotator.stop();
    },
    function () {
      _timeout = setTimeout(onBannerExpired, _duration);
      rotator.start();
    }
  );

  _timeout = setTimeout(onBannerExpired, _duration);
}

/**
 * Wire up dot-nav (if present)
 */
function enableDotNavigation()
{
  if(!nav) return;

  var el, list = nav.querySelector('ul');
  rotator.pages.forEach(function (item, idx) {
    el = document.createElement('li');
    el.setAttribute('data-idx', idx);
    list.appendChild(el);
  });
  list.children[0].className = 'selected';

  // dot click events //
  nav.querySelectorAll('li');
  nav.addEventListener('click', function (evt) {
    evt.stopPropagation();

    if (evt.target.nodeName.toLowerCase() != 'li') return;
    rotator.showPage.call(
      rotator, parseInt(evt.target.getAttribute('data-idx'))
    );
  });

  // update selected item on page change //
  rotator.addEventListener(Rotator.CHANGE, function (evt) {
    each(nav.querySelectorAll('li'), function (item, idx) {
      item.className = idx == evt.index ? 'selected' : '';
    });
  });
}

/**
 * Wire up prev/next buttons (if present).
 */
function enableLeftRightNavigation()
{
  if (prevBtn) {
    prevBtn.addEventListener('click', function (evt) {
      evt.stopPropagation();
      rotator.prev();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function (evt) {
      evt.stopPropagation();
      rotator.next();
    });
  }
}
