import { useEffect, useState } from "preact/hooks";
import { useLocation } from "react-router-dom";
import "./style.css";
import { Agent } from "../../utils/types/types";
import { request } from "../../utils/request";
const renderKeyValuePair = (
  key: string,
  value: any,
  isArray: boolean = false
) => {
  let displayValue: any;
  let readOnly = true;

  if (typeof value === "object") {
    // Se for um array, tratar cada elemento
    if (Array.isArray(value)) {
      displayValue = value.map((item, index) => (
        <div key={index}>
          {/* Recursivamente chamar renderKeyValuePair para cada item do array */}
          {renderKeyValuePair(index.toString(), item, true)}
        </div>
      ));
    } else {
      displayValue = Object.entries(value).map(([subKey, subValue]) => (
        <div key={subKey}>
          {/* Recursivamente chamar renderKeyValuePair para cada propriedade do objeto */}
          {renderKeyValuePair(subKey, subValue)}
        </div>
      ));
    }
  } else {
    // Se não for um objeto, apenas exibir o valor
    displayValue = value;
  }

  const valuesForEdit = [
    "bond",
    "patrimony",
    "date_warranty",
    "nfe",
    "purchase_price",
    "department",
    "collaborator",
    "local",
  ];

  if (valuesForEdit.includes(key)) {
    readOnly = false;
  }

  // const keyNew = key;

  return (
    <div key={key} className="Content">
      {!isArray && <label htmlFor={key}>{key}</label>}
      {typeof displayValue === "string" || typeof displayValue === "number" ? (
        <input
          id={key}
          value={displayValue}
          readOnly={readOnly}
          className={"ProfileInput"}
          onClick={() => handleLabelClick(key)}
        />
      ) : (
        <div
          id={key}
          className={"ProfileInput"}
          onClick={() => handleLabelClick(key)}
        >
          {displayValue}
        </div>
      )}
    </div>
  );
};

const renderKeyValuePairs = (obj: any): JSX.Element[] => {
  // console.log("----------------------");
  // Object.entries(obj).map(([key, value]) => console.log(key, value));
  return Object.entries(obj).map(([key, value]) =>
    renderKeyValuePair(key, value)
  );
};

const handleLabelClick = (inputId: string) => {
  const inputElement = document.getElementById(inputId) as HTMLInputElement;
  if (inputElement) {
    navigator.clipboard.writeText(inputElement.value);
  }
};

