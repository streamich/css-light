"use strict";
function extend(obj1, obj2) {
    var objs = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        objs[_i - 2] = arguments[_i];
    }
    if (typeof obj2 === 'object')
        for (var i in obj2)
            obj1[i] = obj2[i];
    if (objs.length)
        return extend.apply(null, [obj1].concat(objs));
    else
        return obj1;
}
exports.extend = extend;
exports.atoms = {
    d: 'display',
    mar: 'margin',
    pad: 'padding',
    bd: 'border',
    col: 'color',
    op: 'opacity',
    bg: 'background',
    fz: 'font-size',
    fs: 'font-style',
    lh: 'line-height',
    bxz: 'box-sizing',
    cur: 'cursor',
    ov: 'overflow',
    pos: 'position',
    ls: 'list-style',
    ta: 'text-align',
    td: 'text-decoration',
    fl: 'float',
    w: 'width',
    h: 'height'
};
function toBlocks(pojo) {
    var blocks = [];
    for (var selector in pojo) {
        if (pojo.hasOwnProperty(selector)) {
            (function process_block(styles) {
                if (!(styles instanceof Array))
                    styles = [styles];
                var tmp = {};
                for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
                    var s = styles_1[_i];
                    (function merge_styles(styles) {
                        if (styles instanceof Array) {
                            styles = merge_styles(styles);
                            return;
                        }
                        switch (typeof styles) {
                            case 'object':
                                extend(tmp, styles);
                                break;
                        }
                    })(s);
                }
                styles = tmp;
                var statements = [];
                blocks.push([selector, statements]);
                for (var prop in styles) {
                    if (styles.hasOwnProperty(prop)) {
                        (function process_style(style) {
                            switch (typeof style) {
                                case 'string':
                                case 'number':
                                    prop = exports.atoms[prop] || prop;
                                    statements.push(prop + ':' + style);
                                    break;
                                case 'object':
                                    var innerpojo;
                                    if (prop.indexOf('&') > -1) {
                                        innerpojo = (_a = {}, _a[prop.replace('&', selector)] = style, _a);
                                    }
                                    else {
                                        innerpojo = (_b = {}, _b[selector + ' ' + prop] = style, _b);
                                    }
                                    blocks = blocks.concat(toBlocks(innerpojo));
                                    break;
                                case 'function':
                                    process_style(style(selector, styles, prop));
                                    break;
                            }
                            var _a, _b;
                        })(styles[prop]);
                    }
                }
            })(pojo[selector]);
        }
    }
    return blocks;
}
exports.toBlocks = toBlocks;
function css(pojo) {
    var blocks = toBlocks(pojo);
    var blockstrs = [];
    for (var i = 0; i < blocks.length; i++) {
        if (blocks[i][1].length)
            blockstrs.push(blocks[i][0] + '{' + blocks[i][1].join(';') + '}');
    }
    return blockstrs.join('\n');
}
exports.css = css;
// Inject CSS into DOM
// export function inject(css) {
//
// }
