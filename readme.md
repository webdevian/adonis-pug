[![Build Status](https://travis-ci.org/webdevian/adonis-pug.svg?branch=master)](https://travis-ci.org/webdevian/adonis-pug) [![Coverage Status](https://coveralls.io/repos/github/webdevian/adonis-pug/badge.svg?branch=master)](https://coveralls.io/github/webdevian/adonis-pug?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/webdevian/adonis-pug.svg)](https://greenkeeper.io/) [![Maintainability](https://api.codeclimate.com/v1/badges/af5c99c485663e078c61/maintainability)](https://codeclimate.com/github/webdevian/adonis-pug/maintainability)


# Adonis 4 Compatibility WIP

Complete refactor to bring everything inline with the AdonisViewProvider

### TODO

- Missing functionality
  - Config validation and warnings
  - Make view command
- Document code

# adonis-pug

[Pug](https://github.com/pugjs/pug) templating provider for AdonisJs framework version 4.

## Installation

In order to use adonis-pug

```
npm install adonis-pug --save
```

Once you have installed the provider from [npm](https://npmjs.org/packages/adonis-pug), make sure that the ViewProvider is registered as a provider inside start/app.js file.

```javascript
const providers = [
  'adonis-pug/providers/ViewProvider'
]
```

Make sure the default edge provider (`@adonisjs/framework/providers/ViewProvider`) is not registered as they will conflict with each other.

## Config

Pug options can be added to `config/pug.js`, these will be passed to the pug engine:

```javascript
  module.exports = {
    pretty: false,
    cache: false, // Recommend setting this to true for 10x big performance boost
    doctype: undefined,
    filters: undefined,
    self: false,
    debug: false
  }
```

## Usage

Let’s start with the basic example of saying `Hello world` by rendering a pug template. All of the views are stored inside resources/views directory and ends with .pug extension.

Create a pug template at `resources/views/hello.pug`

Now let's create a route that renders it:

```javascript
Route.get('/', ({ view }) => {
  return view.render('home')
})
```

The view.render method takes the relative path to the view file. There is no need to type .pug extension.


## Methods

## TODO JSDOC to markdown for api docs here


## View Helpers

A number of global methods and contextual helpers are injected into all views.

### Request

All views have access to the current request object, and you can call request methods inside your templates as well.

```pug
p The request URL is #{request.url()}
```

Also, there is a direct helper to get the URL.

```pug
p The request URL is #{url}
```

### css

Add link tag to a CSS file. The file name should be relative from the public directory. Absolute links are left alone (for external CDNs etc)

``` pug
!= css('style')
// Renders <link rel='stylesheet' href="/style.css">
```

### script

Similar to css, adds a script tag to the document

``` pug
!= script('my-script')
// Renders <script type="text/javascript" src="/my-script.js"></script>'
```

### assetsUrl
Returns path of a file relative from the public directory.

```pug
img(src=assetsUrl('logo.png'))
// Renders <img src='/logo.png' />
```

### route
Get actual URL for a route

Expecting the route to be registered as following

```javascript
Route.get('users/:id', 'UserController.show').as('profile')
```

```pug
a(href=route('profile', { id: 1 })) View Profile
// Renders <a href="/users/1">View Profile</a>
```

Also, you can use the controller method name.

```pug
a(href="route('UserController.show', { id: 1 }) View profile
```

### auth
If you are using the auth provider, then you can access the current logged in user using the `auth.user` object.

###csrfField
If you are using the shield middleware, you can access the `csrfToken` and field using one of the following methods.

```pug
!= csrfField()
// Renders <input type="hidden" name="_csrf" value="..." />
```

### cspMeta

When using shield middleware, the CSP headers are set automatically. However can also set them using HTML meta tags.

```pug
head
  != cspMeta()
```

## Extending views

You can also extend views by adding your view globals or tags. Globals and tags should only be added once, so make sure to use the start/hooks.js file to extend views.

### Globals

``` javascript
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const View = use('View')

  View.global('currentTime', function () {
    return new Date().getTime()
  })
})
```

Above global returns the current time when you reference it inside the views.

```pug
p The time is #{currentTime()}
```

You can extract the code inside providersBooted to a different file and require it.

### Globals scope

The value of `this` inside globals closure is bound to the template context so that you can access runtime values from it.

To use other global methods or values, make use of the this.globals object.

```javascript
View.global('messages', {
  success: 'This is a success message',
  warning: 'This is a warning message'
})

View.global('getMessage', function (type) {
  return this.globals.messages[type]
})
```

```pug
p= getMessage('success')
// Renders <p>This is a success message</p>
```

### Runtime values

Quite often you want to share request specific values with your views, this can be done in middleware or controllers by passing an object to the share method.

```javascript
class SomeMiddleware {
  async handle ({ view }, next) {
    view.share({
      apiVersion: request.input('version')
    })

    await next()
  }
}
```

Inside your views, you can access it like any other variable

```pug
p= apiVersion
```
