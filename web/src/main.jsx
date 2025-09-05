import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./index.css";
import { FlowProvider } from "@onflow/kit";
import flowJSON from "./flow.json";
import "./fcl.config";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FlowProvider flowJson={flowJSON}>
      <RouterProvider router={router} />
    </FlowProvider>
  </React.StrictMode>
);
