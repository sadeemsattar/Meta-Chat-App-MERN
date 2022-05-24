import { Route } from "react-router-dom";
import { HomePage } from "./PagesLayout/HomePage";
import { MyChatPage } from "./PagesLayout/MyChatPage";
import "./App.css";
function App() {
  return (
    <div className="App">
      <Route exact path="/" component={HomePage}></Route>
      <Route path="/myChat" component={MyChatPage}></Route>
    </div>
  );
}

export default App;
