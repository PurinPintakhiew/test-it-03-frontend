import { useRoutes } from "react-router-dom";

import Home from "./pages/Home";

const App = () => {
  const elements: any = [{ path: "/", element: <Home /> }];
  return useRoutes(elements);
};

export default App;
