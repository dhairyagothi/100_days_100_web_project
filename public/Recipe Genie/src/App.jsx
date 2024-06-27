import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import RandomMeal from "./pages/RandomMeal";
import Category from "./pages/Category";
import Meal from "./pages/Meal";

const App = () => {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/random" component={RandomMeal} />
      <Route path="/category/:category">
        {(params) => <Category category={params.category} />}
      </Route>
      <Route path="/meal/:meal">
        {(params) => <Meal meal={params.meal} />}
      </Route>

      <Route>404: No such page!</Route>
    </Switch>
  );
};
export default App;
