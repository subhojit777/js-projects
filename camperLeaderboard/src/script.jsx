'use strict';

var mountNode = document.getElementById('camper-leaderboard');

/**
 * Switcher component.
 *
 * Provides option to switch between top thirty days campers and top all time
 * campers.
 */
var Switcher = React.createClass({
  render: function() {
    return (
      <div className="dropdown switcher">
        <button className="btn btn-primary dropdown-toggle" type="button" id="switcher-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">{this.props.selectedOptionText} <span className="caret"></span></button>
        <ul className="dropdown-menu" aria-labelledby="switcher-menu">
          <li data-selected="true" data-val="topThirtyDaysCampers"><a href="#">Top thirty days campers</a></li>
          <li data-val="topAllTimeCampers"><a href="#">Top all time campers</a></li>
        </ul>
      </div>
    );
  }
});

/**
 * Board component.
 *
 * Renders the main board where campers and their details are shown.
 */
var Board = React.createClass({
  render: function() {
    return (
      <div className="table-responsive board">
        <table className="table table-bordered table-hover">
          <thead>
            <th>#</th>
            <th>Camper</th>
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

/**
 * Row component.
 *
 * Renders "row" of `Board` component.
 */
var Row = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.position + 1}</td>
        <td><a href={"http://www.freecodecamp.com/" + this.props.object.username} target="_blank"><img src={this.props.object.img} className="img-responsive img-thumbnail camper-thumbnail" data-toggle="tooltip" data-placement="right" data-original-title={this.props.object.username} /></a></td>
        <td>{this.props.object.recent}</td>
        <td>{this.props.object.alltime}</td>
      </tr>
    );
  }
});

/**
 * CamperLeaderboard component.
 *
 * Main component that renders the whole stuff.
 */
var CamperLeaderboard = React.createClass({
  getDefaultProps: function() {
    return {
      topThirtyDaysCampersSourceUrl: 'http://fcctop100.herokuapp.com/api/fccusers/top/recent',
      topAllTimeCampersSourceUrl: 'http://fcctop100.herokuapp.com/api/fccusers/top/alltime'
    };
  },
  getInitialState: function() {
    return {
      campers: [],
      selectedOptionText: 'Top thirty days campers'
    };
  },
  componentWillMount: function() {
    // By default show top thirty days campers.
    $.getJSON(this.props.topThirtyDaysCampersSourceUrl, function(data) {
      this.setState({
        campers: data
      });
      $('[data-toggle="tooltip"]').tooltip();
    }.bind(this));
  },
  componentDidMount: function() {
    var self = this;

    $('.dropdown-menu li').click(function() {
      // Do not do anything if the current selection is selected.
      if ($(this).attr('data-selected') == 'true') {
        return false;
      }

      // Perform action based on the selected option in `Switcher` component.
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
          <h3 className="text-center">Camper leader board</h3>
          <Switcher selectedOptionText={this.state.selectedOptionText} />
          <Board campers={this.state.campers} />
        </div>
      </div>
    );
  }
});

ReactDOM.render(<CamperLeaderboard />, mountNode);
