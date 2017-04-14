module.exports = config => {
  return {
    container: {
      className: "group"
    },
    boxRect: {
      ref: "box",
      rx: config.nodeRadius,
      ry: config.nodeRadius
    },
    labelText: {
      ref: "label",
      className: "group-label drag"
    },
    descriptionText: {
      className: "group-description"
    }
  };
}