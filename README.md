# Polymer App Toolbox - Starter Kit

[![Build Status](https://travis-ci.org/PolymerElements/polymer-starter-kit.svg?branch=master)](https://travis-ci.org/PolymerElements/polymer-starter-kit)

## Running The Graph

1 Clone repo
2 Install [latest Poymer CLI](https://www.polymer-project.org/2.0/docs/tools/polymer-cli) npm and bower
3 Install dependencies
4 Build `dist/the-graph.js`

### Install global binaries

```
npm install npm@latest -g
npm install -g polymer-cli@next
npm install -g bower
```

### Install dependencies

```
npm install
bower install
```

### Build

`npm run build`

### Serve

Start server `polymer serve`

Open browser `http://127.0.0.1:8081/examples/demo-network.html`

Check browser console output.

### Gotchas

Main issues left should be in the .html files of the `/examples` folder

[equivalent to polymer-ready event](http://stackoverflow.com/questions/30667685/is-there-an-equivelent-to-the-polymer-ready-event-in-polymer-1-0)

Change old pre 1.0 Polymer callback `polymer-ready`

```js
window.addEventListener('polymer-ready', function (e) {
```

To use sth like `WebComponentsReady` (CE v1 compatible?) or maybe just [document ready](http://stackoverflow.com/questions/9899372/pure-javascript-equivalent-to-jquerys-ready-how-to-call-a-function-when-the)

```html
  <script type="text/javascript">
    // Polymer.veiledElements = ["the-graph-editor"];
    window.addEventListener('WebComponentsReady', function (e) {
```

It loads but no graph is displayed. More debugging needed...

## Changes from 1.x to 2.x

See [Changes](https://codelabs.developers.google.com/codelabs/polymer-2-carousel/index.html?index=..%2F..%2Findex#2)

If you used Polymer 1.x, these callbacks look a little different, but they're mostly parallel with the Polymer 1.x callbacks:

- `created` changes to `constructor`
- `attached` changes to `connectedCallback`
- `detached` changes to `disconnectedCallback`
- `attributeChanged` changes to `attributeChangedCallback`

Example:

```js
  connectedCallback() {
    super.connectedCallback();
  }
```

## Observe properties

```js
  return {
    selected: {
      type: Object,
      observer: '_selectedChanged'
    }
  };
```

```js
_selectedChanged(selected, oldSelected) {
  if (oldSelected) oldSelected.removeAttribute('selected');
  if (selected) selected.setAttribute('selected', '');
}
```

## Current issues

`PolymerGestures is not defined` in `the-graph-node.js`

```js
  // PolymerGestures monkeypatch
  function patchGestures() {
    PolymerGestures.dispatcher.gestures.forEach( function (gesture) {
```

[deprecated: polymer-gestures](https://github.com/Polymer/polymer-gestures)

See [2.0 gesture-events](https://www.polymer-project.org/2.0/docs/devguide/gesture-events)

Use `Polymer.GestureEventListeners` mixin.

```html
<link rel="import" href="../bower_components/polymer/lib/mixins/gesture-event-listeners.html">
```

Solution: *For now we are removing support for Gesture events...*

### The Graph elem: event listeners

Event listeners not correct. Can we still use `on` or need to use another mechanism/API?

```js
  _graphChanged(graph, oldGraph) {
    this.log('graphChanged', graph, oldGraph)
    if (oldGraph && oldGraph.removeListener) {
      oldGraph.removeListener("endTransaction", this.fireChanged);
    }
    // Listen for graph changes
    var _graph = this.graph
    this.log('add observers/listeners to _graph', _graph)
    _graph.on("endTransaction", this.fireChanged.bind(this));
```

### the-graph-app

The polymer class for `the-graph-elem` calls the React element:

```js
var app = {
  graph: graph,
  width: this.width,
  minZoom: this.minZoom,
  maxZoom: this.maxZoom,
  height: this.height,
  library: this.library,
  menus: this.menus,
  editable: this.editable,
  onEdgeSelection: this.onEdgeSelection.bind(this),
  onNodeSelection: this.onNodeSelection.bind(this),
  onPanScale: this.onPanScale.bind(this),
  getMenuDef: this.getMenuDef,
  displaySelectionGroup: this.displaySelectionGroup,
  forceSelection: this.forceSelection,
  offsetY: this.offsetY,
  offsetX: this.offsetX
}
console.log('app', app)
if (!graph) {
  throw new Error('no app to render!!')
}

this.appView = ReactDOM.render(
  window.TheGraph.App(app),
  this.$.svgcontainer
);
this.graphView = this.appView.refs.graph;
```

We need to debug how `TheGraph.App` receives the `app` and maintains/renders it in React.

```js
TheGraph.App = React.createFactory(React.createClass({
  ...
```

#### undefined unwrap

Trying to shield unwrap if not defined... what is it trying to do?
I think it is using `findDOMNode` on a React `ref` (ie `refs.canvas`)

```js
      if (typeof unwrap !== 'undefined') {
        this.bgCanvas = unwrap(ReactDOM.findDOMNode(this.refs.canvas));
        this.bgContext = unwrap(this.bgCanvas.getContext('2d'));
      } else {
        console.error('no unwrap!')
      }
```

From `polymer/polymer.js`

```js
  // ShadowDOM
  ShadowDOMPolyfill = null;
  wrap = unwrap = function(n){
    return n;
  };
```

Solution: We have simply added this identity funtion for now!

#### undefined `c` (canvas)

```js
  renderCanvas: function (c) {
    // Comment this line to go plaid
    c.clearRect(0, 0, this.state.width, this.state.height);
```

## Getting started

First read these articles!!

- [Getting started with web components and Polymer 2.0](https://hackernoon.com/getting-started-with-web-components-and-polymer-2-0-part-1-9142d780d77e)
- [Building a Polymer 2 carousel element](https://codelabs.developers.google.com/codelabs/polymer-2-carousel/index.html?index=..%2F..%2Findex#0)
## Polymer project

This template is a starting point for building apps using a drawer-based
layout. The layout is provided by `app-layout` elements.

This template, along with the `polymer-cli` toolchain, also demonstrates use
of the "PRPL pattern" This pattern allows fast first delivery and interaction with
the content at the initial route requested by the user, along with fast subsequent
navigation by pre-caching the remaining components required by the app and
progressively loading them on-demand as the user navigates through the app.

The PRPL pattern, in a nutshell:

* **Push** components required for the initial route
* **Render** initial route ASAP
* **Pre-cache** components for remaining routes
* **Lazy-load** and progressively upgrade next routes on-demand

### Migrating from Polymer Starter Kit v1?

[Check out our blog post that covers what's changed in PSK2 and how to migrate!](https://www.polymer-project.org/1.0/blog/2016-08-18-polymer-starter-kit-or-polymer-cli.html)

### Quickstart

We've recorded a Polycast to get you up and running with PSK2 fast!

<p align="center">
  <a href="https://www.youtube.com/watch?v=HgJ0XCyBwzY&list=PLNYkxOF6rcIDdS7HWIC_BYRunV6MHs5xo&index=10">
    <img src="https://img.youtube.com/vi/HgJ0XCyBwzY/0.jpg" alt="Polymer Starter Kit 2 video">
  </a>
</p>

## The Graph

The Graph currently uses Grunfile to build `dist/the-graph.js` to include in `index.html` and which includes all the React components used!!

### Building

Get dependencies and build:

    npm install
    npm run build


```
$ npm run build
...
Bundle dist/the-graph.js created.
````

However, also see `src/index.js` where `TheGraph` object is configured:

`g.TheGraph.editor = require('./the-graph-editor/the-graph-editor.js');`

ONLY PROBLEM NOW:

`TheGraph.editor` is not exported so it is global, via `module.exports = g.TheGraph;`

Trying to load from `index.html` like this:

```html
  <!-- Browserify Libraries -->
  <script src="/dist/the-graph.js"></script>
```



### Running

    npm start



### Setup

##### Prerequisites

First, install [Polymer CLI](https://github.com/Polymer/polymer-cli) using
[npm](https://www.npmjs.com) (we assume you have pre-installed [node.js](https://nodejs.org)).

    npm install -g polymer-cli

##### Initialize project from template

    mkdir my-app
    cd my-app
    polymer init starter-kit

### Start the development server

This command serves the app at `http://localhost:8080` and provides basic URL
routing for the app:

    polymer serve --open

### Build

This command performs HTML, CSS, and JS minification on the application
dependencies, and generates a service-worker.js file with code to pre-cache the
dependencies based on the entrypoint and fragments specified in `polymer.json`.
The minified files are output to the `build/unbundled` folder, and are suitable
for serving from a HTTP/2+Push compatible server.

In addition the command also creates a fallback `build/bundled` folder,
generated using fragment bundling, suitable for serving from non
H2/push-compatible servers or to clients that do not support H2/Push.

    polymer build

### Preview the build

This command serves the minified version of the app at `http://localhost:8080`
in an unbundled state, as it would be served by a push-compatible server:

    polymer serve build/unbundled

This command serves the minified version of the app at `http://localhost:8080`
generated using fragment bundling:

    polymer serve build/bundled

### Run tests

This command will run [Web Component Tester](https://github.com/Polymer/web-component-tester)
against the browsers currently installed on your machine:

    polymer test

### Adding a new view

You can extend the app by adding more views that will be demand-loaded
e.g. based on the route, or to progressively render non-critical sections of the
application. Each new demand-loaded fragment should be added to the list of
`fragments` in the included `polymer.json` file. This will ensure those
components and their dependencies are added to the list of pre-cached components
and will be included in the `bundled` build.
