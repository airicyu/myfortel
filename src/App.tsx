import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BuildBoardView } from "./view/buildBoard/BuildBoardView";
import { DayBoardsView } from "./view/dayBoards/DayBoardsView";

const router = createBrowserRouter([
  {
    path: "/myfortel",
    element: <BuildBoardView />,
    children: [],
  },
  {
    path: "/myfortel/buildBoard",
    element: <BuildBoardView />,
    children: [],
  },
  {
    path: "/myfortel/dayBoards",
    element: <DayBoardsView />,
    children: [],
  },
]);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RouterProvider router={router} />
      </header>
    </div>
  );
}

export default App;
