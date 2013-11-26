/**
 * Created with PhpStorm.
 * User: kimh
 * Date: 26/11/13
 * Time: 4:58 PM
 */

function createTweens()
{
  // Sprite Run Animation //
  runAnim = TweenMax.to(
    window,.35, {
      frame: 6,
      onUpdate: updateSprite,
      ease:Linear.easeNone,
      roundProps: "frame",
      repeat: -1,
      paused: true
    }
  );

  // Ball Bounce Animation //
  bounce.add(
    TweenLite.to(
      ball,.4, {
        bottom: 85,
        ease: Power2.easeOut
      }
    )
  );
  bounce.add(
    TweenLite.to(
      ball,.3, {
        bottom: 45,
        ease: Power2.easeIn
      }
    )
  );

  // Intro (reappear) Animation //
  introTimeline.add(
    TweenLite.to(
      ball, 1, {x:50}
    )
  );
  introTimeline.add(
    TweenLite.to(
      soccerman, 1, {
        x:-10,
        delay:.3,
        onComplete: function(){
          runAnim.pause();
          soccerman.className = 'idle';
        }
      }
    ),'-=1'
  );
}

function redrawTweens()
{
  ballTimeline.clear();

  ballTimeline.add(
    TweenMax.to(
      ball,1,{
        x: mainDiv.clientWidth+ball.clientWidth,
        bottom: 45,
        rotation: 1000,
        ease: Power2.easeOut
      }
    )
  );
  ballTimeline.add(
    TweenLite.to(
      soccerman,1.5,{
        x: mainDiv.clientWidth+soccerman.clientWidth,
        ease: Linear.easeNone,
        onStart: function(){
          runAnim.play();
        }
      }
    ),'-=.6'
  );
}

