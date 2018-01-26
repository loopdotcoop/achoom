${{topline}}

${{{
isApp ? `
//// Node.js:    7.2.0
//// Rhino:      @TODO get Rhino working
`:''
}}}
!function (ROOT) { 'use strict'
const Class = OOM.${{classname}}




test('Nonbrowser test the ${{classname}} class', () => {
    is(true, '@TODO')
})




}( 'object' === typeof global ? global : this ) // `window` in a browser
