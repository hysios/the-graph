var chai, describeRender, findSvgRoot, parseFBP, waitReady;

chai = window.chai || require('chai');

parseFBP = function(fbpString, callback) {
  var fbpGraph;
  fbpGraph = window.fbpGraph || require('fbp-graph');
  return fbpGraph.graph.loadFBP(fbpString, function(err, n) {
    var ref;
    if (err instanceof fbpGraph.Graph) {
      ref = [null, err], err = ref[0], n = ref[1];
    }
    if (err) {
      return callback(err);
    }
    return callback(null, n.toJSON());
  });
};

findSvgRoot = function(editor) {
  var apps, container, graph;
  graph = editor.$.graph;
  container = graph.$.svgcontainer;
  apps = container.getElementsByClassName('app-svg');
  console.log('g', apps);
  return apps[0];
};

waitReady = function(editor, callback) {
  return setTimeout(callback, 1000);
};

describeRender = function(editor) {
  var d, svgRoot;
  svgRoot = findSvgRoot(editor);
  return d = {
    nodes: svgRoot.getElementsByClassName('node'),
    edges: svgRoot.getElementsByClassName('edge'),
    initials: svgRoot.getElementsByClassName('iip')
  };
};

describe('Basics', function() {
  var editor;
  editor = null;
  before(function(done) {
    editor = document.getElementById('editor');
    chai.expect(editor).to.exist;
    return done();
  });
  after(function(done) {
    return done();
  });
  return describe('loading a simple graph', function() {
    var render;
    render = null;
    before(function(done) {
      var example;
      example = "'42' -> CONFIG foo(Foo) OUT -> IN bar(Bar)";
      return parseFBP(example, function(err, graph) {
        chai.expect(err).to.not.exist;
        editor.graph = graph;
        return waitReady(editor, function(err) {
          if (err) {
            return err;
          }
          render = describeRender(editor);
          return done();
        });
      });
    });
    it('should render 2 nodes', function() {
      return chai.expect(render.nodes).to.have.length(2);
    });
    it('should render 1 edge', function() {
      return chai.expect(render.edges).to.have.length(1);
    });
    return it('should render 1 IIP', function() {
      return chai.expect(render.initials).to.have.length(1);
    });
  });
});
