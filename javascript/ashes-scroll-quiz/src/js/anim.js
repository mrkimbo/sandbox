/**
 * User: kimh
 * Date: 27/11/13
 * Time: 12:21 PM
 */

var MainTimeline = new TimelineMax(
  {
    paused: true
  }
);
var currentPage;
var scrollTween;

function redrawTweens()
{
  var page, el, elems;

  MainTimeline.clear();

  // Q1: Outro //
  page = elements.pages[0];
  elems= page.findAll('.options li');

  MainTimeline.addLabel('Start');
  MainTimeline.addLabel('Page1');
  MainTimeline.addLabel('Question1');

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

  // Q2: Intro //
  MainTimeline.addLabel('Page2', "-=.2");


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

  MainTimeline.addLabel('Question2');

  // Q2: Outro //
  el = page.find('.cricket-ball');
  MainTimeline.add(
    TweenLite.to(
      el,1,{
        x: (screenSize.width *.5) - 100,
        y: 256,
        scale: 1.2,
        ease: Power3.easeIn
      }
    )
  );
  MainTimeline.add(
    TweenLite.to(
      el,.5,{
        y: 100,
        scale: .2,
        opacity: 0,
        ease: Power3.easeOut
      }
    )
  );
  MainTimeline.add(
    TweenLite.to(
      page.find('.bail:first-child'),.6,{
        x: '-=250',
        y: '-=200',
        rotation: '-=90',
        scale: 1.2,
        opacity: 0,
        ease: Power3.easeOut
      }
    ),'-=.4'
  );
  MainTimeline.add(
    TweenLite.to(
      page.find('.bail:last-child'),.6,{
        x: '+=250',
        y: '-=200',
        rotation: '+=90',
        scale: 1.2,
        opacity: 0,
        ease: Power3.easeOut
      }
    ),'-=.7'
  );
  MainTimeline.add(
    TweenLite.to(page.find('.stumps'),.6,{
      y: '+=250',
      opacity:0
    }), '-=.6'
  );
  MainTimeline.add(
    TweenLite.to(page.find('.text'),.6, {
      y: "-=300"
    }), '-=.6'
  );
  MainTimeline.add(
    TweenLite.to(page.find('.btn:first-child'),.4, {
      scale:.2,
      opacity: 0
    }), '-=.6'
  );
  MainTimeline.add(
    TweenLite.to(page.find('.btn:last-child'),.4, {
      scale:.2,
      opacity: 0
    }), '-=.6'
  );

  MainTimeline.add(
    TweenLite.to(
      elements.container,.5,{
        backgroundColor: '#5AC4D1'
      }
    )
  );

  // Q3: Intro //
  MainTimeline.addLabel('Page3');

  page = elements.pages[2];
  MainTimeline.add(
    TweenLite.from(page.find('.text'),.4, {
      y: 200,
      opacity: 0,
      ease: Power3.easeOut
    }), '-=.6'
  );
  elems = page.findAll('.question');
  elems.forEach(function(el,idx){
    MainTimeline.add(
      TweenLite.from(el,.4, {
        y: 200,
        opacity: 0,
        delay:.2*(idx+1),
        ease: Power2.easeOut
      }), '-=.4'
    );
  });
  elems = page.findAll('.dudes');
  elems.forEach(function(el,idx){
    MainTimeline.add(
      TweenLite.from(el,.6, {
        width: 0,
        delay:.3*idx,
        ease: Power2.easeOut
      }), '-=' + (.5*idx)
    );
  });


  MainTimeline.addLabel('Question3');

  // Q3: Outro //
  MainTimeline.addLabel('Page4');

  elems = page.findAll('.question');
  elems.forEach(function(el){
    MainTimeline.add(
      TweenLite.to(el,.4,{
        rotationX: '-=90'
      })
    );
  });
  MainTimeline.add(
    TweenLite.to(page.find('.text'),.6,{
      y: '-=200',
      opacity: 0
    }),'-=1'
  );


  MainTimeline.add(
    TweenLite.to(
      elements.container,.5,{
        backgroundColor: '#0067AB'
      }
    )
  );

  // Q4: End Screen //
  MainTimeline.addLabel('Page4');


  page = elements.pages[3];

  MainTimeline.add(
    TweenLite.from(page.find('.results'),.7,{
      scale: 2,
      opacity: 0,
      ease: Bounce.easeOut
    })
  );
  MainTimeline.add(
    TweenLite.from(page.find('.cta'),.4,{
      scale: 2,
      opacity: 0,
      ease: Bounce.easeOut,
      delay:.5
    })
  )

  MainTimeline.addLabel('Question4');
  MainTimeline.addLabel('End');
}


function onTimelineUpdate()
{
  if(getCurrentPage()!=currentPage)
  {
   sortVisibility();
  }
}

function sortVisibility()
{
  currentPage = getCurrentPage();
  log('currentPage: ' + currentPage)

  elements.nav.findAll('.btn').forEach(function(el){
    if(el.id.match(/[0-9]/)[0] == currentPage){
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  /*elements.pages.forEach(function(item){
    log(item.id.substr(-1) + ' > ' + currentPage);
    item.classList.toggle('hidden',item.id.substr(-1) == currentPage);
  });*/
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
  scrollTween = new TweenLite(elements.scrollBox,2,{
    scrollTop:Math.min(v,maxScroll),
    ease: Power1.easeOut
  });
}