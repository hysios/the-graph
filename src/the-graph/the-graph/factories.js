module.exports = TheGraph => {
  TheGraph.factories.createGroup = function (options, content) {
    var args = [options];

    if (Array.isArray(content)) {
      args = args.concat(content);
    }

    return React.DOM.g.apply(React.DOM.g, args);
  };

  TheGraph.factories.createRect = function (options) {
    return React.DOM.rect(options);
  };

  TheGraph.factories.createText = function (options) {
    return React.DOM.text(options);
  };

  TheGraph.factories.createCircle = function (options) {
    return React.DOM.circle(options);
  };

  TheGraph.factories.createPath = function (options) {
    return React.DOM.path(options);
  };

  TheGraph.factories.createPolygon = function (options) {
    return React.DOM.polygon(options);
  };

  TheGraph.factories.createImg = function (options) {
    return TheGraph.SVGImage(options);
  };

  TheGraph.factories.createCanvas = function (options) {
    return React.DOM.canvas(options);
  };

  TheGraph.factories.createSvg = function (options, content) {

    var args = [options];

    if (Array.isArray(content)) {
      args = args.concat(content);
    }

    return React.DOM.svg.apply(React.DOM.svg, args);
  };
}