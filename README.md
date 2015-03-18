middlewarize
============

Make modules/classes work like middleware (for express and restify)
Works great with [tjmehta/dat-middleware](https://github.com/tjmehta/dat-middleware)


# Installation
```bash
npm install mongooseware
```

# Examples

## Class methods
```js
var mw = require('dat-middleware');
var Cat = function (name, sound) {
  this.name = name;
  this.sound = sound || 'meow';
};
Cat.areMammals = function () {
  return true;
};
Cat.asyncAreMammals = function (cb) {
  cb(null, true);
};
Cat.prototype.speak = function () {
  return this.sound;
};
Cat.prototype.asyncSpeak = function (cb) {
  cb(null, this.sound);
};
var blogs = require('mongooseware')(BlogModel);
var app = require('express')();

var cats = {
  /*<name>: cat*/
};

app.post('cats',
  mw.body('name').require().string().pick(),
  cat.new('garfield', 'prrr'), // new calls constructor
  function (req, res, next) {
    cats.push(req.cat);
    next();
  },
  mw.res.send('cat') // automatically saves instance to req.cat
);
app.post('cats/actions/are-mammals',
  cat.areMammals().sync('catsAreMammals'), // saves the return value to "req.catsAreMammals"
    // or just use "cat.areMammals()" which saves the return value to "req.catResult"
  mw.res.send('catsAreMammals') // response sends "req.catsAreMammals" which equals "true"
);

app.post('cats/:name/actions/async-are-mammals',
  cat.asyncAreMammals('cb').async('catsAreMammals'), // saves the callback value to "req.catsAreMammals"
    // or just use "cat.asyncAreMammals('cb')" which saves the callback value to "req.catResult"
  mw.res.send('catsAreMammals') // response sends "req.catsAreMammals" which equals "true"
);

```

## Class instance methods
```js
// continues above code
app.post('cats/:name/actions/speak',
  function (req, res, next) {
    req.cat = cats[req.params.name];
    next();
  },
  mw.req('cat').require()
    .then(
      cat.instance.speak().sync('sound'), // saves the return value to "req.sound"
        // or just use "cat.instance.speak()" which saves the return value to "req.catResult"
      mw.res.send('sound') // response sends "req.sound" which equals "req.cat.sound"
    )
    .else(
      mw.next(mw.Boom.notFound('cat not found'))
    )
);

app.post('cats/:name/actions/async-speak',
  function (req, res, next) {
    req.cat = cats[req.params.name];
    next();
  },
  mw.req('cat').require()
    .then(
      cat.instance.asyncSpeak('cb').async('sound'), // saves the callback value to "req.sound"
        // or just use "cat.instance.asyncSpeak('cb')" which saves the callback value to "req.catResult"
      mw.res.send('sound') // response sends "req.sound" which equals "req.cat.sound"
    )
    .else(
      mw.next(mw.Boom.notFound('cat not found'))
    )
);
```

## method-chain(args.., 'cb').async([reqKey], [reqKey2], ...)
Specify the key to which an async method's results should be saved to on req

## method-chain(args..).sync([reqKey])
Specify the key to which an sync method's return value should be saved to on req

# License
### MIT

