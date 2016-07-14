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
    mart: 'margin-top',
    marr: 'margin-right',
    marb: 'margin-bottom',
    marl: 'margin-left',
    pad: 'padding',
    padt: 'padding-top',
    padr: 'padding-right',
    padb: 'padding-bottom',
    padl: 'padding-left',
    bd: 'border',
    bdt: 'border-top',
    bdr: 'border-right',
    bdb: 'border-bottom',
    bdl: 'border-left',
    bdrad: 'border-radius',
    col: 'color',
    op: 'opacity',
    bg: 'background',
    bgc: 'background-color',
    fz: 'font-size',
    fs: 'font-style',
    fw: 'font-weight',
    ff: 'font-family',
    lh: 'line-height',
    bxz: 'box-sizing',
    w_bxz: '-webkit-box-sizing',
    m_bxz: '-moz-box-sizing',
    cur: 'cursor',
    ov: 'overflow',
    pos: 'position',
    ls: 'list-style',
    ta: 'text-align',
    td: 'text-decoration',
    fl: 'float',
    w: 'width',
    h: 'height',
    trs: 'transition',
    out: 'outline',
    vis: 'visibility',
    ww: 'word-wrap',
    con: 'content'
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
                var statements = [];
                var block = [selector, statements];
                blocks.push(block);
                for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
                    var st = styles_1[_i];
                    for (var prop in st) {
                        if (st.hasOwnProperty(prop)) {
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
                                        blocks = blocks.concat(toBlocks(innerpojo));
                                        break;
                                    case 'function':
                                        process_style(style(sel, styles, prop));
                                        break;
                                }
                                var _c;
                            })(st[prop]);
                        }
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
