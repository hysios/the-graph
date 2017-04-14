module.exports = factories => {
  return {
    createPortGroup: factories.createGroup,
    createPortBackgroundCircle: factories.createCircle,
    createPortArc: factories.createPath,
    createPortInnerCircle: factories.createCircle,
    createPortLabelText: factories.createText
  };
}