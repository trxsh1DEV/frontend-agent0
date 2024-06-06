import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./app.css";
import Clients from "./pages/Clients/Clients";
import Client from "./pages/Clients/Client";
import Peripherical from "./pages/Peripherical/TablePeriphericals";
import { tableTheme } from "./styles/theme";
import { ThemeProvider } from "@mui/material";
// import Example from "./pages/Peripherical/Test";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import Charts from "./pages/Charts/Charts";
import CompareHardware from "./pages/Performance/CompareHardware";
import Softwares from "./pages/Software/Software";
import Teste from "./pages/Peripherical/Periphericals";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import SearchComponent from "./components/SearchComponent";
// import TesteTable from "./pages/Peripherical/Periphericals";
// import TablePeriphericals from "./pages/Peripherical/Periphericals";

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
          path: "/input",
          element: <SearchComponent />,
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
          element: <Teste />,
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
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
