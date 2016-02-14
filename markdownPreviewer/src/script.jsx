// Copied from https://facebook.github.io/react/
var MarkdownPreviewer = React.createClass({
  getInitialState: function() {
    return {
      value: 'Write some **markdown** here!'
    };
  },
  handleChange: function() {
    this.setState({value: this.refs.textarea.value});
  },
  rawMarkup: function() {
    return { __html: marked(this.state.value, {sanitize: true}) };
  },
  render: function() {
    return (
      <div className="row">
        <div className="col-md-6">
          <h2>Input</h2>
          <textarea className="form-control" onChange={this.handleChange} ref="textarea" defaultValue={this.state.value} id="editor"></textarea>
        </div>
        <div className="col-md-6">
          <h2>Output</h2>
          <div className="well" id="previewer" dangerouslySetInnerHTML={this.rawMarkup()}></div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<MarkdownPreviewer />, document.getElementById('markdown-editor'));
