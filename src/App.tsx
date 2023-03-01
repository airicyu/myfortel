import "./App.css";

import { createHashRouter, RouterProvider } from "react-router-dom";
import { BuildBoardView } from "./view/buildBoard/BuildBoardView";
import { DayBoardsView } from "./view/dayBoards/DayBoardsView";

const router = createHashRouter([
  {
    path: "/",
    element: <BuildBoardView />,
    children: [],
  },
  {
    path: "/buildBoard",
    element: <BuildBoardView />,
    children: [],
  },
  {
    path: "/dayBoards",
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
