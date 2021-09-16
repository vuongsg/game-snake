import { Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import './App.scss';
import { Snake } from './components/Snake';

function App() {
  const history = createBrowserHistory();

  return (
    <Router history={history}>
      <div className="App">

        <Switch>
          <Route path='/' component={Snake} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
