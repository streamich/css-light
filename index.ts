
export function extend<T> (obj1: T, obj2: T, ...objs: T[]): T {
    if(typeof obj2 === 'object') for(var i in obj2) obj1[i] = obj2[i];

    if(objs.length) return extend.apply(null, [obj1, ...objs]);
    else return obj1;
}


export var atoms = {
    d:      'display',

    mar:    'margin',
    mart:   'margin-top',
    marr:   'margin-right',
    marb:   'margin-bottom',
    marl:   'margin-left',
    pad:    'padding',
    padt:   'padding-top',
    padr:   'padding-right',
    padb:   'padding-bottom',
    padl:   'padding-left',

    bd:     'border',
    bdt:    'border-top',
    bdr:    'border-right',
    bdb:    'border-bottom',
    bdl:    'border-left',
    bdrad:  'border-radius',

    col:    'color',
    op:     'opacity',
    bg:     'background',
    bgc:    'background-color',

    fz:     'font-size',
    fs:     'font-style',
    fw:     'font-weight',
    ff:     'font-family',

    lh:     'line-height',
    bxz:    'box-sizing',
    w_bxz:  '-webkit-box-sizing',
    m_bxz:  '-moz-box-sizing',
    cur:    'cursor',
    ov:     'overflow',
    pos:    'position',
    ls:     'list-style',
    ta:     'text-align',
    td:     'text-decoration',
    fl:     'float',
    w:      'width',
    h:      'height',
    trs:    'transition',
    out:    'outline',
    vis:    'visibility',
    ww:     'word-wrap',
    con:    'content',
};


export type Tselector = string;
export type Tstyles = string[];
export type Tblock = [Tselector, Tstyles];
export type Tquery = string;
export type Tmediablock = [Tquery, Tblock[]];


export function toBlocks(pojo): (Tblock|Tmediablock)[] {
    var blocks = [];
    for(var selector in pojo) { if(pojo.hasOwnProperty(selector)) { (function process_block(styles) {

        // `@media` query
        if(selector[0] === '@') {
            blocks.push([selector, toBlocks(styles)]);
            return;
        }

        var selectors = selector.split(',');

        if(!(styles instanceof Array)) styles = [styles];

        var statements = [];
        var block = [selector, statements];
        blocks.push(block);
        for(var st of styles) {
            for (var prop in st) {
                if (st.hasOwnProperty(prop)) {
                    (function process_style(style) {
                        switch (typeof style) {
                            case 'string':
                            case 'number':
                                prop = atoms[prop] || prop;
                                statements.push(prop + ':' + style);
                                break;
                            case 'object':
                                var props = prop.split(',');
                                var selector_list = [];

                                for(var p of props) {
                                    if (p.indexOf('&') > -1) {
                                        for(var sel of selectors) {
                                            selector_list.push(p.replace('&', sel));
                                        }
                                    } else {
                                        for(var sel of selectors) {
                                            selector_list.push(sel + ' ' + p);
                                        }
                                    }
                                }

                                var selectors_combined = selector_list.join(',');
                                var innerpojo = {[selectors_combined]: style};
                                blocks = blocks.concat(toBlocks(innerpojo));
                                break;
                            case 'function':
                                process_style(style(sel, styles, prop));
                                break;
                        }
                    })(st[prop]);
                }
            }
        }

    })(pojo[selector]);}}
    return blocks;
}


function concat(blocks) {
    var blockstrs = [];
    for(var i = 0; i < blocks.length; i++) {
        if(blocks[i][1].length) {
            if(typeof blocks[i][1][0] === 'string') { // `Tblock`
                blockstrs.push(blocks[i][0] + '{' + blocks[i][1].join(';') + '}');
            } else { // `Tmediablock`
                blockstrs.push(blocks[i][0] + '{' + concat(blocks[i][1]) + '}');
            }
        }
    }
    return blockstrs.join('');
}


export function css(pojo): string {
    var blocks = toBlocks(pojo);
    return concat(blocks);
}

// Inject CSS into DOM
// export function inject(css) {
//
// }
