${{topline}}

${{{
isApp ? `
//// Node.js:    7.2.0
//// Rhino:      @TODO get Rhino working
//// Windows XP: Firefox 6, Chrome 15 (and probably lower), Opera 12.10
//// Windows 7:  IE 9, Safari 5.1
//// OS X 10.6:  Firefox 6, Chrome 16 (and probably lower), Opera 12, Safari 5.1
//// iOS:        iPad 3rd (iOS 6) Safari, iPad Air (iOS 7) Chrome
//// Android:    Xperia Tipo (Android 4), Pixel XL (Android 7.1)
`:''
}}}
!function (ROOT) { 'use strict'
if ('function' !== typeof jQuery) throw Error('jQuery not found')
jQuery( function($) {
const Class = OOM.${{classname}}




//// Instantiates a typical ${{classname}} instance for unit testing its methods.
Class.testInstanceFactory = () =>
    new Class({
        firstParam: 100
      , secondParam: new Date
    },{
        /* @TODO hub API */
    })




test('The ${{classname}} class', () => {
    is('object' === typeof OOM, 'The OOM namespace object exists')
${{{
    isApp ? `
    is('undefined' === typeof ${classname}, '${classname} is not global')`:''
}}}
    is('function' === typeof Class, '${{classname}} is a function')
    is('${{classname}}' === Class.NAME, 'NAME is ${{classname}}')
${{{
    isApp ? `
    is('${version}' === Class.VERSION, 'VERSION is ${version}') // OOMBUMPABLE (twice!)
    is('${homepage}' === Class.HOMEPAGE
      , 'HOMEPAGE is ${homepage}')`:''
}}}
})




test('Successful ${{classname}} instantiation', () => {
    const instance = Class.testInstanceFactory()
    is(instance instanceof Class, 'Is an instance of ${{classname}}')
    is('object' === typeof instance.hub, '`hub` property is an object')
})




${{{
isApp ? `
//// EXTEND KLUD.JS

//// Test for an expected exception.
ROOT.throws = ROOT.throws || ( (fn, expect, prefix) => {
    let nl = // newline plus colon and indent (klud.js test for Node.js, btw)
        'undefined' === typeof window ? ':\\n    ' : ':<br>'+' &nbsp;'.repeat(6)
    let didntThrow = true
    try {
        fn()
    } catch (e) {
        didntThrow = false
        const ok = expect === e.message
        is(ok, \`\${prefix} has \${ok?'':'un'}expected error\${ok?'':nl+e.message}\`)
    }
    if (didntThrow) is(0, prefix + \` did not throw an error\`)
})




`:''
}}}
})//jQuery()
}( 'object' === typeof global ? global : this ) // `window` in a browser
