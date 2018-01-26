!function () { 'use strict'

//// YOU MAY NEED TO ADD MORE CONST NAMES IN HERE:
const CONSTS = {
    isApp:      0
  , isTop:      0
  , classname:  0
  , methodname: 0
  , version:    0
  , homepage:   0
  , topline:    0
  , remarks:    0
}

const NAME     = 'Oomtility Wrap'
    , VERSION  = '1.0.14'
    , HOMEPAGE = 'https://oomtility.loop.coop'
    , HELP =
`
${NAME} ${VERSION}
${'='.repeat( (NAME+VERSION).length+1 )}

This Node.js script reads files, and converts them into JavaScript functions
which return that file as a string. It’s used to create most of the functions in
‘oomtility/wrapped.js’, and may be useful for general Oom development.

Installation
------------
If you haven’t done it already, you should set up the \`oomwrap\` alias:
$ node oomtility/alias.js

Basic Usage
-----------
$ cd /path/to/your/oom/repo/  # An Oom repo directory
$ oomwrap --version           # Show the current ${NAME} version
$ oomwrap                     # Update oomtility/wrapped.js with oomtility/wrap/
$ oomwrap foo.js bar/baz.png  # Output \`getFooJs()\` and \`getBazPng()\`

Options
-------
-d  --dummy     Write output to the console (stdout), not ‘oomtility/wrapped.js’
-h  --help      Show this help message
-v  --version   Show the current ${NAME} version

This script belongs to ${HOMEPAGE}
`


//// Validate the environment.
const nodePath = process.argv.shift()
const selfPath = process.argv.shift()
if ( '/oomtility/wrap.js' !== selfPath.slice(-18) )
    return console.warn('Unexpected environment!')
if ( ( process.cwd() !== selfPath.slice(0,-18) ) )
    return console.warn(`Unexpected CWD, try:\n  $ cd ${selfPath.slice(0,-18)}`)
if ('function' !== typeof require)
    return console.warn('Use Node.js instead:\n  $ node oomtility/make.js')




//// SETUP


//// Load library functionality.
const fs = require('fs')

//// Declare variables.
let opt, dummy, paths = [], out = []

//// Deal with command-line options.
while ( opt = process.argv.shift() ) {
    if ('-h' === opt || '--help'    === opt) return console.log(HELP)
    if ('-d' === opt || '--dummy'   === opt) { dummy = true; continue }
    if ('-v' === opt || '--version' === opt) return console.log(VERSION)
    paths.push(opt)
}

//// If no paths were specified, wrap the contents of ‘oomtility/wrap/’.
paths = fs.readdirSync('oomtility/wrap/').map( p => 'oomtility/wrap/' + p)




//// CONVERT FILES


//// Convert each file in `paths`.
paths.forEach( path => {
    const wrapped = []
    const expectedConsts = Object.assign({}, CONSTS)
    let inTemplateSection = false
    ;(fs.readFileSync(path, 'binary')+'').split('\n').forEach( (line, num) => {
        let c

        //// Deal with the start or end of a special `${{{` section. Or if we’re
        //// in a template section, just output the line verbatim.
        if ('${{{' === line) {
            inTemplateSection = true
            const prevLine = wrapped[wrapped.length-1]
            if ( prevLine && "\\n'" === prevLine.slice(-3) )
                wrapped[wrapped.length-1] = prevLine.slice(0, -3) + "' + ("
            else
                wrapped.push('  + (')
            return
        }
        if ('}}}' === line) {
            if (! inTemplateSection)
                throw Error(`Muddled end of '\${{{...}}}' in ${path}:${num}\n`)
            inTemplateSection = false
            return wrapped.push(") + '\\n'")
        }
        if (inTemplateSection) {
            for (c in expectedConsts)
                if ( 0 <= line.indexOf(c) )
                    expectedConsts[c]++
            return wrapped.push(line)
        }

        //// Deal with the special `${{double+template}}` markup.
        let start, end, doubleTemplates=[], doubleTemplateLut={}, rnd=rndCh8()
        while ( -1 !== (start = line.indexOf('${{')) ) {
            if (10 <= doubleTemplates.length)
                throw Error(`More than ten '\${{'s in ${path}:${num}\n`)
            end = line.indexOf('}}')
            if (0 <= start) {
                if (0 > end) throw Error(`Unmatched '\${{' in ${path}:${num}\n`)
                if (start > end) throw Error(`Muddled '\${{' in ${path}:${num}\n`)
                doubleTemplates.push( line.slice(start+3, end) )
                line =
                    line.slice(0,start)
                  + rnd + '#' + (doubleTemplates.length - 1)
                  + line.slice(end+2)
            }
        }

        //// Provide info for generating the config-to-const code.
        for (let i=0,tmpt; tmpt=doubleTemplates[i]; i++)
            for (c in expectedConsts)
                if ( 0 <= tmpt.indexOf(c) )
                    expectedConsts[c]++

        //// Escape backslashes, single-quotes, and unicode-escape non-ascii.
        line = line.replace(/\\/g, '\\\\')
        line = line.replace(/'/g, "\\'")
        line = encodeUTF16(line, '•') // avoid edge cases by adding a non-ascii

        //// Prevent double-templates markers from being split over two lines.
        for (let i=0,tmpt; tmpt=doubleTemplates[i]; i++) {
            const char = String.fromCharCode(0xB0+i) // ° to ¹
            line = line.replace(rnd+'#'+i, char)
            doubleTemplateLut[char] = tmpt
        }

        //// Deal with a line which does not need to be split.
        if (80 >= line.length) {
            line = line.replace(/•/g, 'u') // correct our edge-case avoider
            line = line.replace(/([°-¹])/g, (m,p1) =>
                `'+(${doubleTemplateLut[p1]})+'` ) // reinstate double-templates
            if ( "'+(" === line.slice(0,3) ) // remove useless code
                line = `  + ${line.slice(2)}\\n'`
            else
                line = `  + '${line}\\n'`
            return wrapped.push(line)
        }

        //// Deal with a line which must be split over two or more lines.
        for (let pos=0, len=80, reduction, sub; pos<line.length;) {
            while (len) {
                reduction = getLineLengthReduction(line, pos, len)
                if (! reduction) break // no need to reduce line length
                len -= reduction // found a ‘\’ or the result of `encodeUTF16()`
            }
            if (0 >= len)
                throw Error(`Too many backslashes in ${path}:${num}\n`)
            sub = line.substr(pos, len)
            sub = sub.replace(/•/g, 'u') // correct our edge-case avoider
            sub = sub.replace(/([°-¹])/g, (m,p1) =>
                `'+(${doubleTemplateLut[p1]})+'` ) // reinstate double-templates
            wrapped.push(`  + '${sub}'`)
            pos += len
            len = 80
        }

        //// Add a newline at the end of the last sub-line.
        wrapped[wrapped.length-1] = wrapped[wrapped.length-1].slice(0, -1) + "\\n'"

    })

    //// Remove the final newline.
    wrapped[wrapped.length-1] = wrapped[wrapped.length-1].slice(0, -3) + "'"

    out = out.concat([
        `//// An ${NAME} of ${path.split('/').pop()} \\\\//\\\\// ${HOMEPAGE} ////`
      , `module.exports.${pathToFnName(path)} = function (config) {`
    ])

    //// Generate the config-to-const code.
    let c, consts = [], configToConst = [], docomma = false
    for (c in expectedConsts)
        if (0 < expectedConsts[c])
            consts.push(c)
    if (0 < consts.length) {
        consts.forEach(c => {
            configToConst.push((docomma ? '      , ' : '        ') + c)
            docomma = true
        })
        out = out.concat('    let {', configToConst, '    } = config\n')
    }

    //// Add Some boilerplate around the wrapped code.
    out = out.concat("    return ''", wrapped, '}\n\n\n\n')

})


//// Write the result to console (if `--dummy` is set), or else the
//// ‘DYNAMIC SECTION’ of ‘oomtility/wrapped.js’.
out = out.join('\n')
if (dummy)
    console.log(out)
else
    updateWrappedJs('oomtility/wrapped.js', out)




//// UTILITY

function encodeUTF16 (str, u='u') {
    let pos=0, out='', code, hex
    str = utf8to16(str)
    for (; pos<str.length; pos++) {
        code = str.charCodeAt(pos)
        if (31 < code && 127 > code) {
            out += str[pos]
        } else {
            hex = code.toString(16)
            out += '\\' + u + ( '0'.repeat(4-hex.length) ) + hex
        }
    }
    return out;
}

//// from https://gist.github.com/weishuaiwang/4221687
function utf8to16(str) {
	var out, i, len, c;
	var char2, char3;
	out = "";
	len = str.length;
	i = 0;
	while (i < len) {
		c = str.charCodeAt(i++);
		switch (c >> 4) {
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
				// 0xxxxxxx
				out += str.charAt(i - 1);
				break;
			case 12:
			case 13:
				// 110x xxxx 10xx xxxx
				char2 = str.charCodeAt(i++);
				out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
				break;
			case 14:
				// 1110 xxxx10xx xxxx10xx xxxx
				char2 = str.charCodeAt(i++);
				char3 = str.charCodeAt(i++);
				out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
				break;
		}
	}
	return out;
}

function getLineLengthReduction (line, pos, len) {
    for (let i=1; i<6; i++) // find an encoding made by `encodeUTF16()`
        if ( /\\•[0-9a-f]{4}/.test( line.substr(pos+len-i,6) ) )
            return i
    if ( '\\' === line[pos+len-1] ) // find a backslash
        return 1
    return 0
}


//// Similar to `lcToTc()` in ‘init.js’. 'foo/bar-baz.txt' to 'getBarBazTxt'.
function pathToFnName (path) {
    return 'get' + (
        path.split('/').pop().split(/[- .]/g).map(
            w => w ? w[0].toUpperCase() + w.substr(1) : ''
        ).join('')
    )
}

////
function updateWrappedJs (wrappedPath, out) {
    let start = 0, end = 0
      , orig = (fs.readFileSync(wrappedPath, 'binary')+'').split('\n')
    for (; start<orig.length; start++)
        if (0 < orig[start].indexOf('BEGIN DYNAMIC SECTION //////////') ) break
    for (; end<orig.length; end++)
        if (0 < orig[end].indexOf('END DYNAMIC SECTION ////////////')   ) break
    if ( start === orig.length || end === orig.length)
        return console.warn(`Couldn’t find dynamic section in ‘${wrappedPath}’`)
    out = orig.slice(0, start+1).concat([
`//// oomtility/wrap/ files, processed by oomtility/wrap.js /////////////////////
`], [out], orig.slice(end))
    fs.writeFileSync( wrappedPath, out.join('\n'), 'binary' )
}

////
function rndCh (s, e) {
    return String.fromCharCode(Math.random() * (e-s) + s)
}

////
function rndCh8 () {
    return '12345678'.replace( /./g,         c=> rndCh(48,122) ) // 0-z
                     .replace( /[:-@\[-`]/g, c=> rndCh(97,122) ) // a-z
}

}()
