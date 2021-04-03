import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alerts from "./components/layout/Alerts";
import Navbar from "./components/layout/Navbar";
import About from "./components/pages/About";
import Home from "./components/pages/Home";
import PrivateRoute from "./components/routing/PrivateRoute";
import AlertState from "./context/AlertState";
import AuthState from "./context/AuthState";
import ContactState from "./context/ContactState";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthState>
        <ContactState>
          <AlertState>
            <Router>
              <Navbar />
              <div className="container">
                <Alerts />
                <Switch>
                  <Route exact path="/about" component={About} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                  <PrivateRoute exact path="/" component={Home} />
                </Switch>
              </div>
            </Router>
          </AlertState>
        </ContactState>
      </AuthState>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
