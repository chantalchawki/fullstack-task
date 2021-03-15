import "./App.css";
import Register from "./containers/Register/register";
import Login from "./containers/Login/login";
import Profile from "./containers/Profile/profile";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route excat path="/register" component={Register} />
        <Route excat path="/login" component={Login} />
        <Route exact path="/profile" component={Profile} />
      </Switch>
    </Router>
  );
}

export default App;
