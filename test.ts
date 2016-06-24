declare var require: any;
var css = require('./index');


var base = {
    color: 'red'
};


console.log(css.css({
    '.block': {
        border: '1px solid red',
        p: {
            a: {
                'background-color': 'red',
                opacity: 0.8
            }
        }
    }
}));
// .block{border:1px solid red}
// .block p a{background-color:red;opacity:0.8}


// ## Variables
var fontStack = 'Helvetica, sans-serif';
var primaryColor = '#333';
console.log(css.css({
    body: {
        font: `100% ${fontStack}`,
        color: primaryColor,
    }
}));


// ## Nesting
console.log(css.css({
    nav: {
        ul: {
            mar: 0,
            pad: 0,
            lis: 'none',
        },
        li: {d: 'inline-block'},
        a: {
            d: 'block',
            pad: '6px 12px',
            ted: 'none',
        }
    }
}));
// nav ul{margin:0;padding:0;list-style:none}
// nav li{display:inline-block}
// nav a{display:block;padding:6px 12px;text-decoration:none}


// ## Mixins
function borderRadius(radius) {
    return {
        '-webkit-border-radius': radius,
        '-moz-border-radius': radius,
        '-ms-border-radius': radius,
        'border-radius': radius,
    };
}
console.log(css.css({
    '.box': borderRadius('10px'),
    '.another-box': [
        borderRadius('20px'),
        {
            'background': 'red',
            '.child': {
                'font-size': '12pt',
            }
        }
    ],
}));
// .box{-webkit-border-radius:10px;-moz-border-radius:10px;-ms-border-radius:10px;border-radius:10px}
// .another-box{-webkit-border-radius:20px;-moz-border-radius:20px;-ms-border-radius:20px;border-radius:20px;background:red}
// .another-box .child{font-size:}


// ## Extend/Inheritance
var message = {
    bd: '1px solid #ccc',
    pad: '10px',
    col: '#333',
};
console.log(css.css({
    '.message': message,
    '.success': css.extend({}, message, {
        'border-color': 'green',
    }),
    '.error': [
        message,
        {
            'border-color': 'red',
        }
    ],
}));
// .message{border:1px solid #ccc;padding:10px;color:#333}
// .success{border:1px solid #ccc;padding:10px;color:#333;border-color:green}
// .error{border:1px solid #ccc;padding:10px;color:#333;border-color:red}


// ## Operators
console.log(css.css({
    'article[role="main"]': {
        fl: 'left',
        w: 600 / 960 * 100 + '%',
    },
    'aside[role="complementary"]': {
        fl: 'right',
        w: 300 / 960 * 100 + '%',
    }
}));
// article[role="main"]{float:left;width:62.5%}
// aside[role="complementary"]{float:right;width:31.25%}


// ## `&` Operator
console.log(css.css({
    '.parent': {
        '.child': { color: 'red'},
        '& .child': { color: 'red'},
        '&.child': { color: 'red'},
    }
}));
// .parent .child{color:red}
// .parent .child{color:red}
// .parent.child{color:red}


// ## Atoms
console.log(css.css({
    'div': {
        padding: '0 0 0 0',
        pad: '0 0 0 0',
    }
}));
// div{padding:0 0 0 0;padding:0 0 0 0}
console.log(css.atoms);

