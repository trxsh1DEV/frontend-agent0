import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

//example data type
type Person = {
  software: string;
  categoria: string;
  mapeado: boolean;
  primeiro_inventario: string;
  ultima_utilizacao: string;
  licenciado: boolean;
  expiracao_licenca: string | boolean;
};

//nested data is ok, see accessorKeys in ColumnDef below
const data: Person[] = [
  {
    software: "Visual Studio",
    categoria: "Desenvolvimento",
    mapeado: false,
    primeiro_inventario: "05/05/2024, 12:49:46",
    ultima_utilizacao: "04/04/2022, 15:47:34",
    licenciado: false,
    expiracao_licenca: false,
  },
  {
    software: "AutoCAD",
    categoria: "Modelagem 3D",
    mapeado: true,
    primeiro_inventario: "04/08/2023, 06:15:27",
    ultima_utilizacao: "18/03/2023, 22:56:13",
    licenciado: true,
    expiracao_licenca: "25/08/2027, 04:42:45",
  },
  {
    software: "Chrome",
    categoria: "Web",
    mapeado: true,
    primeiro_inventario: "09/11/2023, 21:06:15",
    ultima_utilizacao: "17/11/2023, 02:32:44",
    licenciado: false,
    expiracao_licenca: false,
  },
  {
    software: "Winrar",
    categoria: "Arquivos",
    mapeado: false,
    primeiro_inventario: "07/03/2023, 17:50:19",
    ultima_utilizacao: "20/03/2024, 19:45:51",
    licenciado: false,
    expiracao_licenca: false,
  },
  {
    software: "Photoshop",
    categoria: "Design",
    mapeado: true,
    primeiro_inventario: "07/10/2023, 21:07:59",
    ultima_utilizacao: "27/11/2023, 10:21:22",
    licenciado: true,
    expiracao_licenca: "19/01/2025, 02:16:45",
  },
  {
    software: "Office",
    categoria: "Suíte Escritório",
    mapeado: true,
    primeiro_inventario: "04/04/2024, 00:30:52",
    ultima_utilizacao: "27/10/2023, 02:04:42",
    licenciado: true,
    expiracao_licenca: "27/12/2027, 04:40:42",
  },
  {
    software: "Firefox",
    categoria: "Web",
    mapeado: false,
    primeiro_inventario: "29/10/2022, 14:06:16",
    ultima_utilizacao: "24/01/2024, 23:12:19",
    licenciado: false,
    expiracao_licenca: false,
  },
  {
    software: "Discord",
    categoria: "Comunicação",
    mapeado: true,
    primeiro_inventario: "30/01/2022, 10:10:27",
    ultima_utilizacao: "21/04/2023, 23:40:57",
    licenciado: true,
    expiracao_licenca: false,
  },
];

const Example = () => {
  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "software",
        header: "Software",
        size: 150,
      },
      {
        accessorKey: "categoria",
        header: "Categoria",
        size: 150,
      },
      {
        accessorKey: "ultima_utilizacao",
        header: "Última Utilização",
        size: 200,
      },
      {
        accessorKey: "licenciado",
        header: "Licenciado",
        size: 50,
        Cell: ({ cell }: any) => (cell.getValue() ? "Sim" : "Não"),
      },
      {
        accessorKey: "expiracao_licenca",
        header: "Expiração licença",
        Cell: ({ cell }: any) => (cell.getValue() ? cell.getValue() : "N/A"),
        size: 200,
      },
      {
        accessorKey: "mapeado",
        header: "Mapeado",
        Cell: ({ cell }: any) => (cell.getValue() ? "Sim" : "Não"),
        size: 80,
      },
      {
        accessorKey: "primeiro_inventario",
        header: "Primeiro Inventário",
        size: 200,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableDensityToggle: false,
    enableColumnActions: false,
    columnFilterDisplayMode: "popover",
    muiPaginationProps: {
      shape: "rounded",
      showRowsPerPage: false,
      variant: "outlined",
    },
    paginationDisplayMode: "pages",
  });

  return (
    <>
      <h1 style={{ marginRight: "200px" }}>Softwares</h1>
      <MaterialReactTable table={table} />
    </>
  );
};

export default Example;
