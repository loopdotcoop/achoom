//// Achoom //// 1.0.0 //// January 2018 //// http://achoom.loop.coop/ /////////

"use strict";
!function(ROOT) {
  'use strict';
  if ('function' !== typeof jQuery)
    throw Error('jQuery not found');
  jQuery(function($) {
    var instance = new ROOT.OOM.Achoom({
      firstParameter: 100,
      secondParameter: new Date
    });
    console.log(instance);
  });
}('object' === (typeof global === 'undefined' ? 'undefined' : $traceurRuntime.typeof(global)) ? global : this);




//// Made by Oomtility Make 1.0.14 //\\//\\ http://oomtility.loop.coop /////////
