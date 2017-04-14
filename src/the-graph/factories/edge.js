function createEdgePathArray(sourceX, sourceY,
  c1X, c1Y, c2X, c2Y,
  targetX, targetY) {
  return [
    "M",
    sourceX, sourceY,
    "C",
    c1X, c1Y,
    c2X, c2Y,
    targetX, targetY
  ];
}

module.exports = factories => {
  return {
    createEdgeGroup: factories.createGroup,
    createEdgeBackgroundPath: factories.createPath,
    createEdgeForegroundPath: factories.createPath,
    createEdgeTouchPath: factories.createPath,
    createEdgePathArray: createEdgePathArray,
    createArrow: factories.createPolygon
  };
}