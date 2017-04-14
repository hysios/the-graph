module.exports = factories => {
  return {
    createTooltipGroup: factories.createGroup,
    createTooltipRect: factories.createRect,
    createTooltipText: factories.createText
  };
}