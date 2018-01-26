${{topline}}

!function (ROOT) { 'use strict'

const META = {
    NAME:     { value:'OomFoo.topLevel' }
  , REMARKS:  { value:'@TODO' }
}


//// Shortcuts to Ooms namespace and toolkit.
const OOM     = ROOT.OOM    = ROOT.OOM    || {}
const TOOLKIT = OOM.TOOLKIT = OOM.TOOLKIT || {}


//// Define the `OomFoo.topLevel()` method.
const method = OOM.OomFoo.prototype.topLevel = function (abc) {
    let err, ME = `OomFoo.topLevel(): ` // error prefix
    if (! (this instanceof OOM.OomFoo)) throw new Error(ME
      + `Must not be called as OomFoo.prototype.topLevel()`)
    if ( err = TOOLKIT.validateType({ type:'string' }, abc) )
        throw new TypeError(ME+`abc ${err}`)

    this.xyz++
    return abc + ' ok!'

}//OomFoo.topLevel()

//// A tally of the number of times `topLevel()` is called.
OOM.OomFoo.prototype.xyz = 0


//// Add static constants to the `topLevel()` method.
Object.defineProperties(method, META)




}( 'object' === typeof global ? global : this ) // `window` in a browser
