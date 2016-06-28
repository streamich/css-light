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
                // `@media` query
                if (selector[0] === '@') {
                    blocks.push([selector, toBlocks(styles)]);
                    return;
                }
                var selectors = selector.split(',');
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
                var block = [selector, statements];
                blocks.push(block);
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
                                    var props = prop.split(',');
                                    var selector_list = [];
                                    for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                                        var p = props_1[_i];
                                        if (p.indexOf('&') > -1) {
                                            for (var _a = 0, selectors_1 = selectors; _a < selectors_1.length; _a++) {
                                                var sel = selectors_1[_a];
                                                selector_list.push(p.replace('&', sel));
                                            }
                                        }
                                        else {
                                            for (var _b = 0, selectors_2 = selectors; _b < selectors_2.length; _b++) {
                                                var sel = selectors_2[_b];
                                                selector_list.push(sel + ' ' + p);
                                            }
                                        }
                                    }
                                    var selectors_combined = selector_list.join(',');
                                    var innerpojo = (_c = {}, _c[selectors_combined] = style, _c);
                                    block[0] = selectors_combined;
                                    blocks = blocks.concat(toBlocks(innerpojo));
                                    break;
                                case 'function':
                                    process_style(style(sel, styles, prop));
                                    break;
                            }
                            var _c;
                        })(styles[prop]);
                    }
                }
            })(pojo[selector]);
        }
    }
    return blocks;
}
exports.toBlocks = toBlocks;
function concat(blocks) {
    var blockstrs = [];
    for (var i = 0; i < blocks.length; i++) {
        if (blocks[i][1].length) {
            if (typeof blocks[i][1][0] === 'string') {
                blockstrs.push(blocks[i][0] + '{' + blocks[i][1].join(';') + '}');
            }
            else {
                blockstrs.push(blocks[i][0] + '{' + concat(blocks[i][1]) + '}');
            }
        }
    }
    return blockstrs.join('');
}
function css(pojo) {
    var blocks = toBlocks(pojo);
    return concat(blocks);
}
exports.css = css;
// Inject CSS into DOM
// export function inject(css) {
//
// }
