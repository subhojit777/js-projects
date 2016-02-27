var mountNode = document.getElementById('camper-leaderboard');

var Row = React.createClass({
  displayName: "Row",

  render: function () {
    return React.createElement(
      "tr",
      null,
      React.createElement(
        "td",
        null,
        this.props.position + 1
      ),
      React.createElement(
        "td",
        null,
        React.createElement(
          "a",
          { href: "http://www.freecodecamp.com/" + this.props.object.username, target: "_blank" },
          React.createElement("img", { width: "50px", height: "50px", src: this.props.object.img, className: "img-responsive img-thumbnail" }),
          React.createElement(
            "span",
            { className: "username" },
            this.props.object.username
          )
        )
      ),
      React.createElement(
        "td",
        null,
        this.props.object.recent
      ),
      React.createElement(
        "td",
        null,
        this.props.object.alltime
      )
    );
  }
});

var CamperLeaderboard = React.createClass({
  displayName: "CamperLeaderboard",

  getDefaultProps: function () {
    return {
      topThirtyDaysCampersSourceUrl: 'http://fcctop100.herokuapp.com/api/fccusers/top/recent',
      topAllTimeCampersSourceUrl: 'http://fcctop100.herokuapp.com/api/fccusers/top/alltime'
    };
  },
  getInitialState: function () {
    return {
      topThirtyDaysCampers: [],
      topAllTimeCampers: []
    };
  },
  componentWillMount: function () {
    $.getJSON(this.props.topThirtyDaysCampersSourceUrl, function (data) {
      this.setState({
        topThirtyDaysCampers: data
      });
    }.bind(this));

    $.getJSON(this.props.topAllTimeCampersSourceUrl, function (data) {
      this.setState({
        topAllTimeCampers: data
      });
    }.bind(this));
  },
  render: function () {
    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        "div",
        { className: "col-sm-12" },
        React.createElement(
          "div",
          { className: "table-responsive" },
          React.createElement(
            "table",
            { className: "table" },
            React.createElement(
              "thead",
              null,
              React.createElement(
                "th",
                null,
                "#"
              ),
              React.createElement(
                "th",
                null,
                "Camper name"
              ),
              React.createElement(
                "th",
                null,
                "Points in last 30 days"
              ),
              React.createElement(
                "th",
                null,
                "All time points"
              )
            ),
            React.createElement(
              "tbody",
              null,
              this.state.topThirtyDaysCampers.map(function (object, i) {
                return React.createElement(Row, { position: i, object: object, key: i });
              })
            )
          )
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(CamperLeaderboard, null), mountNode);