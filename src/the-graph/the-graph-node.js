module.exports.register = function (context) {

  var TheGraph = context.TheGraph;

  // Initialize namespace for configuration and factory functions.
  TheGraph.config.node = {
    snap: TheGraph.config.nodeSize,
    container: {},
    background: {
      className: "node-bg"
    },
    border: {
      className: "node-border drag",
      rx: TheGraph.config.nodeRadius,
      ry: TheGraph.config.nodeRadius
    },
    innerRect: {
      className: "node-rect drag",
      x: 3,
      y: 3,
      rx: TheGraph.config.nodeRadius - 2,
      ry: TheGraph.config.nodeRadius - 2
    },
    icon: {
      ref: "icon",
      className: "icon node-icon drag"
    },
    iconsvg: {
      className: "icon node-icon drag"
    },
    inports: {
      className: "inports"
    },
    outports: {
      className: "outports"
    },
    labelBackground: {
      className: "node-label-bg"
    },
    labelRect: {
      className: "text-bg-rect"
    },
    labelText: {
      className: "node-label"
    },
    sublabelBackground: {
      className: "node-sublabel-bg"
    },
    sublabelRect: {
      className: "text-bg-rect"
    },
    sublabelText: {
      className: "node-sublabel"
    }
  };

  // These factories use generic factories from the core, but
  // each is called separately allowing developers to intercept
  // individual elements of the node creation.
  TheGraph.factories.node = {
    createNodeGroup: TheGraph.factories.createGroup,
    createNodeBackgroundRect: TheGraph.factories.createRect,
    createNodeBorderRect: TheGraph.factories.createRect,
    createNodeInnerRect: TheGraph.factories.createRect,
    createNodeIconText: TheGraph.factories.createText,
    createNodeIconSVG: TheGraph.factories.createImg,
    createNodeInportsGroup: TheGraph.factories.createGroup,
    createNodeOutportsGroup: TheGraph.factories.createGroup,
    createNodeLabelGroup: TheGraph.factories.createGroup,
    createNodeLabelRect: TheGraph.factories.createRect,
    createNodeLabelText: TheGraph.factories.createText,
    createNodeSublabelGroup: TheGraph.factories.createGroup,
    createNodeSublabelRect: TheGraph.factories.createRect,
    createNodeSublabelText: TheGraph.factories.createText,
    createNodePort: createNodePort
  };

  function createNodePort(options) {
    // console.log('createNodePort', options)
    return TheGraph.Port(options);
  }

  // PolymerGestures monkeypatch
  function patchGestures() {
    // console.log('patchGestures: currently disabled :(')
    // Polymer.Gestures.

    // DEPRECATED!!!
    // PolymerGestures.dispatcher.gestures.forEach( function (gesture) {
    //   // hold
    //   if (gesture.HOLD_DELAY) {
    //     gesture.HOLD_DELAY = 500;
    //   }
    //   // track
    //   if (gesture.WIGGLE_THRESHOLD) {
    //     gesture.WIGGLE_THRESHOLD = 8;
    //   }
    // });
  }

  const GraphNode = require('./components/graph-node')
  // const GraphNode = require('./components/graph-node-class')

  // Node view
  TheGraph.Node = React.createFactory(GraphNode);
};