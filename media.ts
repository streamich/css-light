declare var require: any;
var css = require('./index');


// ## Media queries
var pojo = {
    h1: {
        td: 'none',
    },
    '@media (max-width: 600px)': {
        '.facet_sidebar': {
            display: 'none'
        },
        h1: {
            color: 'red',
            span: {
                color: 'green',
            }
        }
    }
};
var bl = css.toBlocks(pojo);

console.log(bl);
console.log(bl[0][1]);
console.log(css.css(pojo));

