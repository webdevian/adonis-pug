[![Build Status](https://travis-ci.org/webdevian/adonis-pug.svg?branch=master)](https://travis-ci.org/webdevian/adonis-pug) [![Coverage Status](https://coveralls.io/repos/github/webdevian/adonis-pug/badge.svg?branch=master)](https://coveralls.io/github/webdevian/adonis-pug?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/af5c99c485663e078c61/maintainability)](https://codeclimate.com/github/webdevian/adonis-pug/maintainability)


# Adonis 4 Compatibility branch - WIP

Complete refactor to bring everything inline with the AdonisViewProvider

### TODO

- Missing functionality
  - Config validation and warnings
  - Make view command
- Readme
  - Copy relevant stuff from Adonis View docs
  - document pass locals to render
  - Config
  - Badges

# adonis-pug

[Pug](https://github.com/pugjs/pug) templating provider for AdonisJs framework.

## Installation

In order to use adonis-pug

```
npm install adonis-pug --save
```

## Setup

Once you have installed the provider from the [npm](https://npmjs.org/packages/adonis-pug), make sure to follow these steps to setup the provider.

##### bootstrap/app.js

```javascript
const providers = [
  ...,
  'adonis-pug/providers/PugProvider'
]
```

Also, set up an alias to avoid typing the complete namespace.

##### bootstrap/app.js
```javascript
const aliases = {
  ...,
  Pug: 'Adonis/Addons/Pug'
}
```

## Config

Pug options can be added to `config/pug.js`:

```javascript
  module.exports = {
    basedir: 'resources/views',
    pretty: false,
    cache: false, // Recommend setting this to true for 10x big performance boost
    doctype: undefined,
    filters: undefined,
    self: false,
    debug: false
    globals: {
      moment: use('moment')
    },
    requestInject: {
      menu: 'mainMenu'
    }
  }
```

### Injection

You can add variables into pug globally using the globals object (see above). You can add any methods are properties from request to the pug scope with the requestInject array (see above). For example, you might have some middleware that fetches the menu for a given user and adds it to the request object as 'menu', this can be injected into every pug view as 'mainMenu' instead of passing it to the view in every controller.

## Helpers

The response.pug method automatically passes some useful functions and variables to your view data.

- `flashMessages` Flash message object from session
- `currentUser` Current User model instance from session
- `old()` Old method from request
- `cspNonce` The CSP Nonce
- `csrfToken` The CSRF Token
- `config()` Alias for Config.get()
- `input()` Alias for request.input()

## Mail

Adonis-pug extends adonis-mail-provider (if you have it installed) to render pug templates instead of nunjucks when using the Mail.send() method. To override Mail add this line:

##### bootstrap/app.js
```javascript
const aliases = {
  ...,
  Mail: 'Adonis/Addons/PugMail'
}
``` 

## Usage

##### Send a rendered pug template as a response
`use('Pug')` must be inserted somewhere to add the pug method to the response object. A good place for this is in `bootstrap/http.js`

```javascript
Route.get('/', function * (request, response) {
  response.pug('myPugTemplate', {
    message: 'Hello World'
  });
});
```

##### Output html from a rendered pug string
```javascript
const Pug = use('Pug')
Pug.renderString('p Hello World', options)
```

##### Output html from a rendered pug template
```javascript
const Pug = use('Pug')
Pug.render('myPugTemplate', {
  message: 'Hello World'
})
```
