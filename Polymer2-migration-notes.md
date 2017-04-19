Change old pre 1.0 Polymer callback `polymer-ready`

```js
window.addEventListener('polymer-ready', function (e) {
```

Instead use `WebComponentsReady`

```html
  <script type="text/javascript">
    // Polymer.veiledElements = ["the-graph-editor"];
    window.addEventListener('WebComponentsReady', function (e) {
```

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

### GraphNav

We need to properly set up the [observers for Polymer 2.0](https://www.polymer-project.org/2.0/docs/devguide/observers)

Observers are methods invoked when observable changes occur to the element's data.
*Complex observers* can observe one or more properties or `paths`.

#### Observe sub-property changes

To observe changes in object sub-properties:

- Define an observers array.
- Add an item to the observers array. The item must be a method name followed by a comma-separated list of one or more paths. For example, onNameChange(dog.name) for one path, or onNameChange(dog.name, cat.name) for multiple paths. Each path is a sub-property that you want to observe.
- Define the method in your element prototype. When the method is called, the argument to the method is the new value of the sub-property.

```js
  // Observe the name sub-property on the user object
  static get observers() {
    return [
        'userNameChanged(user.name)'
    ]
  }

  userNameChanged: function(name) {
    if (name) {
      // ...
```

So the following old Polymer observers

```js
observe: {
    'editor.scale': 'editorScaleChanged',
    'editor.width': 'editorWidthChanged',
    'editor.height': 'editorHeightChanged',
    'editor.pan': 'editorPanChanged',
    'editor.theme': 'editorThemeChanged'
}
```

In Polymer 2.0 format:

```js
static get observers() {
  return [
    '_editorScaleChanged(editor.scale)',
    '_editorWidthChanged(editor.width)',
    '_editorHeightChanged(editor.height)',
    '_editorPanChanged(editor.pan)',
    '_editorThemeChanged(editor.theme)'
  ]
}
```

### Drag and Drop etc.

In the old version, there were distinct track events such as `trackstart`, `track` and `trackend` ie.

`domNode.addEventListener("trackstart", this.onTrackStart);`

The new `Polymer.Gestures` is more elegant, using a single `track` event with detail event information to act on:

```js
Polymer.Gestures.addListener(node, 'tap', e => this.tapHandler(e));
Polymer.Gestures.addListener(node, 'track', e => this.trackHandler(e));

tapHandler(e) {

}
trackHandler: function (event) {
  // Don't fire on graph
  event.stopPropagation();
  console.log('track state', event.detail.state);
  switch (event.detail.state) {
    case 'start':
      this._onTrackStart(event);
      break;
    case 'track':
      this._onTrack(event);
      break;
    case 'end':
      this._onTrackEnd(event);
      break;
  }
},


_onTrack: function (event) {
  var scale = this.props.app.state.scale;
  var detail = event.detail
  var deltaX = Math.round(detail.ddx / scale);
  var deltaY = Math.round(detail.ddy / scale);

    var coords = {
      x: this.props.node.metadata.x + deltaX,
      y: this.props.node.metadata.y + deltaY
    }

    console.log('Node redraw', coords);
    // TODO: Fix!?
    this.props.graph.setNodeMetadata(this.props.nodeID, coords);
```

See [setNodeMetadata](https://github.com/flowbased/fbp-graph/blob/master/src/Graph.coffee#L434)

`class Graph extends EventEmitter` uses `@emit` (from [events](https://www.npmjs.com/package/events) to emit events, ie. `@emit 'changeNode', node, before, metadata`. Somehow we need to listen and react to these events I believe...

We can find this event listener in `the-graph-graph.js`

```js
componentDidMount: function () {
  // To change port colors
  this.props.graph.on("addEdge", this.resetPortRoute);
  this.props.graph.on("changeEdge", this.resetPortRoute);
  this.props.graph.on("removeEdge", this.resetPortRoute);
  this.props.graph.on("removeInitial", this.resetPortRoute);

  // Listen to fbp-graph graph object's events

  // ==========================
  // HERE!!!!
  // ==========================
  this.props.graph.on("changeNode", this.markDirty);

  this.props.graph.on("changeInport", this.markDirty);
  this.props.graph.on("changeOutport", this.markDirty);
  this.props.graph.on("endTransaction", this.markDirty);
},

markDirty: function (event) {
  if (event && event.libraryDirty) {
    this.libraryDirty = true;
  }
  // Re-RENDER!!!
  window.requestAnimationFrame(this.triggerRender);
},

triggerRender: function (time) {
  if (!this.isMounted()) {
    return;
  }
  if (this.dirty) {
    return;
  }
  this.dirty = true;
  console.log('forceUpdate', this.dirty)
  this.forceUpdate();
},
shouldComponentUpdate: function () {
  // If ports change or nodes move, then edges need to rerender, so we do the whole graph
  return this.dirty;
},
```

[Very bad to use forceUpdate in React](http://stackoverflow.com/questions/35617580/if-using-forceupdate-is-discouraged-how-should-components-react-to-change-eve)

See [React: Re-rendering A Component](https://www.reactenlightenment.com/basic-react-components/6.10.html)

Instead, `dirty` should be part of the props, ie. `dirty: false` in the `initialState` and set to true via `setState`.

### Edges

We need for the preview edges to be drawn correctly!

In `TheGraph` we have a method to render the preview of an edge.
Somehow the `targetY` value is not calculated correctly!

```js
  renderPreviewEdge: function (event) {
    console.log('renderPreviewEdge', event)
```

- OLD: `{edgePreviewX: 348, edgePreviewY: 186}`
- NEW: `{edgePreviewX: 332, edgePreviewY: 304}`

`edgePreviewY` is now calculated way too high!

Turns out this was because there was an extra `<h1>` element, pushing down the graph to make mouse coords out of sync. We need to use some offset as well!

Solved by getting `svgcontainer` and adjusting by `offsetLeft` and `offsetTop`.

```js
var offX = svgcontainer.offsetLeft
var offY = svgcontainer.offsetTop
var edgePreviewX = ((x - state.x) / scale) - offX
var edgePreviewY = ((y - state.y) / scale) - offY
```

## Complete/connect edge

We need to connect Node ports with edge:

This is controlled from the graph `Port`, where the `trackHandler` calls `triggerDropOnTarget`

```js
  case 'end':
    this.triggerDropOnTarget(event);
```

which (ideally) dispatches a `CustomEvent` called `the-graph-edge-drop`.

```js
  // If dropped on a child element will bubble up to port
  if (!event.relatedTarget) {
    return;
  }

  var dropEvent = new CustomEvent('the-graph-edge-drop', {
    detail: null,
    bubbles: true
  });
  event.relatedTarget.dispatchEvent(dropEvent);
```

However, if dropped a node where [relatedTarget](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget) or `target` is `null` then bubble up!?

The handler `node.addEventListener("the-graph-edge-drop", this.edgeStart);` is set to call `edgeStart`

which dispatches `the-graph-edge-start` with info...

```js
      var edgeStartEvent = new CustomEvent('the-graph-edge-start', {
        detail: {
          isIn: this.props.isIn,
          port: this.props.port,
          // process: this.props.processKey,
          route: this.props.route
        },
        bubbles: true
      });
      ReactDOM.findDOMNode(this).dispatchEvent(edgeStartEvent);
```

to be caught by Graph `App` handler

```js
  // Edge preview
  domNode.addEventListener("the-graph-edge-start", this.edgeStart);
```

Which calls `edgeStart` of the `Graph`

```js
    edgeStart: function (event) {
      // Listened from PortMenu.edgeStart() and Port.edgeStart()
      console.log('App edgeStart', event)
      // calls TheGraph .edgeStart
      this.refs.graph.edgeStart(event);
      this.hideContext();
    },
```

and then the `Graph` will: *Complete edge if this is the second tap and ports are compatible*

```js
  edgeStart: function (event) {
    // Forwarded from App.edgeStart()

    // Port that triggered this
    var port = event.detail.port;
    let edgePreview = this.state.edgePreview
    if (edgePreview) {
      // Complete edge if this is the second tap and ports are compatible
      var isCon = edgePreview.isIn === event.detail.isIn
      if (isCon) {
        // TODO also check compatible types
        var halfEdge = this.state.edgePreview;
        console.log('Half edge before', halfEdge)
        if (event.detail.isIn) {
          halfEdge.to = port;
        } else {
          halfEdge.from = port;
        }
        console.log('Half edge', halfEdge)
        this.addEdge(halfEdge);
        this.cancelPreviewEdge();
        return;
      }
```

For some reason the event port (such as `out-0` is the same as the event port, which should be the in port (such as `in-0`) of the node released on. Something goes wrong in the event handlers!

This will make `halfEdge` only get half set (`from`), whereas in the original `the-graph` app both `to` and `from` are set.

The root cause must be found in `triggerDropOnTarget`. Where

```js
  // If dropped on a child element will bubble up to port
  if (!event.relatedTarget) {
```

Was changed to:

```js
  var target = event.relatedTarget || event.target
```

To make the target not `null`. Somehow we are not using the new event system correctly just yet and this has consequences!

[MouseEvent API](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent)

```
"relatedTarget", optional and defaulting to null, of type EventTarget,
that is the element just left (in case of  a mouseenter or mouseover)
or is entering (in case of a mouseout or mouseleave).
```

[Explained](http://stackoverflow.com/questions/31865416/what-is-the-difference-between-event-target-event-toelement-and-event-srcelemen) and [mouse events explained](https://www.quirksmode.org/js/events_mouse.html)

IF no `relatedTarget`, it should bubble up! but doesn't work :()

```
  var target = event.relatedTarget
  console.log('out on', target)
  if (!target) {
    // is child element, bubble up'
    return;
  }
```

Maybe we have to use `hover()` — a function that may be called to determine the element currently being hovered

```js
  let hoverElem = event.hover()
  console.log('hover on', hoverElem)
```

Yup, finally it works!

```js
trackHandler: function (event) {
  // ...
  case 'end':
    let hoverElem = detail.hover()
    console.log('hover on', hoverElem)
    event.relatedTarget = hoverElem
```

YUHUUU!!!!