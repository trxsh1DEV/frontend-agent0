import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./app.css";
import Clients from "./pages/Clients/Clients";
import Client from "./pages/Clients/Client";
import Peripherical from "./pages/Peripherical/Peripherical";
import { tableTheme } from "./styles/theme";
import { ThemeProvider } from "@mui/material";
import Example from "./pages/Peripherical/Test";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import Charts from "./pages/Charts/Charts";
import CompareHardware from "./pages/Performance/CompareHardware";
import Softwares from "./pages/Software/Software";

export function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      // element: <Layout />,
      children: [
        {
          path: "/",
          element: <Clients />,
        },
        {
          path: "/performance",
          element: <CompareHardware />,
        },
        {
          path: "/softwares",
          element: <Softwares />,
        },
        {
          path: "/peripherical",
          element: <Peripherical />,
        },
        {
          path: "/teste",
          element: <Example />,
        },
        {
          path: "/charts",
          element: <Charts />,
        },
        {
          path: "/agent/:id",
          element: <Client />,
        },
        // {
        //   path: "/users",
        //   element: <Users />,
        // },
      ],
    },
    // {
    //   path: "/login",
    //   element: <LoginRoute />,
    // },
  ]);

  return (
    <ThemeProvider theme={tableTheme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
