# css-light

Super light-weight package to write CSS in JavaScript. At only 100 lines
of code this module has everything you need to generate CSS from plain
JavaScript objects on the server or client.

```js
var css = require('css-light');
console.log(css.css({
    '.block': {
        border: '1px solid red',
    }
}));
```

This will generate:

    .block{border:1px solid red}


## Variables

```js
var fontStack = 'Helvetica, sans-serif';
var primaryColor = '#333';
console.log(css.css({
    body: {
        font: `100% ${fontStack}`,
        color: primaryColor,
    }
}));
```

Output:

    body{font:100% Helvetica, sans-serif;color:#333}

## Nesting

```js
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
```

Output:

    nav ul{margin:0;padding:0;list-style:none}
    nav li{display:inline-block}
    nav a{display:block;padding:6px 12px;text-decoration:none}


## Mixins

```js
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
```

Output:

    .box{-webkit-border-radius:10px;-moz-border-radius:10px;-ms-border-radius:10px;border-radius:10px}
    .another-box{-webkit-border-radius:20px;-moz-border-radius:20px;-ms-border-radius:20px;border-radius:20px;background:red}
    .another-box .child{font-size:}


## Extend/Inheritance

```js
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
```

Output:

    .message{border:1px solid #ccc;padding:10px;color:#333}
    .success{border:1px solid #ccc;padding:10px;color:#333;border-color:green}
    .error{border:1px solid #ccc;padding:10px;color:#333;border-color:red}


## Operators

Use standard JavaScript to do calculations `*`, `/`, `+`, `-`:

```js
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
```

Output:
    
    article[role="main"]{float:left;width:62.5%}
    aside[role="complementary"]{float:right;width:31.25%}


## `&` Operator

The `&` operator is replaced by the parent selector:

```js
console.log(css.css({
    '.parent': {
        '.child': { color: 'red'},
        '& .child': { color: 'red'},
        '&.child': { color: 'red'},
    }
}));
```

Output:

    .parent .child{color:red}
    .parent .child{color:red}
    .parent.child{color:red}


## Atoms

`css-light` comes with a short list of *atoms* for commonly used CSS properties,
for example, use `pad` instead of `padding`:

```js
console.log(css.css({
    'div': {
        padding: '0 0 0 0',
        pad: '0 0 0 0',
    }
}));
```

Output:

    div{padding:0 0 0 0;padding:0 0 0 0}

Print the full list of *atoms*:

```js
console.log(css.atoms);
```

Output:
    
    { d: 'display',
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
      h: 'height' }


## Media Queries

```js
// ## Media queries
console.log(css.css({
    '@media (max-width: 600px)': {
        '.facet_sidebar': {
            display: 'none'
        }
    }
}));
```

Output:

    @media (max-width: 600px){
        .facet_sidebar{display:none}
    }

## Nested lists

```js
console.log(css.css({
    'section, div': {
        'h1, h2': {
            'span, .light': {
                td: 'none'
            },
        },
    },
}));
```

Output:

    section h1 span, div h1 span,section  h2 span, div  h2 span,section h1  .light, div h1  .light,section  h2  .light, div  h2  .light{text-decoration:none}

