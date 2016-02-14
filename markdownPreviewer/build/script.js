var MarkdownPreviewer = React.createClass({
  displayName: "MarkdownPreviewer",

  getInitialState: function () {
    return {
      value: 'Type some **markdown** here!'
    };
  },
  handleChange: function () {
    this.setState({ value: this.refs.textarea.value });
  },
  rawMarkup: function () {
    return { __html: marked(this.state.value, { sanitize: true }) };
  },
  render: function () {
    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        "div",
        { className: "col-md-6" },
        React.createElement(
          "h2",
          null,
          "Input"
        ),
        React.createElement("textarea", { className: "form-control", onChange: this.handleChange, ref: "textarea", defaultValue: this.state.value, id: "editor" })
      ),
      React.createElement(
        "div",
        { className: "col-md-6" },
        React.createElement(
          "h2",
          null,
          "Output"
        ),
        React.createElement("div", { className: "well", id: "previewer", dangerouslySetInnerHTML: this.rawMarkup() })
      )
    );
  }
});

ReactDOM.render(React.createElement(MarkdownPreviewer, null), document.getElementById('markdown-editor'));