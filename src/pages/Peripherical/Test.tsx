import { useEffect, useMemo, useReducer } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "material-react-table";

type UserApiResponse = {
  data: Array<User>;
  meta: {
    totalRowCount: number;
  };
};

type User = {
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  phoneNumber: string;
};

type TableState = {
  columnFilters: MRT_ColumnFiltersState;
  globalFilter: string;
  pagination: MRT_PaginationState;
  sorting: MRT_SortingState;
  rowCount: number;
  isLoading: boolean;
  isRefetching: boolean;
  isError: boolean;
  data: UserApiResponse;
};

type Action =
  | { type: "SET_COLUMN_FILTERS"; payload: MRT_ColumnFiltersState }
  | { type: "SET_GLOBAL_FILTER"; payload: string }
  | { type: "SET_PAGINATION"; payload: MRT_PaginationState }
  | { type: "SET_SORTING"; payload: MRT_SortingState }
  | { type: "SET_DATA"; payload: UserApiResponse }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_REFETCHING"; payload: boolean }
  | { type: "SET_ERROR"; payload: boolean };

const initialState: TableState = {
  columnFilters: [],
  globalFilter: "",
  pagination: { pageIndex: 0, pageSize: 10 },
  sorting: [],
  rowCount: 0,
  isLoading: false,
  isRefetching: false,
  isError: false,
  data: {
    data: [],
    meta: { totalRowCount: 0 },
  },
};

const reducer = (state: TableState, action: Action): TableState => {
  switch (action.type) {
    case "SET_COLUMN_FILTERS":
      return { ...state, columnFilters: action.payload };
    case "SET_GLOBAL_FILTER":
      return { ...state, globalFilter: action.payload };
    case "SET_PAGINATION":
      return { ...state, pagination: action.payload };
    case "SET_SORTING":
      return { ...state, sorting: action.payload };
    case "SET_DATA":
      return {
        ...state,
        data: action.payload,
        rowCount: action.payload.meta.totalRowCount,
        isError: false,
        isLoading: false,
        isRefetching: false,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_REFETCHING":
      return { ...state, isRefetching: action.payload };
    case "SET_ERROR":
      return { ...state, isError: action.payload };
    default:
      return state;
  }
};

const Example = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { columnFilters, globalFilter, pagination, sorting } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      // Simulando a busca dos dados
      const mockApiResponse: UserApiResponse = {
        data: [
          {
            firstName: "John",
            lastName: "Doe",
            address: "123 Main St",
            state: "CA",
            phoneNumber: "555-1234",
          },
          // Mais usuários...
        ],
        meta: { totalRowCount: 100 },
      };
      // Delay para simular a requisição
      setTimeout(() => {
        dispatch({ type: "SET_DATA", payload: mockApiResponse });
      }, 1000);

      // Fim da simulação
    };
    fetchData();
  }, [columnFilters, globalFilter, pagination, sorting]);

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "First Name",
      },
      //column definitions...
      {
        accessorKey: "lastName",
        header: "Last Name",
      },
      {
        accessorKey: "address",
        header: "Address",
      },
      {
        accessorKey: "state",
        header: "State",
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
      },
      //end
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: state.data.data || [],
    enableRowSelection: true,
    getRowId: (row) => row.phoneNumber,
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: state.isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: (columnFilters: any) =>
      dispatch({ type: "SET_COLUMN_FILTERS", payload: columnFilters }),
    onGlobalFilterChange: (globalFilter: any) =>
      dispatch({ type: "SET_GLOBAL_FILTER", payload: globalFilter }),
    onPaginationChange: (pagination: any) =>
      dispatch({ type: "SET_PAGINATION", payload: pagination }),
    onSortingChange: (sorting: any) =>
      dispatch({ type: "SET_SORTING", payload: sorting }),
    rowCount: state.rowCount,
    state: {
      columnFilters,
      globalFilter,
      isLoading: state.isLoading,
      pagination,
      showAlertBanner: state.isError,
      showProgressBars: state.isRefetching,
      sorting,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default Example;

/*
function useFetch<T = unknown>(url: string) {
  const initialState = {
    columnFilters: [],
    globalFilter: "",
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [],
    rowCount: 0,
    isLoading: false,
    isRefetching: false,
    isError: false,
    data: []
  };

  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case "SET_COLUMN_FILTERS":
        return { ...state, columnFilters: action.payload };
      case "SET_GLOBAL_FILTER":
        return { ...state, globalFilter: action.payload };
      case "SET_PAGINATION":
        return { ...state, pagination: action.payload };
      case "SET_SORTING":
        return { ...state, sorting: action.payload };
      case "SET_DATA":
        return {
          ...state,
          data: action.payload,
          rowCount: action.payload.meta.totalRowCount,
          isError: false,
          isLoading: false,
          isRefetching: false,
        };
      case "SET_LOADING":
        return { ...state, isLoading: action.payload };
      case "SET_REFETCHING":
        return { ...state, isRefetching: action.payload };
      case "SET_ERROR":
        return { ...state, isError: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFetch = useCallback(() => {
    async () => {
      dispatch({ type: "SET_LOADING" });
      try {
        // const response = await request.get(
        //   `/peripherical?start=${
        //     pagination.pageSize * pagination.pageIndex
        //   }&size=${pagination.pageSize}`
        // );

        // if (!response.data || response.data.data.length <= 0)
        //   return setPeriphericals(null);
        // setPeriphericals(response.data.data);
        // setRowCount(response.data.meta.totalRowCount);
        const response = await request.get(url);
        dispatch({ type: "SET_DATA", payload: response.data });
      } catch (error: any) {
        // console.error(
        //   "Error fetching periphericals:",
        //   error?.response?.data.errors[0]
        // );
        dispatch({
          type: "SET_ERROR",
          payload: error?.response?.data.errors[0],
        });
      }
    };
    // pagination.
  }, [url]);
  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  return {
    data: state.data,
    error: state.isError,
    isLoading: state.isLoading
  }
}


const fetchURL = new URL(
        `http://localhost:5173/peripherical?start=${
          pagination.pageSize * pagination.pageIndex
        }&size=${pagination.pageSize}`
      );

      //read our state and pass it to the API as query params
      fetchURL.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      fetchURL.searchParams.set("size", `${pagination.pageSize}`);
      fetchURL.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      fetchURL.searchParams.set("globalFilter", globalFilter ?? "");
      fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []));

      //use whatever fetch library you want, fetch, axios, etc
      const response = await fetch(fetchURL.href);
      const json = await response.json();
      return json;
    },
    placeholderData: keepPreviousData,
*/
