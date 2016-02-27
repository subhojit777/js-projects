var mountNode = document.getElementById('camper-leaderboard');

var Switcher = React.createClass({
  displayName: "Switcher",

  render: function () {
    return React.createElement(
      "div",
      { className: "dropdown" },
      React.createElement(
        "button",
        { className: "btn btn-default dropdown-toggle", type: "button", id: "switcher-menu", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "true" },
        this.props.selectedOptionText,
        " ",
        React.createElement("span", { className: "caret" })
      ),
      React.createElement(
        "ul",
        { className: "dropdown-menu", "aria-labelledby": "switcher-menu" },
        React.createElement(
          "li",
          { "data-selected": "true", "data-val": "topThirtyDaysCampers" },
          React.createElement(
            "a",
            { href: "#" },
            "Top thirty days campers"
          )
        ),
        React.createElement(
          "li",
          { "data-val": "topAllTimeCampers" },
          React.createElement(
            "a",
            { href: "#" },
            "Top all time campers"
          )
        )
      )
    );
  }
});

var Board = React.createClass({
  displayName: "Board",

  render: function () {
    return React.createElement(
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
          this.props.campers.map(function (object, i) {
            return React.createElement(Row, { position: i, object: object, key: i });
          })
        )
      )
    );
  }
});

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
      campers: [],
      selectedOptionText: 'Top thirty days campers'
    };
  },
  componentWillMount: function () {
    $.getJSON(this.props.topThirtyDaysCampersSourceUrl, function (data) {
      this.setState({
        campers: data
      });
    }.bind(this));
  },
  componentDidMount: function () {
    var self = this;

    $('.dropdown-menu li').click(function () {
      if ($(this).attr('data-selected') == 'true') {
        return false;
      }

      switch ($(this).attr('data-val')) {
        case 'topThirtyDaysCampers':
          $(this).attr('data-selected', 'true');
          $(this).next().removeAttr('data-selected');

          $.getJSON(self.props.topThirtyDaysCampersSourceUrl, function (data) {
            self.setState({
              campers: data,
              selectedOptionText: 'Top thirty days campers'
            });
          }.bind(self));

          break;

        case 'topAllTimeCampers':
          $(this).attr('data-selected', 'true');
          $(this).prev().removeAttr('data-selected');

          $.getJSON(self.props.topAllTimeCampersSourceUrl, function (data) {
            self.setState({
              campers: data,
              selectedOptionText: 'Top all time campers'
            });
          }.bind(self));

          break;
      }
    });
  },
  render: function () {
    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        "div",
        { className: "col-sm-12" },
        React.createElement(Switcher, { selectedOptionText: this.state.selectedOptionText }),
        React.createElement(Board, { campers: this.state.campers })
      )
    );
  }
});

ReactDOM.render(React.createElement(CamperLeaderboard, null), mountNode);