module.exports.register = function (context) {

  var defaultNodeSize = 72;
  var defaultNodeRadius = 8;

  // Dumb module setup
  var TheGraph = context.TheGraph = {
    // nodeSize and nodeRadius are deprecated, use TheGraph.config.(nodeSize/nodeRadius)
    nodeSize: defaultNodeSize,
    nodeRadius: defaultNodeRadius,
    nodeSide: 56,
    // Context menus
    contextPortSize: 36,
    // Zoom breakpoints
    zbpBig: 1.2,
    zbpNormal: 0.4,
    zbpSmall: 0.01,
    config: {
      nodeSize: defaultNodeSize,
      nodeWidth: defaultNodeSize,
      nodeRadius: defaultNodeRadius,
      nodeHeight: defaultNodeSize,
      autoSizeNode: true,
      maxPortCount: 9,
      nodeHeightIncrement: 12,
      focusAnimationDuration: 1500
    },
    factories: {}
  };

  if (typeof window !== 'undefined') {
    // rAF shim
    window.requestAnimationFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame;
  }

  // Mixins to use throughout project
  TheGraph.mixins = {};

  var ToolTipMixin = require('./mixins/tooltip')

  // Show fake tooltip
  // Class must have getTooltipTrigger (dom node) and
  // shouldShowTooltip (boolean)
  TheGraph.mixins.Tooltip = ToolTipMixin

  require('./the-graph/utils')(TheGraph)
  require('./the-graph/factories')(TheGraph)

  // Reusable React classes
  const SvgImage = require('./the-graph/svg-image')
  TheGraph.SVGImage = React.createFactory(SvgImage);

  const TextBg = require('./the-graph/text-bg')
  TheGraph.TextBG = React.createFactory(TextBg);
};