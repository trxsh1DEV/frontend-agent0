import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  Package,
  Code,
  Eye,
  UploadSimple,
  // Eraser,
  // ShieldCheck,
} from "phosphor-react";
import { formatDateString } from "../../utils/utils";
import { AgentType } from "../../utils/types/types";
import { Link } from "react-router-dom";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { request } from "../../utils/request";
import BlackScreen from "./Shell";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Clients: React.FC = () => {
  const [clients, setClients] = useState<AgentType[] | null>([]);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const fileInputRef = useRef<any>();

  const handleExportData = () => {
    if (!clients || clients.length <= 0) return;

    // Mapeie os clientes para o formato adequado antes de gerar o CSV
    const clientsData = clients.map((client: any) => ({
      ...client.inventory.system,
      patrimony: client.custom.patrimony,
      categoria: client.inventory.system.type_machine,
      "Data de inclusão": formatDateString(client.createdAt),
      RAM: client.inventory.memory.total + " GB",
      Armazenamento: client.inventory.storage.total + " GB",
    }));

    const csv = generateCsv(csvConfig)(clientsData);
    download(csvConfig)(csv);
  };

  const columns = useMemo<MRT_ColumnDef<AgentType>[]>(
    () => [
      {
        accessorKey: "inventory.system.hostname",
        header: "Hostname",
      },
      {
        accessorKey: "inventory.system.so",
        header: "SO",
      },
      // {
      //   accessorKey: "uid",
      //   header: "UID",
      // },
      {
        accessorKey: "inventory.system.type_machine",
        header: "Categoria",
      },
      {
        accessorKey: "inventory.system.user_logged",
        header: "Usuário",
        grow: false, //don't allow this column to grow to fill in remaining space - new in v2.8
        size: 50, //small column
      },
      {
        accessorKey: "inventory.storage.total",
        header: "Armazenamento",
        Cell: ({ cell }: any) => cell.getValue() + " GB",
      },
      // {
      //   accessorKey: "custom.patrimony",
      //   header: "Patrimônio",
      //   Cell: ({ cell }: any) => (cell.getValue() ? "N/A" : cell.getValue()),
      // },
      {
        accessorKey: "createdAt",
        header: "Data de inclusão",
        Cell: ({ cell }: any) => formatDateString(cell.getValue()),
      },
      {
        accessorKey: "inventory.memory.total",
        header: "RAM",
        Cell: ({ cell }: any) => cell.getValue() + " GB",
      },
    ],
    []
  );

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await request.get("/clients");
        console.log(response.data);
        if (!response.data || response.data.length <= 0)
          return setClients(null);
        setClients(response.data);
      } catch (error: any) {
        console.error(
          "Error fetching clients:",
          error?.response?.data.errors[0]
        );
      }
    };

    fetchClients();
  }, []);

  const sendCommand = async (clientId: string, command: string) => {
    try {
      const result = await request.post("/sockets/send-command", {
        clientId,
        command,
      });
      console.log(result.data);
    } catch (error: any) {
      console.error(
        `Error sending ${command} command:`,
        error?.response?.data.errors[0]
      );
    }
  };

  const uploadBatFile = async (clientId: string, file: any) => {
    const formData = new FormData();
    formData.append("clientId", clientId);
    formData.append("file", file);

    try {
      await request.post("/sockets/send-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Define o cabeçalho correto para a requisição multipart/form-data
        },
      });
      alert("Upload do arquivo .bat concluído com sucesso!");
    } catch (error: any) {
      console.error("Erro ao fazer upload do arquivo .bat:", error);
      alert(error.response.data.message);
    } finally {
      // Limpa o valor do elemento input
      fileInputRef.current.value = "";
    }
  };

  const openTerminal = (clientId: string) => {
    setIsTerminalOpen(true);
    setSelectedClientId(clientId);
  };

  // Função para fechar o terminal
  const closeTerminal = () => {
    setIsTerminalOpen(false);
    setSelectedClientId(null);
  };

  const table = useMaterialReactTable({
    columns,
    data: clients || [],
    enableDensityToggle: false,
    enableColumnActions: false,
    columnFilterDisplayMode: "popover",
    renderTopToolbarCustomActions: () => (
      <div
        style={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <button onClick={handleExportData}>Export Data</button>
      </div>
    ),
    paginationDisplayMode: "pages",
    initialState: {
      pagination: { pageSize: 20, pageIndex: 0 },
      showColumnFilters: true,
    },
    muiPaginationProps: {
      shape: "rounded",
      showRowsPerPage: false,
      variant: "outlined",
    },
    enableRowActions: true,
    getRowId: (row) => row.uid,
    // renderRowActionMenuItems: ({ closeMenu, row, table }) => [
    //   <MRT_ActionMenuItem
    //     icon={<Package size={32} />}
    //     key="get_inventory"
    //     label={row.original.online ? "Obter Inventário" : "Agent Offline"}
    //     onClick={() => sendCommand(row.id, "get_inventory")}
    //     disabled={!row.original.online}
    //     table={table}
    //   />,
    //   <MRT_ActionMenuItem
    //     icon={<Code size={32} />}
    //     key="custom_command"
    //     label={row.original.online ? "Comando Personalizado" : "Agent Offline"}
    //     onClick={() => {
    //       openTerminal(row.id);
    //       closeMenu();
    //     }}
    //     disabled={!row.original.online}
    //     table={table}
    //   />,
    //   <MRT_ActionMenuItem
    //     icon={<Eraser size={32} />}
    //     key="format_device"
    //     label={row.original.online ? "Formatar Dispositivo" : "Agent Offline"}
    //     onClick={() => console.log(row.id)}
    //     disabled={!row.original.online}
    //     table={table}
    //   />,
    //   <MRT_ActionMenuItem
    //     icon={<ShieldCheck size={32} />}
    //     key="activate_bitlocker"
    //     label={row.original.online ? "Ativar BitLocker" : "Agent Offline"}
    //     onClick={() => console.log(row.id)}
    //     disabled={!row.original.online}
    //     table={table}
    //   />,
    //   <MRT_ActionMenuItem
    //     icon={<UploadSimple size={32} />}
    //     key="upload_script"
    //     label={
    //       row.original.online ? "Enviar Script (.bat | .ps1)" : "Agent Offline"
    //     }
    //     onClick={() => fileInputRef.current.click()}
    //     disabled={!row.original.online}
    //     table={table}
    //   />,
    //   <input
    //     type="file"
    //     accept=".bat"
    //     ref={fileInputRef}
    //     onChange={(e: any) => uploadBatFile(row.id, e?.target?.files[0])}
    //     style={{ display: "none" }}
    //   />,
    //   <MRT_ActionMenuItem
    //     icon={<Eye size={32} />}
    //     key="details"
    //     label="Mais detalhes"
    //     onClick={() => navigate(`/agent/${row.id}`)}
    //     table={table}
    //   />,
    // ],
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex" }}>
        <Tooltip
          title={row.original.online ? "Obter Inventário" : "Agent Offline"}
        >
          <span>
            <IconButton
              color="success"
              onClick={() => sendCommand(row.id, "get_inventory")}
              disabled={!row.original.online}
            >
              <Package size={32} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip
          title={
            row.original.online ? "Comando Personalizado" : "Agent Offline"
          }
        >
          <span>
            <IconButton
              color="info"
              onClick={() => openTerminal(row.id)}
              disabled={!row.original.online}
            >
              <Code size={32} />
            </IconButton>
          </span>
        </Tooltip>
        {/* <Tooltip
          title={row.original.online ? "Formatar Dispositivo" : "Agent Offline"}
        >
          <span>
            <IconButton
              color="error"
              onClick={() => console.log(row.id)}
              disabled={!row.original.online}
            >
              <Eraser size={32} />
            </IconButton>
          </span>
        </Tooltip> */}
        {/* <Tooltip
          title={row.original.online ? "Ativar BitLocker" : "Agent Offline"}
        >
          <span>
            <IconButton
              color="success"
              onClick={() => console.log(row.id)}
              disabled={!row.original.online}
            >
              <ShieldCheck size={32} />
            </IconButton>
          </span>
        </Tooltip> */}
        <Tooltip
          title={
            row.original.online
              ? "Enviar Script (.bat | .ps1)"
              : "Agent Offline"
          }
        >
          <span>
            <IconButton
              color="secondary"
              onClick={() => fileInputRef.current.click()}
              disabled={!row.original.online}
            >
              <input
                type="file"
                accept=".bat"
                ref={fileInputRef}
                onChange={(e: any) =>
                  uploadBatFile(row.id, e?.target?.files[0])
                }
                style={{ display: "none" }}
              />
              <UploadSimple size={32} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Mais detalhes">
          <Link to={`/agent/${row.id}`}>
            <IconButton color="default">
              <Eye size={32} />
            </IconButton>
          </Link>
        </Tooltip>
      </Box>
    ),
  });

  return (
    <>
      <h1>Connected Clients</h1>
      {!clients && <div>Nenhum dado disponível</div>}
      {clients && clients.length > 0 && <MaterialReactTable table={table} />}
      {isTerminalOpen && selectedClientId && (
        <BlackScreen clientId={selectedClientId} onClose={closeTerminal} />
      )}
    </>
  );
};

export default Clients;
