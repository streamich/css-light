
export function extend<T> (obj1: T, obj2: T, ...objs: T[]): T {
    if(typeof obj2 === 'object') for(var i in obj2) obj1[i] = obj2[i];

    if(objs.length) return extend.apply(null, [obj1, ...objs]);
    else return obj1;
}


export var atoms = {
    d: 'display',
    mar: 'margin',
    pad: 'padding',
    bd: 'border',
    col: 'color',
    op: 'opacity',
    bg: 'background',
    fz: 'font-size',
    fs: 'font-style',
    bxz: 'box-sizing',
    cur: 'cursor',
    ov: 'overflow',
    pos: 'position',
    ls: 'list-style',
    td: 'text-decoration',
    fl: 'float',
    w: 'width',
    h: 'height',
};


export function toBlocks(pojo): [string, string[]][] {
    var blocks = [];

    for(var selector in pojo) { if(pojo.hasOwnProperty(selector)) { (function process_block(styles) {
        if(!(styles instanceof Array)) styles = [styles];

        var tmp: any = {};
        for (var s of styles) { (function merge_styles(styles) {
            if(styles instanceof Array) {
                styles = merge_styles(styles);
                return;
            }
            switch(typeof styles) {
                case 'object':
                    extend(tmp, styles);
                    break;
            }
        })(s);}
        styles = tmp;

        var statements = [];
        blocks.push([selector, statements]);
        for(var prop in styles) { if(styles.hasOwnProperty(prop)) { (function process_style(style) {
            switch(typeof style) {
                case 'string':
                case 'number':
                    prop = atoms[prop] || prop;
                    statements.push(prop + ':' + style);
                    break;
                case 'object':
                    var innerpojo: any;
                    if(prop.indexOf('&') > -1) {
                        innerpojo = {[prop.replace('&', selector)]: style};
                    } else {
                        innerpojo = {[selector + ' ' + prop]: style};
                    }
                    blocks = blocks.concat(toBlocks(innerpojo));
                    break;
                case 'function':
                    process_style(style(selector, styles, prop));
                    break;
            }
        })(styles[prop]);}}
    })(pojo[selector]);}}

    return blocks;
}


export function css(pojo): string {
    var blocks = toBlocks(pojo);

    var blockstrs = [];
    for(var i = 0; i < blocks.length; i++) {
        if(blocks[i][1].length)
            blockstrs.push(blocks[i][0] + '{' + blocks[i][1].join(';') + '}');
    }
    return blockstrs.join('\n');
}

// Inject CSS into DOM
// export function inject(css) {
//
// }
