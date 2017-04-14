module.exports.register = function (context) {

  var TheGraph = context.TheGraph;

  var unwrap = function (n) {
    return n;
  }

  TheGraph.config.app = {
    container: {
      className: "the-graph-app",
      name: "app"
    },
    canvas: {
      ref: "canvas",
      className: "app-canvas"
    },
    svg: {
      className: "app-svg"
    },
    svgGroup: {
      className: "view"
    },
    graph: {
      ref: "graph"
    },
    tooltip: {
      ref: "tooltip"
    },
    modal: {
      className: "context"
    }
  };

  TheGraph.factories.app = {
    createAppContainer: createAppContainer,
    createAppCanvas: TheGraph.factories.createCanvas,
    createAppSvg: TheGraph.factories.createSvg,
    createAppSvgGroup: TheGraph.factories.createGroup,
    createAppGraph: createAppGraph,
    createAppTooltip: createAppTooltip,
    createAppModalGroup: TheGraph.factories.createGroup,
    createAppModalBackground: createAppModalBackground
  };

  // No need to promote DIV creation to TheGraph.js.
  function createAppContainer(options, content) {
    var args = [options];

    if (Array.isArray(content)) {
      args = args.concat(content);
    }

    return React.DOM.div.apply(React.DOM.div, args);
  }

  function createAppGraph(options) {
    return TheGraph.Graph(options);
  }

  function createAppTooltip(options) {
    return TheGraph.Tooltip(options);
  }

  function createAppModalBackground(options) {
    return TheGraph.ModalBG(options);
  }

  const GraphApp = require('./components/graph-app')(TheGraph)
  TheGraph.App = React.createFactory(GraphApp);
};