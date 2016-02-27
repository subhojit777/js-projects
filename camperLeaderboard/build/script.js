'use strict';

var mountNode = document.getElementById('camper-leaderboard');

/**
 * Switcher component.
 *
 * Provides option to switch between top thirty days campers and top all time
 * campers.
 */
var Switcher = React.createClass({
  displayName: 'Switcher',

  render: function () {
    return React.createElement(
      'div',
      { className: 'dropdown switcher' },
      React.createElement(
        'button',
        { className: 'btn btn-primary dropdown-toggle', type: 'button', id: 'switcher-menu', 'data-toggle': 'dropdown', 'aria-haspopup': 'true', 'aria-expanded': 'true' },
        this.props.selectedOptionText,
        ' ',
        React.createElement('span', { className: 'caret' })
      ),
      React.createElement(
        'ul',
        { className: 'dropdown-menu', 'aria-labelledby': 'switcher-menu' },
        React.createElement(
          'li',
          { 'data-selected': 'true', 'data-val': 'topThirtyDaysCampers' },
          React.createElement(
            'a',
            { href: '#' },
            'Top thirty days campers'
          )
        ),
        React.createElement(
          'li',
          { 'data-val': 'topAllTimeCampers' },
          React.createElement(
            'a',
            { href: '#' },
            'Top all time campers'
          )
        )
      )
    );
  }
});

/**
 * Board component.
 *
 * Renders the main board where campers and their details are shown.
 */
var Board = React.createClass({
  displayName: 'Board',

  render: function () {
    return React.createElement(
      'div',
      { className: 'table-responsive board' },
      React.createElement(
        'table',
        { className: 'table table-bordered table-hover' },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'th',
            null,
            '#'
          ),
          React.createElement(
            'th',
            null,
            'Camper'
          ),
          React.createElement(
            'th',
            null,
            'Points in last 30 days'
          ),
          React.createElement(
            'th',
            null,
            'All time points'
          )
        ),
        React.createElement(
          'tbody',
          null,
          this.props.campers.map(function (object, i) {
            return React.createElement(Row, { position: i, object: object, key: i });
          })
        )
      )
    );
  }
});

/**
 * Row component.
 *
 * Renders "row" of `Board` component.
 */
var Row = React.createClass({
  displayName: 'Row',

  render: function () {
    return React.createElement(
      'tr',
      null,
      React.createElement(
        'td',
        null,
        this.props.position + 1
      ),
      React.createElement(
        'td',
        null,
        React.createElement(
          'a',
          { href: "http://www.freecodecamp.com/" + this.props.object.username, target: '_blank' },
          React.createElement('img', { src: this.props.object.img, className: 'img-responsive img-thumbnail camper-thumbnail', 'data-toggle': 'tooltip', 'data-placement': 'right', 'data-original-title': this.props.object.username })
        )
      ),
      React.createElement(
        'td',
        null,
        this.props.object.recent
      ),
      React.createElement(
        'td',
        null,
        this.props.object.alltime
      )
    );
  }
});

/**
 * CamperLeaderboard component.
 *
 * Main component that renders the whole stuff.
 */
var CamperLeaderboard = React.createClass({
  displayName: 'CamperLeaderboard',

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
    // By default show top thirty days campers.
    $.getJSON(this.props.topThirtyDaysCampersSourceUrl, function (data) {
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
  componentDidMount: function () {
    var self = this;
    var elementBoardWrapper = $('.board-wrapper');
    var elementProgress = $('.progress');

    $('.dropdown-menu li').click(function () {
      // Show progress bar.
      elementBoardWrapper.addClass('hidden');
      elementProgress.removeClass('hidden');

      // Do not do anything if the current selection is selected.
      if ($(this).attr('data-selected') == 'true') {
        return false;
      }

      // Perform action based on the selected option in `Switcher` component.
      switch ($(this).attr('data-val')) {
        case 'topThirtyDaysCampers':
          $(this).attr('data-selected', 'true');
          $(this).next().removeAttr('data-selected');

          $.getJSON(self.props.topThirtyDaysCampersSourceUrl, function (data) {
            self.setState({
              campers: data,
              selectedOptionText: 'Top thirty days campers'
            });

            // Hide progress bar.
            elementBoardWrapper.removeClass('hidden');
            elementProgress.addClass('hidden');
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

            // Hide progress bar.
            elementBoardWrapper.removeClass('hidden');
            elementProgress.addClass('hidden');
          }.bind(self));

          break;
      }
    });
  },
  render: function () {
    return React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'div',
        { className: 'col-sm-12' },
        React.createElement(
          'h3',
          { className: 'text-center' },
          'Camper leader board'
        ),
        React.createElement(
          'div',
          { className: 'board-wrapper hidden' },
          React.createElement(Switcher, { selectedOptionText: this.state.selectedOptionText }),
          React.createElement(Board, { campers: this.state.campers })
        ),
        React.createElement(
          'div',
          { className: 'progress' },
          React.createElement(
            'div',
            { className: 'progress-bar progress-bar-striped active', role: 'progressbar', style: { width: '100%' } },
            'Loading...'
          )
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(CamperLeaderboard, null), mountNode);