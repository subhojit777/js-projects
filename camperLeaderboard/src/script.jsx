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
          <li data-val={this.props.anotherOption}><a href="#">{this.props.anotherOptionText}</a></li>
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
      selectedOptionText: 'Top thirty days campers',
      anotherOption: 'topAllTimeCampers',
      anotherOptionText: 'Top all time campers'
    };
  },
  componentWillMount: function() {
    // By default show top thirty days campers.
    $.getJSON(this.props.topThirtyDaysCampersSourceUrl, function(data) {
      this.setState({
        campers: data
      });

      // Hide progress bar.
      $('.board-wrapper').removeClass('hidden');
      $('.progress').addClass('hidden');

      // Enable tooltip.
      $('[data-toggle="tooltip"]').tooltip();
    }.bind(this));
  },
  componentDidMount: function() {
    var self = this;
    var elementBoardWrapper = $('.board-wrapper');
    var elementProgress = $('.progress');

    $('.dropdown-menu li').click(function() {
      // Show progress bar.
      elementBoardWrapper.addClass('hidden');
      elementProgress.removeClass('hidden');

      // Perform action based on the selected option in `Switcher` component.
      switch ($(this).attr('data-val')) {
        case 'topThirtyDaysCampers':
          $(this).attr('data-selected', 'true');
          $(this).next().removeAttr('data-selected');

          $.getJSON(self.props.topThirtyDaysCampersSourceUrl, function(data) {
            self.setState({
              campers: data,
              selectedOptionText: 'Top thirty days campers',
              anotherOption: 'topAllTimeCampers',
              anotherOptionText: 'Top all time campers'
            });

            // Hide progress bar.
            elementBoardWrapper.removeClass('hidden');
            elementProgress.addClass('hidden');
          }.bind(self));

          break;

        case 'topAllTimeCampers':
          $(this).attr('data-selected', 'true');
          $(this).prev().removeAttr('data-selected');

          $.getJSON(self.props.topAllTimeCampersSourceUrl, function(data) {
            self.setState({
              campers: data,
              selectedOptionText: 'Top all time campers',
              anotherOption: 'topThirtyDaysCampers',
              anotherOptionText: 'Top thirty days campers'
            });

            // Hide progress bar.
            elementBoardWrapper.removeClass('hidden');
            elementProgress.addClass('hidden');
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
          <div className="board-wrapper hidden">
            <Switcher anotherOption={this.state.anotherOption} selectedOptionText={this.state.selectedOptionText} anotherOptionText={this.state.anotherOptionText} />
            <Board campers={this.state.campers} />
          </div>
          <div className="progress">
            <div className="progress-bar progress-bar-striped active" role="progressbar" style={{width: '100%'}}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<CamperLeaderboard />, mountNode);
