const reactMixin = require('react-mixin');
const Component = require('react').Component

module.exports = TheGraph => {
  // Const
  var CURVE = TheGraph.config.edge.curve;

  // Point along cubic bezier curve
  // See http://en.wikipedia.org/wiki/File:Bezier_3_big.gif
  var findPointOnCubicBezier = function (p, sx, sy, c1x, c1y, c2x, c2y, ex, ey) {
    // p is percentage from 0 to 1
    var op = 1 - p;
    // 3 green points between 4 points that define curve
    var g1x = sx * p + c1x * op;
    var g1y = sy * p + c1y * op;
    var g2x = c1x * p + c2x * op;
    var g2y = c1y * p + c2y * op;
    var g3x = c2x * p + ex * op;
    var g3y = c2y * p + ey * op;
    // 2 blue points between green points
    var b1x = g1x * p + g2x * op;
    var b1y = g1y * p + g2y * op;
    var b2x = g2x * p + g3x * op;
    var b2y = g2y * p + g3y * op;
    // Point on the curve between blue points
    var x = b1x * p + b2x * op;
    var y = b1y * p + b2y * op;
    return [x, y];
  };

  class GraphEdge extends Component {
    // static displayName = 'TheGraphEdge';
    get displayName() {
      return 'TheGraphEdge'
    }

    _addEventListener(node, event, handler, ...args) {
      node.addEventListener(event, handler.bind(this), ...args);
    }

    componentWillMount() {}
    componentDidMount() {
      var domNode = ReactDOM.findDOMNode(this);

      // Dragging
      domNode.addEventListener("track", this.trackHandler);

      if (this.props.onEdgeSelection) {
        // Needs to be click (not tap) to get event.shiftKey
        domNode.addEventListener("tap", this.onEdgeSelection);
      }

      // Context menu
      if (this.props.showContext) {
        domNode.addEventListener("contextmenu", this.showContext);
        domNode.addEventListener("hold", this.showContext);
      }
    }
    trackHandler(event) {
      switch (event.detail.state) {
        case 'start':
          this.dontPan(event);
      }
    }

    dontPan(event) {
      // Don't drag under menu
      if (this.props.app.menuShown) {
        event.stopPropagation();
      }
    }
    onEdgeSelection(event) {
      // Don't click app
      event.stopPropagation();

      var toggle = (TheGraph.metaKeyPressed || event.pointerType === "touch");
      this.props.onEdgeSelection(this.props.edgeID, this.props.edge, toggle);
    }
    showContext(event) {
      // Don't show native context menu
      event.preventDefault();

      // Don't tap graph on hold event
      event.stopPropagation();
      if (event.preventTap) {
        event.preventTap();
      }

      // Get mouse position
      var x = event.x || event.clientX || 0;
      var y = event.y || event.clientY || 0;

      // App.showContext
      this.props.showContext({
        element: this,
        type: (this.props.export ? (this.props.isIn ? "graphInport" : "graphOutport") : "edge"),
        x: x,
        y: y,
        graph: this.props.graph,
        itemKey: (this.props.export ? this.props.exportKey : null),
        item: (this.props.export ? this.props.export : this.props.edge)
      });

    }
    getContext(menu, options, hide) {
      return TheGraph.Menu({
        menu: menu,
        options: options,
        triggerHideContext: hide,
        label: this.props.label,
        iconColor: this.props.route
      });
    }
    shouldComponentUpdate(nextProps, nextState) {
      // Only rerender if changed
      return (
        nextProps.sX !== this.props.sX ||
        nextProps.sY !== this.props.sY ||
        nextProps.tX !== this.props.tX ||
        nextProps.tY !== this.props.tY ||
        nextProps.selected !== this.props.selected ||
        nextProps.animated !== this.props.animated ||
        nextProps.route !== this.props.route
      );
    }
    getTooltipTrigger() {
      return ReactDOM.findDOMNode(this.refs.touch);
    }
    shouldShowTooltip() {
      return true;
    }
    render() {
      var sourceX = this.props.sX;
      var sourceY = this.props.sY;
      var targetX = this.props.tX;
      var targetY = this.props.tY;

      // Organic / curved edge
      var c1X, c1Y, c2X, c2Y;
      if (targetX - 5 < sourceX) {
        var curveFactor = (sourceX - targetX) * CURVE / 200;
        if (Math.abs(targetY - sourceY) < TheGraph.config.nodeSize / 2) {
          // Loopback
          c1X = sourceX + curveFactor;
          c1Y = sourceY - curveFactor;
          c2X = targetX - curveFactor;
          c2Y = targetY - curveFactor;
        } else {
          // Stick out some
          c1X = sourceX + curveFactor;
          c1Y = sourceY + (targetY > sourceY ? curveFactor : -curveFactor);
          c2X = targetX - curveFactor;
          c2Y = targetY + (targetY > sourceY ? -curveFactor : curveFactor);
        }
      } else {
        // Controls halfway between
        c1X = sourceX + (targetX - sourceX) / 2;
        c1Y = sourceY;
        c2X = c1X;
        c2Y = targetY;
      }

      // Make SVG path

      var path = TheGraph.factories.edge.createEdgePathArray(sourceX, sourceY, c1X, c1Y, c2X, c2Y, targetX, targetY);
      path = path.join(" ");

      var backgroundPathOptions = TheGraph.merge(TheGraph.config.edge.backgroundPath, {
        d: path
      });
      var backgroundPath = TheGraph.factories.edge.createEdgeBackgroundPath(backgroundPathOptions);

      var foregroundPathClassName = TheGraph.config.edge.foregroundPath.className + this.props.route;
      var foregroundPathOptions = TheGraph.merge(TheGraph.config.edge.foregroundPath, {
        d: path,
        className: foregroundPathClassName
      });
      var foregroundPath = TheGraph.factories.edge.createEdgeForegroundPath(foregroundPathOptions);

      var touchPathOptions = TheGraph.merge(TheGraph.config.edge.touchPath, {
        d: path
      });
      var touchPath = TheGraph.factories.edge.createEdgeTouchPath(touchPathOptions);

      var containerOptions = {
        className: "edge" +
          (this.props.selected ? " selected" : "") +
          (this.props.animated ? " animated" : ""),
        title: this.props.label
      };

      containerOptions = TheGraph.merge(TheGraph.config.edge.container, containerOptions);

      var epsilon = 0.01;
      var center = findPointOnCubicBezier(0.5, sourceX, sourceY, c1X, c1Y, c2X, c2Y, targetX, targetY);

      // estimate slope and intercept of tangent line
      var getShiftedPoint = function (epsilon) {
        return findPointOnCubicBezier(
          0.5 + epsilon, sourceX, sourceY, c1X, c1Y, c2X, c2Y, targetX, targetY);
      };
      var plus = getShiftedPoint(epsilon);
      var minus = getShiftedPoint(-epsilon);
      var m = 1 * (plus[1] - minus[1]) / (plus[0] - minus[0]);
      var b = center[1] - (m * center[0]);

      // find point on line y = mx + b that is `offset` away from x,y
      var findLinePoint = function (x, y, m, b, offset, flip) {
        var x1 = x + offset / Math.sqrt(1 + m * m);
        var y1;
        if (Math.abs(m) === Infinity) {
          y1 = y + (flip || 1) * offset;
        } else {
          y1 = (m * x1) + b;
        }
        return [x1, y1];
      };

      var arrowLength = 12;
      // Which direction should arrow point
      if (plus[0] > minus[0]) {
        arrowLength *= -1;
      }
      center = findLinePoint(center[0], center[1], m, b, -1 * arrowLength / 2);

      // find points of perpendicular line length l centered at x,y
      var perpendicular = function (x, y, oldM, l) {
        var m = -1 / oldM;
        var b = y - m * x;
        var point1 = findLinePoint(x, y, m, b, l / 2);
        var point2 = findLinePoint(x, y, m, b, l / -2);
        return [point1, point2];
      };

      var points = perpendicular(center[0], center[1], m, arrowLength * 0.9);
      // For m === 0, figure out if arrow should be straight up or down
      var flip = plus[1] > minus[1] ? -1 : 1;
      var arrowTip = findLinePoint(center[0], center[1], m, b, arrowLength, flip);
      points.push(arrowTip);

      var pointsArray = points.map(
        function (point) {
          return point.join(',');
        }).join(' ');
      var arrowBg = TheGraph.factories.edge.createArrow({
        points: pointsArray,
        className: 'arrow-bg'
      });

      var arrow = TheGraph.factories.edge.createArrow({
        points: pointsArray,
        className: 'arrow fill route' + this.props.route
      });

      return TheGraph.factories.edge.createEdgeGroup(containerOptions, [backgroundPath, arrowBg, foregroundPath, touchPath, arrow]);
    }
  }

  var ToolTipMixin = require('../mixins/tooltip')
  reactMixin.bindClass(GraphEdge, ToolTipMixin)
  return GraphEdge
}