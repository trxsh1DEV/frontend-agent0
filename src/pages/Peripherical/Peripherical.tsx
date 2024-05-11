import "./clients.css";
import React, { useMemo, useState } from "react";
import {
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
import { useForm } from "react-hook-form";
import {
  FormPropsPeripherical,
  schemaPeripherical,
} from "../../utils/Schemas/PeriphericalSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../../components/Modal/Modal";
import { download, generateCsv, mkConfig } from "export-to-csv";
import FormPeripherical from "./FormPeripherical";
import { request } from "../../utils/request";

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

const Peripherical: React.FC = () => {
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
  const [showModal, setShowModal] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormPropsPeripherical>({
    mode: "onBlur",
    resolver: zodResolver(schemaPeripherical),
  });

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
    const periphericals = data.map((client: any) => ({
      ...client,
    }));
    const csv = generateCsv(csvConfig)(periphericals);
    download(csvConfig)(csv);
  };

  const handleForm = async (data: TypePeripherical) => {
    try {
      await request.post("/peripherical", data);
      await refetch();
      setShowModal(false);
      reset();
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const columns = useMemo<MRT_ColumnDef<TypePeripherical>[]>(
    () => [
      {
        accessorKey: "status",
        header: "Situação",
      },
      {
        accessorKey: "host",
        header: "Host",
      },
      {
        accessorKey: "class",
        header: "Classe",
      },
      // Adicione outras colunas aqui...
      {
        accessorKey: "sample",
        header: "Modelo/Versão",
      },
      {
        accessorKey: "manufacturer",
        header: "Fabricante",
      },
      {
        accessorKey: "department",
        header: "Departamento",
      },

      {
        accessorKey: "person",
        header: "Pessoa",
      },
      {
        accessorKey: "category",
        header: "Categoria",
      },
      {
        accessorKey: "createdAt",
        header: "data",
        Cell: ({ cell }: any) => formatDateString(cell.getValue()),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    enableGlobalFilter: false,
    manualPagination: true,
    manualSorting: true,
    defaultColumn: {
      minSize: 50,
      maxSize: 200,
      size: 100,
    },
    enableDensityToggle: false,
    enableColumnActions: false,
    columnFilterDisplayMode: "popover",
    muiPaginationProps: {
      shape: "rounded",
      rowsPerPageOptions: [10, 25, 50],
      variant: "outlined",
    },
    paginationDisplayMode: "pages",
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: () => (
      <>
        <button onClick={handleExportData}>Export All</button>
        {/* <button onClick={() => refetch()}>Recarregar</button> */}
      </>
    ),
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      columnFilters,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showSkeletons: isRefetching,
      sorting,
    },
  });

  return (
    <>
      <h1 style={{ marginRight: "200px" }}>Equipamentos</h1>
      {/* Renderize a tabela */}
      <MaterialReactTable table={table} />
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setShowModal(true)}>Novo equipamento</button>
      </div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <FormPeripherical
            errors={errors}
            handleForm={handleForm}
            handleSubmit={handleSubmit}
            register={register}
          />
        </Modal>
      )}
    </>
  );
};

export default Peripherical;
