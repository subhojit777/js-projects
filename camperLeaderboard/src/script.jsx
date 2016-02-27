var mountNode = document.getElementById('camper-leaderboard');

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
      topThirtyDaysCampers: [],
      topAllTimeCampers: []
    };
  },
  componentWillMount: function() {
    $.getJSON(this.props.topThirtyDaysCampersSourceUrl, function(data) {
      this.setState({
        topThirtyDaysCampers: data,
      });
    }.bind(this));

    $.getJSON(this.props.topAllTimeCampersSourceUrl, function(data) {
      this.setState({
        topAllTimeCampers: data,
      });
    }.bind(this));
  },
  render: function() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <th>#</th>
                <th>Camper name</th>
                <th>Points in last 30 days</th>
                <th>All time points</th>
              </thead>
              <tbody>
                {this.state.topThirtyDaysCampers.map(function(object, i) {
                  return <Row position={i} object={object} key={i} />;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<CamperLeaderboard />, mountNode);
