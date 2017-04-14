module.exports = TheGraph => {
  TheGraph.findMinMax = function (graph, nodes) {
    // console.log('findMinMax', graph)
    var inports, outports;
    if (nodes === undefined) {
      nodes = graph.nodes.map(function (node) {
        return node.id;
      });
      // Only look at exports when calculating the whole graph
      inports = graph.inports;
      outports = graph.outports;
    }
    if (nodes.length < 1) {
      return undefined;
    }
    var minX = Infinity;
    var minY = Infinity;
    var maxX = -Infinity;
    var maxY = -Infinity;

    // Loop through nodes
    var len = nodes.length;
    for (var i = 0; i < len; i++) {
      var key = nodes[i];
      var node = graph.getNode(key);
      if (!node || !node.metadata) {
        continue;
      }
      if (node.metadata.x < minX) {
        minX = node.metadata.x;
      }
      if (node.metadata.y < minY) {
        minY = node.metadata.y;
      }
      var x = node.metadata.x + node.metadata.width;
      var y = node.metadata.y + node.metadata.height;
      if (x > maxX) {
        maxX = x;
      }
      if (y > maxY) {
        maxY = y;
      }
    }
    // Loop through exports
    var keys, exp;
    if (inports) {
      keys = Object.keys(inports);
      len = keys.length;
      for (i = 0; i < len; i++) {
        exp = inports[keys[i]];
        if (!exp.metadata) {
          continue;
        }
        if (exp.metadata.x < minX) {
          minX = exp.metadata.x;
        }
        if (exp.metadata.y < minY) {
          minY = exp.metadata.y;
        }
        if (exp.metadata.x > maxX) {
          maxX = exp.metadata.x;
        }
        if (exp.metadata.y > maxY) {
          maxY = exp.metadata.y;
        }
      }
    }
    if (outports) {
      keys = Object.keys(outports);
      len = keys.length;
      for (i = 0; i < len; i++) {
        exp = outports[keys[i]];
        if (!exp.metadata) {
          continue;
        }
        if (exp.metadata.x < minX) {
          minX = exp.metadata.x;
        }
        if (exp.metadata.y < minY) {
          minY = exp.metadata.y;
        }
        if (exp.metadata.x > maxX) {
          maxX = exp.metadata.x;
        }
        if (exp.metadata.y > maxY) {
          maxY = exp.metadata.y;
        }
      }
    }

    if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
      return null;
    }
    return {
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY
    };
  };

  TheGraph.findFit = function (graph, width, height) {
    var limits = TheGraph.findMinMax(graph);
    if (!limits) {
      return {
        x: 0,
        y: 0,
        scale: 1
      };
    }
    limits.minX -= TheGraph.config.nodeSize;
    limits.minY -= TheGraph.config.nodeSize;
    limits.maxX += TheGraph.config.nodeSize * 2;
    limits.maxY += TheGraph.config.nodeSize * 2;

    var gWidth = limits.maxX - limits.minX;
    var gHeight = limits.maxY - limits.minY;

    var scaleX = width / gWidth;
    var scaleY = height / gHeight;

    var scale, x, y;
    if (scaleX < scaleY) {
      scale = scaleX;
      x = 0 - limits.minX * scale;
      y = 0 - limits.minY * scale + (height - (gHeight * scale)) / 2;
    } else {
      scale = scaleY;
      x = 0 - limits.minX * scale + (width - (gWidth * scale)) / 2;
      y = 0 - limits.minY * scale;
    }

    return {
      x: x,
      y: y,
      scale: scale
    };
  };

  TheGraph.findAreaFit = function (point1, point2, width, height) {
    var limits = {
      minX: point1.x < point2.x ? point1.x : point2.x,
      minY: point1.y < point2.y ? point1.y : point2.y,
      maxX: point1.x > point2.x ? point1.x : point2.x,
      maxY: point1.y > point2.y ? point1.y : point2.y
    };

    limits.minX -= TheGraph.config.nodeSize;
    limits.minY -= TheGraph.config.nodeSize;
    limits.maxX += TheGraph.config.nodeSize * 2;
    limits.maxY += TheGraph.config.nodeSize * 2;

    var gWidth = limits.maxX - limits.minX;
    var gHeight = limits.maxY - limits.minY;

    var scaleX = width / gWidth;
    var scaleY = height / gHeight;

    var scale, x, y;
    if (scaleX < scaleY) {
      scale = scaleX;
      x = 0 - limits.minX * scale;
      y = 0 - limits.minY * scale + (height - (gHeight * scale)) / 2;
    } else {
      scale = scaleY;
      x = 0 - limits.minX * scale + (width - (gWidth * scale)) / 2;
      y = 0 - limits.minY * scale;
    }

    return {
      x: x,
      y: y,
      scale: scale
    };
  };

  TheGraph.findNodeFit = function (node, width, height) {
    var limits = {
      minX: node.metadata.x - TheGraph.config.nodeSize,
      minY: node.metadata.y - TheGraph.config.nodeSize,
      maxX: node.metadata.x + TheGraph.config.nodeSize * 2,
      maxY: node.metadata.y + TheGraph.config.nodeSize * 2
    };

    var gWidth = limits.maxX - limits.minX;
    var gHeight = limits.maxY - limits.minY;

    var scaleX = width / gWidth;
    var scaleY = height / gHeight;

    var scale, x, y;
    if (scaleX < scaleY) {
      scale = scaleX;
      x = 0 - limits.minX * scale;
      y = 0 - limits.minY * scale + (height - (gHeight * scale)) / 2;
    } else {
      scale = scaleY;
      x = 0 - limits.minX * scale + (width - (gWidth * scale)) / 2;
      y = 0 - limits.minY * scale;
    }

    return {
      x: x,
      y: y,
      scale: scale
    };
  };

  // SVG arc math
  var angleToX = function (percent, radius) {
    return radius * Math.cos(2 * Math.PI * percent);
  };
  var angleToY = function (percent, radius) {
    return radius * Math.sin(2 * Math.PI * percent);
  };
  var makeArcPath = function (startPercent, endPercent, radius) {
    return [
      "M", angleToX(startPercent, radius), angleToY(startPercent, radius),
      "A", radius, radius, 0, 0, 0, angleToX(endPercent, radius), angleToY(endPercent, radius)
    ].join(" ");
  };
  TheGraph.arcs = {
    n4: makeArcPath(7 / 8, 5 / 8, 36),
    s4: makeArcPath(3 / 8, 1 / 8, 36),
    e4: makeArcPath(1 / 8, -1 / 8, 36),
    w4: makeArcPath(5 / 8, 3 / 8, 36),
    inport: makeArcPath(-1 / 4, 1 / 4, 4),
    outport: makeArcPath(1 / 4, -1 / 4, 4),
    inportBig: makeArcPath(-1 / 4, 1 / 4, 6),
    outportBig: makeArcPath(1 / 4, -1 / 4, 6),
  };


  // The `merge` function provides simple property merging.
  TheGraph.merge = function (src, dest, overwrite) {
    // Do nothing if neither are true objects.
    if (Array.isArray(src) || Array.isArray(dest) || typeof src !== 'object' || typeof dest !== 'object')
      return dest;

    // Default overwriting of existing properties to false.
    overwrite = overwrite || false;

    for (var key in src) {
      // Only copy properties, not functions.
      if (typeof src[key] !== 'function' && (!dest[key] || overwrite))
        dest[key] = src[key];
    }

    return dest;
  };

  TheGraph.getOffset = function (domNode) {
    var getElementOffset = function (element) {
      var offset = {
          top: 0,
          left: 0
        },
        parentOffset;
      if (!element) {
        return offset;
      }
      offset.top += (element.offsetTop || 0);
      offset.left += (element.offsetLeft || 0);
      parentOffset = getElementOffset(element.offsetParent);
      offset.top += parentOffset.top;
      offset.left += parentOffset.left;
      return offset;
    };
    try {
      return getElementOffset(domNode);
    } catch (e) {
      return getElementOffset();
    }
  };

}