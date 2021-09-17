import { Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import './App.scss';
import { Board } from './components/Board';

function App() {
  const history = createBrowserHistory();

  return (
    <Router history={history}>
      <div className="App">

        <Switch>
          <Route path='/' component={Board} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
