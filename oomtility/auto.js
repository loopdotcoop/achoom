!function () { 'use strict'

const NAME     = 'Oomtility Auto'
    , VERSION  = '1.0.14'
    , HOMEPAGE = 'http://oomtility.loop.coop'

    , BYLINE   = (`\n\n\n\n//// Initialised by ${NAME} ${VERSION}\n`
               + `${HOMEPAGE} /////////////////////////////`).slice(0,84) + '\n'
    , HELP =
`
${NAME} ${VERSION}
${'='.repeat( (NAME+VERSION).length+1 )}

This Node.js script initialises source, test and demo files for new classes and
and methods. It can also remove these files. @TODO docs

Installation
------------
If you haven’t done it already, you should set up the \`oomauto\` alias:
$ node oomtility/alias.js

Basic Usage
-----------
$ cd /path/to/your/oom/repo/      # An Oom repo directory
$ oomauto --version               # Show the current ${NAME} version
$ oomauto Base Another Base.Sub   # Generate files for three new classes
$ oomauto Base.Sub.foo topLevel   # Generate files for two new methods
$ oomauto -r Another Base.Sub     # Remove two classes’s files (+ methods)
$ oomauto --remove Base.Sub.foo   # Remove a method from a class

Generated Or Removed Files
--------------------------
1.  src/main/Base.Sub.6.js                  Source file for Base.Sub class
2.  src/test/Base.Sub-universal.6.js        Basic unit tests you’ll add to
3.  src/test/Base.Sub-browser.6.js          As above, for browsers only
4.  src/test/Base.Sub-nonbrowser.6.js       As above, for Node.js only
5.  src/demo/Base.Sub-demo.6.js             Usage example script
6.  support/demo-base.sub.html              Usage example page (lowercase)
7.  src/main/Base.Sub.foo.6.js              Source file for foo() method
8.  src/test/Base.Sub.foo-universal.6.js    Basic unit tests you’ll add to
9.  src/test/Base.Sub.foo-browser.6.js      As above, for browsers only
10. src/test/Base.Sub.foo-nonbrowser.6.js   As above, for Node.js only

Options
-------
-h  --help      Show this help message
-r  --remove    Remove existing class or classes from the project
-v  --version   Show the current ${NAME} version

This script belongs to ${HOMEPAGE}
`


//// Validate the environment.
const nodePath = process.argv.shift()
const selfPath = process.argv.shift()
if ( '/oomtility/auto.js' !== selfPath.slice(-18) )
    return console.warn('Unexpected environment!')
if ( ( process.cwd() !== selfPath.slice(0,-18) ) )
    return console.warn(`Unexpected CWD, try:\n  $ cd ${selfPath.slice(0,-18)}`)
if ('function' !== typeof require)
    return console.warn('Use Node.js instead:\n  $ node oomtility/auto.js')




//// SETUP


//// Load library functionality.
const fs = require('fs')
    , wrapped = require('./wrapped.js')

//// Set constants.
const rxClassname
    = /^[A-Z][A-Za-z0-9]+(\.[A-Z][A-Za-z0-9]+)*$/
const rxMethodname
    = /^([A-Z][A-Za-z0-9]+\.)?([A-Z][A-Za-z0-9]+\.)*[a-z][A-Za-z0-9]+$/
const topline = (fs.readFileSync(`src/main/App.6.js`)+'').split('\n')[0]
const [
    x1          // four slashes
  , projectTC   // titlecase, eg 'FooBar'
  , x2          // four slashes
  , projectV    // current project version, eg ‘1.2.3’
  , x3          // four slashes
  , projectMth  // current last-updated month, eg ‘January’
  , projectYYYY // current last-updated year, eg ‘2018’
  , x4          // four slashes
  , projectURL  // project URL, eg ‘http://oom-foo.loop.coop/’
] = topline.split(' ')
const projectLC = process.cwd().split('/').pop() // lowercase, eg 'foo-bar'
const projectNH = projectLC.replace(/-/g,'')     // no hyphens, eg 'foobar'
if ( projectLC.toLowerCase() != projectLC) return console.warn(
    `Project '${projectLC}' contains uppercase letters`)
if ( projectTC.toLowerCase() != projectNH) return console.warn(
    `Project '${projectLC}' is called '${projectTC}' in src/main/App.6.js`)
const projectRepo = 'https://github.com/loopdotcoop/' + projectLC
const projectNPM  = 'https://www.npmjs.com/package/' + projectLC

//// Declare variables.
let opt, remove, classes = [], methods = []

//// Deal with command-line options.
while ( opt = process.argv.shift() ) {
    if ('-h' === opt || '--help'    === opt) return console.log(HELP)
    if ('-r' === opt || '--remove'  === opt) { remove = true; continue }
    if ('-v' === opt || '--version' === opt) return console.log(VERSION)
    if ( rxClassname.test(opt) )
        classes.push(opt)
    else if ( rxMethodname.test(opt) )
        methods.push(opt)
    else
        console.warn(`Ignoring '${opt}' - not a valid option, class or method`)
}

//// The special 'App' class name must not be used. The main class defined in
//// ‘App.6.js’ (same name as the project) must not be extended.
for (let i=0, name; name=classes[i]; i++) {
    if (projectTC === name || 'App' === name)
        return console.warn(`‘App.6.js’ ${remove
          ? 'must exist':'already exists'} (it defines '${projectTC}')`)
    if ( projectTC === name.split('.')[0] )
        return console.warn(`'${name}' invalid: cannot extend '${projectTC}'`)
    if ('App' === name.split('.')[0] )
        return console.warn(`'${name}' invalid: 'App' is a reserved class name`)
    //@TODO must not be alphabetically before 'App'
}

//// Methods must not be added to the special 'App' class name.
for (let i=0, name; name=methods[i]; i++) {
    if ('App' === name.split('.')[0] )
        return console.warn(`'${name}' invalid: 'App' is a reserved class name`)
}

//// Ignore duplicate class names and method names.
classes = new Set(classes)
methods = new Set(methods)




//// GENERATE OR REMOVE FILES


//// 1.  src/main/Base.Sub.6.js                  Source file for Base.Sub class

classes.forEach( name => { generateOrRemove(
    `src/main/${name}.6.js`
  , generateClass(name)
) })


//// 2.  src/test/Base.Sub-universal.6.js        Basic unit tests you’ll add to
classes.forEach( name => { generateOrRemove(
    `src/test/${name}-universal.6.js`
  , generateClassUniversal(name)
) })


//// 3.  src/test/Base.Sub-browser.6.js          As above, for browsers only
classes.forEach( name => { generateOrRemove(
    `src/test/${name}-browser.6.js`
  , generateClassBrowser(name)
) })


//// 4.  src/test/Base.Sub-nonbrowser.6.js       As above, for Node.js only
classes.forEach( name => { generateOrRemove(
    `src/test/${name}-nonbrowser.6.js`
  , generateClassNonbrowser(name)
) })


//// 5.  src/demo/Base.Sub-demo.6.js             Usage example script
classes.forEach( name => { generateOrRemove(
    `src/demo/${name}-demo.6.js`
  , generateDemoScript(name)
) })


//// 6.  support/demo-base.sub.html              Usage example page (lowercase)
classes.forEach( name => { generateOrRemove(
    `support/demo-${name.toLowerCase().replace(/\./g,'-')}.html`
  , generateDemoPage(name)
) })


//// 7.  src/main/Base.Sub.foo.6.js              Source file for foo() method

methods.forEach( name => { generateOrRemove(
    `src/main/${-1===name.indexOf('.')?'App.':''}${name}.6.js`
  , generateMethod(name)
) }) // note that we prefix a top-level method’s filename with ‘App.’


//// 8.  src/test/Base.Sub.foo-universal.6.js    Basic unit tests you’ll add to
methods.forEach( name => { generateOrRemove(
    `src/test/${-1===name.indexOf('.')?'App.':''}${name}-universal.6.js`
  , generateMethodUniversal(name)
) })


//// 9.  src/test/Base.Sub.foo-browser.6.js      As above, for browsers only

methods.forEach( name => { generateOrRemove(
    `src/test/${-1===name.indexOf('.')?'App.':''}${name}-browser.6.js`
  , generateMethodBrowser(name)
) })


//// 10. src/test/Base.Sub.foo-nonbrowser.6.js   As above, for Node.js only

methods.forEach( name => { generateOrRemove(
    `src/test/${-1===name.indexOf('.')?'App.':''}${name}-nonbrowser.6.js`
  , generateMethodNonbrowser(name)
) })




//// EDIT @TODO MOVE TO `oomtility/docs.js`


//// 1. src/main/README.md                      Documentation for each class
// @todo


//// 3. support/docs.html                       Documentation for each class
// @todo




//// UTILITY


////
function generateOrRemove (path, content) {
    const exists = fs.existsSync(path)
    if (remove && ! exists)
        return console.warn(`Doesn’t exist: ${path}`)
    if (! remove && exists)
        return console.warn(`Already exists: ${path}`)
    if (remove)
        fs.unlinkSync(path)
    else
        fs.writeFileSync(path, content)
}


////
function generateClass (name) {
    const isTop = 2 > name.split('.').length
    return wrapped.getClass6Js({
        isApp: false
      , isTop
      , classname: `${projectTC}.${name}`
      , topline
      , remarks: '@TODO'
    })
}


////
function generateClassUniversal (name) {
    const isTop = 2 > name.split('.').length
    return wrapped.getClassUniversal6Js({
        isApp: false
      , isTop
      , classname: `${projectTC}.${name}`
      , topline
    })
}


////
function generateClassBrowser (name) {
    const isTop = 2 > name.split('.').length
    return wrapped.getClassBrowser6Js({
        isApp: false
      , isTop
      , classname: `${projectTC}.${name}`
      , topline
    })
}


////
function generateClassNonbrowser (name) {
    const isTop = 2 > name.split('.').length
    return wrapped.getClassNonbrowser6Js({
        isApp: false
      , isTop
      , classname: `${projectTC}.${name}`
      , topline
    })
}


////
function generateDemoScript (name) {
    return wrapped.getDemo6Js({
        classname: `${projectTC}.${name}`
      , topline
    })
}


////
function generateDemoPage (name) {
    return wrapped.getClassDemoHtml({
        classname: `${projectTC}.${name}`
      , projectTC
      , name
      , homepage: projectURL
      , repo: projectRepo
      , npm: projectNPM
    })
}


////
function generateMethod (name) {
    return wrapped.getMethod6Js({
        methodname: `${projectTC}.${name}`
      , topline
      , remarks: '@TODO'
    })
}


////
function generateMethodUniversal (name) {
    return wrapped.getMethodUniversal6Js({
        methodname: `${projectTC}.${name}`
      , topline
    })
}


////
function generateMethodBrowser (name) {
    return wrapped.getMethodBrowser6Js({
        methodname: `${projectTC}.${name}`
      , topline
    })
}


////
function generateMethodNonbrowser (name) {
    return wrapped.getMethodNonbrowser6Js({
        methodname: `${projectTC}.${name}`
      , topline
    })
}




}()
