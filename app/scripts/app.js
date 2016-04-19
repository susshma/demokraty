var React = window.React = require('react'),
    ReactDOM = require("react-dom");

// IMPORTANT: Replace below with your Firebase app URL
var firebaseUrl = "https://demokraty.firebaseio.com/polllist";

var PollForm = React.createClass({
  mixins: [ReactFireMixin],
  handleSubmit: function(event) {
    event.preventDefault();
    var name = this.refs.name.value.trim();
    var option1 = this.refs.option1.value.trim();
    var option2 = this.refs.option2.value.trim();
    var option3 = this.refs.option3.value.trim();
    var start_date = this.refs.start_date.value.trim();
    var end_date = this.refs.end_date.value.trim();
    var unix_start_date = new Date(start_date.split("").reverse().join("").replace(/\//g,'-'))/1000;
    var unix_end_date = new Date(start_date.split("").reverse().join("").replace(/\//g,'-'))/1000;
    // var state = function find_state (unix_start_date, unix_end_date) {
    //     var current_time = new Date();
    //     var state;
    //     if (current_time =< unix_start_date && current_time > unix_end_date){
    //         state = "active";
    //     } else if ( current_time > unix_start_date){
    //         state = "inactive"
    //     } else if (current_time < unix_end_date){
    //         state = "closed"
    //     }
    //     return state;
    // }

    var make_id = function makeid(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };

    var id = make_id();

    var newpoll = {
        id: id,
        name: name,
        voteoptions:[
            {
              "id": 1,
              "name": option1,
              "votes": 0,
              "numbers": []
            },
            {
              "id": 2,
              "name": option2,
              "votes": 0,
              "numbers": []
            },
            {
              "id": 3,
              "name": option3,
              "votes": 0,
              "numbers": []
            }
        ],
        start_date: start_date,
        end_date: end_date,
        received_numbers: [],
        created_by: "Doofy Dude",
        state: "active",
        phonenumber: ""
    };

    var firebaseRefs = new Firebase(firebaseUrl);
    this.refs.name.value = '';
    this.refs.option1.value = '';
    firebaseRefs.child("/" + id).set(newpoll);
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
      <div className="modal-body">
          <ol className="fs-fields">
              <li class="">
                  <span className="number">1</span>
                  <label>Question?</label>
                  <input id="name" ref="name" type="text" required/>
              </li>
              <li class="">
                  <span className="number">2</span>
                  <label for="q1">Answer options</label>
                  <input ref="option1" type="text" required />
                  <input ref="option2"  type="text" required />
                  <input ref="option3" type="text" required />
                  <input ref="option4" type="text" />
              </li>
              <li class="">
                  <span className="number">3</span>
                  <label for="q1">Start date</label>
                  <input class="fs-anim-lower" id="q1" name="q1" type="text" placeholder="mm/dd/yyyy - optional" ref="start_date" />
              </li>
              <li class="">
                  <span className="number">4</span>
                  <label class="fs-field-label fs-anim-upper" for="q1">End date</label>
                  <input class="fs-anim-lower" id="q1" name="q1" type="text" placeholder="mm/dd/yyyy - optional" ref="end_date" />
              </li>
          </ol>
        </div>
        <div className="modal-footer">
            <button className="btn btn-round" type="submit">Send answers</button>
        </div>
        </form>
    );
  }
});

ReactDOM.render(
  <PollForm />,
  document.getElementById('form_content')
);

var Poll = React.createClass({
  render: function() {
      var statsNodes = this.props.voteoptions.map(function (stats, index) {
        return <div className='stats'>
                <h4>{stats.votes}</h4>
                <p>{stats.name}</p>
            </div>;
      });
      var total_votes = this.props.voteoptions.map(function (stats, index) {
          return total_votes = parseInt(total_votes || 0 + parseInt(stats.votes, 10), 10);
      });
    return (
      <div className="col-xs-12 col-md-6 col-lg-6">
          <div className="box">
              <div className="content">
                  <div className="col-lg-4">
                      <div className="full-circle">
                          <p className="vote">{total_votes} {this.props.id}</p>
                      </div>
                  </div>
                  <div className="col-lg-8">
                      <div className="question">
                            {this.props.name} ?
                      </div>
                      {statsNodes}
                  </div>
              </div>
              <div className="footer">
                  <hr/>
                  Created By: {this.props.created}<br/>
                  Status:
                  <span className="green">
                      <i className="fa fa-check " aria-hidden="true"></i>
                  </span>
                  Active
              </div>
          </div>
      </div>
    );
  }
});


var PollList = React.createClass({
  render: function() {
    var pollNodes = this.props.data.map(function (poll, index) {
      return <Poll key={index} name={poll.name} id={poll.id} voteoptions={poll.voteoptions} created={poll.created_by}></Poll>;
    });
    return <div className="commentList" ref={this.props.data}>{pollNodes}</div>;
  }
});


var PollListContainer = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {
      data: []
    };
  },

  componentWillMount: function() {
    // Here we bind the component to Firebase and it handles all data updates,
    // no need to poll as in the React example.
    var firebaseRef = new Firebase(firebaseUrl);
    this.bindAsArray(firebaseRef, 'data');
  },

  render: function() {
    return (
      <div className="commentBox">
        <PollList data={this.state.data} />
      </div>
    );
  }
});

ReactDOM.render(
  <PollListContainer />,
  document.getElementById('poll_details')
);
