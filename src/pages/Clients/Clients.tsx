import React, { useEffect, useMemo, useRef, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  Package,
  Code,
  Eye,
  UploadSimple,
  Eraser,
  ShieldCheck,
} from "phosphor-react";
import { formatDateString } from "../../utils/utils";
import { Agent } from "../../utils/types/types";
import BlackScreen from "./BlackScreen";
import { Link } from "react-router-dom";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { request } from "../../utils/request";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Agent[] | null>(null);
  const [showBlackScreen, setShowBlackScreen] = useState(false);
  const [resultCommand, setResultCommand] = useState("");
  const fileInputRef = useRef<any>();

  const handleExportData = () => {
    console.log(clients);
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

  const columns = useMemo<MRT_ColumnDef<Agent>[]>(
    () => [
      {
        accessorKey: "inventory.system.hostname",
        header: "Hostname",
      },
      {
        accessorKey: "inventory.system.so",
        header: "SO",
      },
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
      {
        accessorKey: "custom.patrimony",
        header: "Patrimônio",
      },
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

  const handleCustomCommand = (clientId: string) => {
    const customCommand = prompt("Digite seu comando")?.replace("-", "/") || "";
    if (!customCommand) return alert("Não é possível enviar um comando vazio");
    sendCommand(clientId, customCommand);
  };

  const sendCommand = async (clientId: string, command: string) => {
    try {
      const result = await request.post("/clients/send-command", {
        clientId,
        command,
      });
      setResultCommand(result.data);
      setShowBlackScreen(true);
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
      const result = await request.post("/clients/send-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Define o cabeçalho correto para a requisição multipart/form-data
        },
      });
      setResultCommand(result.data);
      setShowBlackScreen(true);
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo .bat:", error);
    }
  };

  return (
    <>
      <h1>Connected Clients</h1>
      {!clients && <div>Nenhum dado disponível</div>}
      {clients && clients.length > 0 && (
        <MaterialReactTable
          columns={columns}
          data={clients}
          defaultColumn={{
            minSize: 50,
            maxSize: 200,
          }}
          enableDensityToggle={false}
          columnFilterDisplayMode={"popover"}
          renderTopToolbarCustomActions={() => (
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
          )}
          paginationDisplayMode={"pages"}
          initialState={{ pagination: { pageSize: 20, pageIndex: 0 } }}
          muiPaginationProps={{
            shape: "rounded",
            showRowsPerPage: false,
            variant: "outlined",
          }}
          enableRowActions
          getRowId={(row) => row.uid}
          renderRowActions={({ row }: any) => (
            <Box sx={{ display: "flex" }}>
              <Tooltip
                title={
                  row.original.online ? "Obter Inventário" : "Agent Offline"
                }
              >
                <span>
                  <IconButton
                    color="default"
                    onClick={() => sendCommand(row.id, "get_inventory")}
                    disabled={!row.original.online}
                  >
                    <Package size={32} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip
                title={
                  row.original.online
                    ? "Comando Personalizado"
                    : "Agent Offline"
                }
              >
                <span>
                  <IconButton
                    color="info"
                    onClick={() => handleCustomCommand(row.id)}
                    disabled={!row.original.online}
                  >
                    <Code size={32} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip
                title={
                  row.original.online ? "Formatar Dispositivo" : "Agent Offline"
                }
              >
                <span>
                  <IconButton
                    color="error"
                    onClick={() => handleCustomCommand(row.id)}
                    disabled={!row.original.online}
                  >
                    <Eraser size={32} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip
                title={
                  row.original.online ? "Ativar BitLocker" : "Agent Offline"
                }
              >
                <span>
                  <IconButton
                    color="success"
                    onClick={() => handleCustomCommand(row.id)}
                    disabled={!row.original.online}
                  >
                    <ShieldCheck size={32} />
                  </IconButton>
                </span>
              </Tooltip>
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
                      onChange={(event: any) =>
                        uploadBatFile(row.id, event.target.files[0])
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
          )}
        />
      )}
      {showBlackScreen && (
        <BlackScreen
          text={resultCommand}
          onClose={() => setShowBlackScreen(false)}
        />
      )}
    </>
  );
};

export default Clients;
