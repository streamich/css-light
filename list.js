var css = require('./index');
// ## Neste Lists
var pojo = {
    'h1, h2': {
        color: 'red',
        'span, .light': {
            td: 'none'
        }
    }
};
var bl = css.toBlocks(pojo);
console.log(bl);
// console.log(bl[0][1]);
// console.log(css.css(pojo));
