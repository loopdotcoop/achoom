//// Achoom //// 1.0.0 //// January 2018 //// http://achoom.loop.coop/ /////////

"use strict";
!function(ROOT) {
  'use strict';
  if ('function' !== typeof jQuery)
    throw Error('jQuery not found');
  jQuery(function($) {
    var Class = OOM.Achoom;
    Class.testInstanceFactory = function() {
      return new Class({
        firstParam: 100,
        secondParam: new Date
      }, {});
    };
    test('The Achoom class', function() {
      is('object' === (typeof OOM === 'undefined' ? 'undefined' : $traceurRuntime.typeof(OOM)), 'The OOM namespace object exists');
      is('undefined' === typeof Achoom, 'Achoom is not global');
      is('function' === typeof Class, 'Achoom is a function');
      is('Achoom' === Class.NAME, 'NAME is Achoom');
      is('1.0.0' === Class.VERSION, 'VERSION is 1.0.0');
      is('http://achoom.loop.coop/' === Class.HOMEPAGE, 'HOMEPAGE is http://achoom.loop.coop/');
    });
    test('Successful Achoom instantiation', function() {
      var instance = Class.testInstanceFactory();
      is(instance instanceof Class, 'Is an instance of Achoom');
      is('object' === $traceurRuntime.typeof(instance.hub), '`hub` property is an object');
    });
    ROOT.throws = ROOT.throws || (function(fn, expect, prefix) {
      var nl = 'undefined' === typeof window ? ':\n    ' : ':<br>' + ' &nbsp;'.repeat(6);
      var didntThrow = true;
      try {
        fn();
      } catch (e) {
        didntThrow = false;
        var ok = expect === e.message;
        is(ok, (prefix + " has " + (ok ? '' : 'un') + "expected error" + (ok ? '' : nl + e.message)));
      }
      if (didntThrow)
        is(0, prefix + " did not throw an error");
    });
  });
}('object' === (typeof global === 'undefined' ? 'undefined' : $traceurRuntime.typeof(global)) ? global : this);




//// Made by Oomtility Make 1.0.14 //\\//\\ http://oomtility.loop.coop /////////
