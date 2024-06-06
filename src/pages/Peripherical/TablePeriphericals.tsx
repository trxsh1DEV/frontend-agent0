import { useMemo, useState, FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  MRT_ActionMenuItem,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { TypePeripherical } from "../../utils/types/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { formatDateString } from "../../utils/utils";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { request } from "../../utils/request";
import { ArrowsClockwise, Pen, Trash } from "phosphor-react";
import TablePeriphericals from "./Periphericals";
import { useDispatch } from "react-redux";
import { toggleModal } from "../../redux/modalSlice";

type UserApiResponse = {
  data: Array<TypePeripherical>;
  meta: {
    totalRowCount: number;
  };
};

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Peripherical: FC = () => {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = useState<MRT_SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });

  const dispatch = useDispatch();

  const {
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<UserApiResponse>({
    queryKey: [
      "table-data",
      columnFilters,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("start", `${pagination.pageIndex * pagination.pageSize}`);
      params.append("size", `${pagination.pageSize}`);
      params.append("filters", JSON.stringify(columnFilters ?? []));
      params.append("sorting", JSON.stringify(sorting ?? []));

      try {
        const response = await request.get("/peripherical", { params });
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    },
    placeholderData: keepPreviousData,
  });

  const handleExportData = () => {
    if (!data || data.length <= 0) return;
    const periphericals = data.map((client: any) => ({ ...client }));
    const csv = generateCsv(csvConfig)(periphericals);
    download(csvConfig)(csv);
  };

  const columns = useMemo<MRT_ColumnDef<TypePeripherical>[]>(
    () => [
      { accessorKey: "status", header: "Situação" },
      { accessorKey: "host", header: "Host" },
      { accessorKey: "class", header: "Classe" },
      { accessorKey: "sample", header: "Modelo/Versão" },
      { accessorKey: "manufacturer", header: "Fabricante" },
      { accessorKey: "department", header: "Departamento" },
      { accessorKey: "person", header: "Pessoa" },
      { accessorKey: "category", header: "Categoria" },
      {
        accessorKey: "createdAt",
        header: "Data",
        Cell: ({ cell }: any) => formatDateString(cell.getValue()),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowActions: true,
    renderRowActionMenuItems: ({ table }) => [
      <MRT_ActionMenuItem
        icon={<Pen />}
        key="edit"
        label="Edit"
        onClick={() => console.info("Edit")}
        table={table}
      />,
      <MRT_ActionMenuItem
        icon={<Trash />}
        key="delete"
        label="Delete"
        onClick={() => console.info("Delete")}
        table={table}
      />,
    ],
    renderTopToolbarCustomActions: () => (
      <>
        <Tooltip arrow title="Refresh Data">
          <IconButton onClick={() => refetch()}>
            <ArrowsClockwise />
          </IconButton>
        </Tooltip>
        <button onClick={handleExportData}>Export All</button>
        <button onClick={() => dispatch(toggleModal())}>Adicionar novo</button>
      </>
    ),

    rowCount: meta?.totalRowCount ?? 0,
    initialState: { showColumnFilters: true },
    state: {
      columnFilters,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showSkeletons: isRefetching,
      sorting,
    },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    enableGlobalFilter: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    muiPaginationProps: {
      shape: "rounded",
      SelectProps: { hiddenLabel: false },
      rowsPerPageOptions: [10, 25, 50],
      variant: "outlined",
      showRowsPerPage: false,
      // @ts-ignore
      labelRowsPerPage: "Linhas por página", // Altere o texto aqui
    },
    muiToolbarAlertBannerProps: isError
      ? { color: "error", children: "Error loading data" }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  return (
    <>
      <h1>Equipamentos</h1>
      <MaterialReactTable table={table} />
      <TablePeriphericals />
    </>
  );
};

export default Peripherical;
