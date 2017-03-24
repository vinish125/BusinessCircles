import React, { Component } from 'react';
import './App.css';

import WelcomeRoute from './routes/Welcome'
import SearchRoute from './routes/Search'
import ActivityRoute from './routes/Activity'

class App extends Component {
  state = {
    user: null,
    company: null,
    results: null,
  }

  onLogin = (user) => {
    this.setState({user})
  }

  onCompanyFound = (company) => {
    this.setState({company})
  }

  onUsersFound = (results) => {
    this.setState({results})
  }

  render() {
    const { user, company, results } = this.state

    return (
      <div className="App" onClick={ this.login }>
        {
          !user ? (
            <WelcomeRoute onLogin={ this.onLogin } />
          ) : !company ? (
            <SearchRoute { ...this.state } onCompanyFound={ this.onCompanyFound } />
          ) : !results ? (
            <ActivityRoute { ...this.state } onUsersFound={ this.onUsersFound } />
          ) : (
            results
          )
        }
      </div>
    );
  }
}

export default App;
