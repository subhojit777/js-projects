var mountNode = document.getElementById('camper-leaderboard');

var Switcher = React.createClass({
  render: function() {
    return (
      <div className="dropdown">
        <button className="btn btn-default dropdown-toggle" type="button" id="switcher-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">{this.props.selectedOptionText} <span className="caret"></span></button>
        <ul className="dropdown-menu" aria-labelledby="switcher-menu">
          <li data-selected="true" data-val="topThirtyDaysCampers"><a href="#">Top thirty days campers</a></li>
          <li data-val="topAllTimeCampers"><a href="#">Top all time campers</a></li>
        </ul>
      </div>
    );
  }
});

var Board = React.createClass({
  render: function() {
    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <th>#</th>
            <th>Camper name</th>
            <th>Points in last 30 days</th>
            <th>All time points</th>
          </thead>
          <tbody>
            {this.props.campers.map(function(object, i) {
              return <Row position={i} object={object} key={i} />;
            })}
          </tbody>
        </table>
      </div>
    );
  }
});

var Row = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.position + 1}</td>
        <td><a href={"http://www.freecodecamp.com/" + this.props.object.username} target="_blank"><img width="50px" height="50px" src={this.props.object.img} className="img-responsive img-thumbnail" /><span className="username">{this.props.object.username}</span></a></td>
        <td>{this.props.object.recent}</td>
        <td>{this.props.object.alltime}</td>
      </tr>
    );
  }
});

var CamperLeaderboard = React.createClass({
  getDefaultProps: function() {
    return {
      topThirtyDaysCampersSourceUrl: 'http://fcctop100.herokuapp.com/api/fccusers/top/recent',
      topAllTimeCampersSourceUrl: 'http://fcctop100.herokuapp.com/api/fccusers/top/alltime',
    };
  },
  getInitialState: function() {
    return {
      campers: [],
      selectedOptionText: 'Top thirty days campers'
    };
  },
  componentWillMount: function() {
    $.getJSON(this.props.topThirtyDaysCampersSourceUrl, function(data) {
      this.setState({
        campers: data
      });
    }.bind(this));
  },
  componentDidMount: function() {
    var self = this;

    $('.dropdown-menu li').click(function() {
      if ($(this).attr('data-selected') == 'true') {
        return false;
      }

      switch ($(this).attr('data-val')) {
        case 'topThirtyDaysCampers':
          $(this).attr('data-selected', 'true');
          $(this).next().removeAttr('data-selected');

          $.getJSON(self.props.topThirtyDaysCampersSourceUrl, function(data) {
            self.setState({
              campers: data,
              selectedOptionText: 'Top thirty days campers'
            });
          }.bind(self));

          break;

        case 'topAllTimeCampers':
          $(this).attr('data-selected', 'true');
          $(this).prev().removeAttr('data-selected');

          $.getJSON(self.props.topAllTimeCampersSourceUrl, function(data) {
            self.setState({
              campers: data,
              selectedOptionText: 'Top all time campers'
            });
          }.bind(self));

          break;
      }
    });
  },
  render: function() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <Switcher selectedOptionText={this.state.selectedOptionText} />
          <Board campers={this.state.campers} />
        </div>
      </div>
    );
  }
});

ReactDOM.render(<CamperLeaderboard />, mountNode);
