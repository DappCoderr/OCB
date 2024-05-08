import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from "./component/LandingPage";
import FAQ from "./component/FAQ";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/faq",
      element: <FAQ />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
