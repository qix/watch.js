$(function() {
	$('.if').each(function() {
		var div = $(this); // div
    var full = div.data('if');
    
    var parts = [];
    $.each(full.split(/ or /i), function(i, condition) {

      condition = condition.split('='); // condition
      var not = condition[0][condition[0].length-1] == '!';
      if (not) condition[0] = condition[0].substring(0,condition[0].length-1);

      var test = function(val) {
        var v = (val == condition[1]);
        parts[i]['test'] = not ? !v : v;

        v = false;
        for (var k = 0; k < parts.length; k++) {
          v = v || parts[k]['test'];
        }

        toggle($(div), v);
      }

      parts.push({'test': false, 'watch': condition[0], 'fn': test});
    });

    for (var i = 0; i < parts.length; i++) watch.add(parts[i]['watch'], parts[i]['fn']);

    div.data('check', function() {
      for (var i = 0; i < parts.length; i++) {
        parts[i]['fn'](watch.get(parts[i]['watch']));
      }
    });
	});

  function toggle($el, show) {
    if (show===undefined) show = true;

    $el.toggleClass('disabled', !show);
    if (!$el.hasClass('control') || $el.hasClass('if-hide')) {
      $el.css('display', show ? ($el.is('span') ? 'inline' : 'block') :'none');
    }

    if (show && $el.parents('.disabled').length) {
      $el.find(':input').attr('disabled','disabled');
    }else{
      $el.find(':input').attr('disabled',show ? false :'disabled');
      $el.find('.disabled :input').attr('disabled','disabled');
      // recursively run check if showing el
      if (show) {
        $el.find(':input').trigger('change');
        $el.find('.if').each(function() { $el.data('check') && $el.data('check')(); });
      }
    }
  }
});