export default function Client() {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [agent, setAgent] = useState<Agent | null>(null);
  const [activeTab, setActiveTab] = useState("Geral");

  const handleActiveTab = (name: string) => {
    return (
      <div
        className={`Tab ${activeTab === name ? "ActiveTab" : ""}`}
        onClick={() => handleTabClick(name)}
      >
        {name}
      </div>
    );
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const fetchData = async () => {
    try {
      const result = await request.get(`/clients/${id}`);
      if (!result) return setAgent(null);
      setAgent(result.data);
    } catch (error) {
      console.error("Error fetching agent:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async () => {
    try {
      if (!agent) return;
      const updatedCustom: any = {};

      const form = document.getElementById("FormContainer") || document;
      const readOnlyElements = form.querySelectorAll("input:not([readonly])");

      // Itera sobre os elementos encontrados
      readOnlyElements.forEach((element) => {
        const inputValue = (element as HTMLInputElement).value;
        updatedCustom[element.id] = inputValue;
      });

      await request.patch(`/clients/${id}`, {
        custom: {
          ...updatedCustom,
        },
      });

      setAgent((prevUserData: any) => ({
        ...prevUserData,
        custom: {
          ...updatedCustom,
        },
      }));
    } catch (err: any) {
      console.log(err.message);
    }
  };
  console.log(agent);

  return (
    <main className="ProfileContainer">
      <div className="TabsContainer">
        {handleActiveTab("Geral")}
        {handleActiveTab("Rede")}
        {handleActiveTab("Software")}
        {handleActiveTab("Monitoramento")}
        {handleActiveTab("Detalhes")}
      </div>
      {!agent ? (
        <div>Loading...</div>
      ) : (
        <>
          <section className="FormContainer" id="FormContainer">
            {/* Renderizar conteúdo conforme a aba ativa */}
            {activeTab === "Geral" && (
              <div className="ContentWrapper">
                <div className="SectionTitle">Informações Gerais</div>

                <div className="Content">
                  <label htmlFor="sys-so">SO</label>
                  <input
                    id="sys-so"
                    value={agent.inventory.system.so}
                    readOnly
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("sys-so")}
                  />
                </div>
                <div className="Content">
                  <label htmlFor="sys-host">Hostname</label>
                  <input
                    id="sys-host"
                    value={agent.inventory.system.hostname}
                    readOnly
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("sys-host")}
                  />
                </div>
                <div className="Content">
                  <label htmlFor="sys-domain">Domínio</label>
                  <input
                    id="sys-domain"
                    value={agent.inventory.system.domain}
                    readOnly
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("sys-domain")}
                  />
                </div>
                <div className="Content">
                  <label htmlFor="sys-user">Usuário</label>
                  <input
                    id="sys-user"
                    value={agent.inventory.system.user_logged}
                    readOnly
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("sys-user")}
                  />
                </div>

                <div className="Content">
                  <label htmlFor="cpu-model">CPU</label>
                  <input
                    id="cpu-model"
                    value={agent.inventory.cpu.model}
                    readOnly
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("cpu-model")}
                  />
                </div>

                <div className="Content">
                  <label htmlFor="cpu-arch">Me. RAM</label>
                  <input
                    id="cpu-arch"
                    value={agent.inventory.memory.total + " GB"}
                    readOnly
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("cpu-arch")}
                  />
                </div>

                <div className="Content">
                  <label htmlFor="storage-total">D. Total</label>
                  <input
                    id="storage-total"
                    value={agent.inventory.storage.total + " GB"}
                    readOnly
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("storage-total")}
                  />
                </div>

                <div className="Content">
                  <label htmlFor="storage-used">D. usado</label>
                  <input
                    id="storage-used"
                    value={agent.inventory.storage.used + " GB"}
                    readOnly
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("storage-used")}
                  />
                </div>

                <div className="Content">
                  <label htmlFor="net-ip">IP</label>
                  <input
                    id="net-ip"
                    value={agent.inventory.network.ipv4}
                    readOnly
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("net-ip")}
                  />
                </div>

                <div className="Content">
                  <label htmlFor="net-mac">Mac</label>
                  <input
                    id="net-mac"
                    value={agent.inventory.network.mac}
                    readOnly
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("net-mac")}
                  />
                </div>

                <div className="Content">
                  <label htmlFor="net-name">Int. Rede</label>
                  <input
                    id="net-name"
                    value={agent.inventory.network.network}
                    readOnly
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("net-name")}
                  />
                </div>

                <div className="Content">
                  <label htmlFor="sys-manufact">Fabricante</label>
                  <input
                    id="sys-manufact"
                    value={agent.inventory.system.manufacturer}
                    readOnly
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("sys-manufact")}
                  />
                </div>

                <div className="Content">
                  <label htmlFor="manufacturer">Fabricante</label>
                  <input
                    id="manufacturer"
                    value={agent.inventory.system.manufacturer}
                    readOnly
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("manufacturer")}
                  />
                </div>

                <div className="Content">
                  <label htmlFor="motherboard">Placa mãe</label>
                  <input
                    id="motherboard"
                    value={agent.inventory.system.motherboard}
                    readOnly
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("motherboard")}
                  />
                </div>

                <div className="Content">
                  <label htmlFor="patrimony">Patrimônio</label>
                  <input
                    id="patrimony"
                    value={agent.custom?.patrimony}
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("patrimony")}
                  />
                </div>

                <div className="Content">
                  <label htmlFor="collaborator">Colaborador</label>
                  <input
                    id="collaborator"
                    value={agent.custom?.collaborator}
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("collaborator")}
                  />
                </div>

                <div className="Content">
                  <label htmlFor="date_warranty">Compra</label>
                  <input
                    id="date_warranty"
                    value={agent.custom?.date_warranty}
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("date_warranty")}
                  />
                </div>

                <div className="Content">
                  <label htmlFor="department">Departamento</label>
                  <input
                    id="department"
                    value={agent.custom?.department}
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("department")}
                  />
                </div>

                <div className="Content">
                  <label htmlFor="bond">Vínculo</label>
                  <input
                    id="bond"
                    value={agent.custom?.bond}
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("bond")}
                  />
                </div>

                <div className="Content">
                  <label htmlFor="local">Local</label>
                  <input
                    id="local"
                    value={agent.custom?.local}
                    className={"ProfileInput"}
                    onClick={() => handleLabelClick("local")}
                  />
                </div>
              </div>
            )}
            {activeTab === "Rede" && (
              <div className="ContentWrapper">
                <div className="SectionTitle">Rede</div>
                {renderKeyValuePairs(agent.inventory.system)}
              </div>
            )}
            {activeTab === "Software" && (
              <div className="ContentWrapper">
                <div className="SectionTitle">Software</div>
                {renderKeyValuePairs(agent.inventory.software)}
              </div>
            )}
            {activeTab === "Monitoramento" && (
              <div className="ContentWrapper">
                <div className="SectionTitle">Monitoramento</div>
                {renderKeyValuePairs(agent.inventory.storage)}
              </div>
            )}
            {activeTab === "Detalhes" && (
              <div className="ContentWrapper">
                <div className="SectionTitle">Mais Detalhes</div>
                {renderKeyValuePairs({
                  ...agent.inventory,
                  ...agent.periphericals,
                })}
              </div>
            )}
            <button onClick={handleEdit}>Salvar</button>
          </section>
        </>
      )}
    </main>
  );
}
