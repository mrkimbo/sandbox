var parser, rotator, _timeout, _duration;

// Initialise Banner - Load Data and wire up events //
function init()
{
  var config = getConfig();
  _duration = (parseInt(config.duration) || 15) * 1000;

  initExits();

  parser = new FeedParser();
  parser.fetch(config, onSuccess, onFail);
}

// Data loaded - display results //
function onSuccess(results)
{
  log('onSuccess(' + results.length + 'results)');
  document.getElementById('loader').style.display = 'none';

  //results = validate(results);

  if(!results.length)
  {
    onFail({duration:0});
    return;
  }

  log(results);

  // Create rotator:
  rotator = new Rotator(
    document.getElementById('slider'),
    'item-template',
    isMobile()
  );
  rotator.addEventListener(Rotator.CHANGE, onPageChange);
  rotator.init(results,parseInt('19'),parseInt('26'),true);

  initControls();

  //rotator.stop();
}

// Data failed to load or no results available - show fallback content //
function onFail(evt)
{
  log('onFail(' + evt.duration + ' secs)');
  document.getElementById('fallback').style.display = 'block';
}

/*
 * Event fired when page changes.
 * evt: {
 *   index:   {page-index}
 *   element: {html element for page}
 *   data:    {event data}
 *   target:  {reference to rotator instance}
 * }
 */
function onPageChange(evt)
{
  //log('onPageChange() - ' + evt.index + ', ' + evt.data.parent.EventName);
  if(document.querySelector('#title'))
    document.querySelector('#title').textContent = evt.data.parent.EventName;
}

/*
 * Executed after user has not interacted with banner
 * (for a pre-defined length of time)
 */
function onBannerExpired()
{
  log('onBannerExpired()');
  rotator.stop();
}

// Optional Results Validation - strip out incomplete/malformed items //
function validate(results)
{
  var len = results.length, i;
  var minSelections = 2;
  for(i=0; i<results.length; i++)
  {
    try{
      // test for valid properties //
      if(toArray(results[i].Market)[0].EventSelections.length < minSelections) results.splice(i--,1);
    } catch(err) {
      // if fail for any reason, remove item //
      results.splice(i--,1);
    }
  };
  log('validate(' + len +  ' -> ' + results.length + ' results)');
  return results;
}


/*
 * Setup DoubleClick element click events //
 */
function initExits()
{
  if(!Enabler.isInitialized()) throw new Error('initExits() - Enabler not ready');

  $('#main')[0].addEventListener('click',function(e){
    e.stopPropagation();
    log('Background Exit');
    Enabler.exit('Background Exit');
  });
  $('#slider')[0].addEventListener('click',function(e){
    e.stopPropagation();
    log('Odds Exit')
    Enabler.exit('Odds Exit');
  });
  /*$('#cta-btn')[0].addEventListener('click',function(e){
   e.stopPropagation();
   Enabler.exit('CTA Exit');
   });*/
}
