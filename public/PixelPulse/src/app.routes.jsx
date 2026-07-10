import { createHashRouter } from "react-router";
import ErrorPage from "./pages/ErrorPage";
import Landing from "./pages/Landing";
import Editor from "./pages/Editor";

export const router = createHashRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/editor",
    element: <Editor />,
  },
]);