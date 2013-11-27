/**
 * User: kimh
 * Date: 27/11/13
 * Time: 12:21 PM
 */

var MainTimeline = new TimelineMax({paused: true});
var scrollTween;

function redrawTweens()
{
  MainTimeline.clear();

  //MainTimeline




}




function scrollTo(v)
{
  if(scrollTween && !scrollTween.paused())
  {
    scrollTween.kill();
  }
  scrollTween = new TweenLite(elements.content,1,{
    scrollTop:Math.min(v,maxScroll),
    ease: Power2.easeOut
  });
}