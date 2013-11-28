/**
 * User: kimh
 * Date: 27/11/13
 * Time: 12:21 PM
 */

var MainTimeline = new TimelineMax(
  {
    paused: true,
    onUpdate: onTimelineUpdate
  }
);
var currentPage;
var scrollTween;

function redrawTweens()
{
  var page, elems;

  MainTimeline.clear();

  // Q1: Outro //
  page = elements.pages[0];
  elems= page.findAll('.options li');

  MainTimeline.addLabel('Page1');

  MainTimeline.add(
    TweenLite.to(page.find('.text'),1,{
      y: -50,
      opacity: 0,
      ease: Linear.easeNone,
      roundProps: ['y']
    })
  );
  elems.forEach(function(el){
    MainTimeline.add(
      TweenLite.to(el,1,{
        opacity: 0,
        ease: Power2.easeOut
      }), '-=.8'
    );
  });
  MainTimeline.add(
    TweenLite.to(
      elements.container,.5,{
        backgroundColor: '#0080A4'
      }
    ), "-=1"
  );

  MainTimeline.addLabel('Page2', "-=.2");

  // Q2: Intro //
  page = elements.pages[1];
  elems= page.findAll('.bail');
  MainTimeline.add(
    TweenLite.to(page.find('.stumps'),1,{
      y: -250,
      opacity:1
    }), "-=.2"
  );
  elems.forEach(function(el, idx){
    MainTimeline.add(
      TweenLite.to(el,.8,{
        y: 440,
        opacity:1,
        ease:Bounce.easeOut,
        delay: .2*(idx+1)
      }),'-=.5'
    );
  });
  MainTimeline.add(
    TweenLite.to(page.find('.text'),1,{
      opacity: 1,
      scale: 1
    }), '-=.5'
  );
  MainTimeline.add(
    TweenLite.to(page.find('li:first-child'),.3,{
      x: 300,
      opacity: 1,
      ease:Bounce.easeOut
    }),'-=.5'
  );
  MainTimeline.add(
    TweenLite.to(page.find('li:last-child'),.3,{
      x: -300,
      opacity: 1,
      ease:Bounce.easeOut
    }),'-=.5'
  );

  MainTimeline.addLabel('Page3');
}


function onTimelineUpdate()
{
  //if(getCurrentPage()!=currentPage)
  //{
   //sortVisibility();
  //}
}

function sortVisibility()
{
  currentPage = getCurrentPage();

  elements.pages.forEach(function(item){
    log(item.id.substr(-1) + ' > ' + currentPage);
    item.classList.toggle('hidden',item.id.substr(-1) == currentPage);
  });
}

function getScrollTime()
{
  return MainTimeline.totalDuration()*getScrollPercent();
}
function getScrollPercent()
{
  return elements.scrollBox.scrollTop/maxScroll;
}
function getCurrentPage()
{
  return MainTimeline.currentLabel().substr(-1);
}

function scrollTo(v)
{
  if(scrollTween && !scrollTween.paused())
  {
    scrollTween.kill();
  }
  scrollTween = new TweenLite(elements.scrollBox,.5,{
    scrollTop:Math.min(v,maxScroll),
    ease: Power2.easeOut
  });
}