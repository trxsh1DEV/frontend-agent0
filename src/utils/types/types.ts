export type Agent = {
  hwid: string;
  uid: string;
  online: boolean;
  // clientUid: Types.ObjectId;
  inventory: {
    cpu: {
      model: string;
      architecture: string;
      cpu_freq: number;
      physical_cores: number;
      logic_cores: number;
    };
    memory: {
      total: number;
      available: number;
      used: number;
      percentage: number;
    };
    system: {
      so: string;
      version: string;
      architecture: string;
      domain: string;
      manufacturer: string;
      type_machine: string;
      motherboard: string;
      model: string;
      hostname: string;
      user_logged: string;
      last_update: string;
    };
    storage: {
      total: number;
      used: number;
      available: number;
      percentage: number;
    };
    network: {
      mac: string;
      ipv4: string;
      network: string;
    };
    software: string[];
  };
  custom?: {
    department: string[];
    collaborator: string[];
    bond: ["Operador", "Proprietario"];
    patrimony: string;
    date_warranty: string;
    nfe: string;
    purchase_price: number;
    local: string[];
  };
  periphericals: {
    keyboard: string;
    mouse: string;
    monitors: string[];
  };
};

export type TypePeripherical = {
  status: "Normal" | "Critico";
  host: string;
  class: string;
  local: string;
  person: string;
  manufacturer: string;
  sample: string;
  so: string;
  department: string[];
  patrimony: string;
  date_warranty: string;
  category: string[];
  nfe: string;
  purchase_price: number;
  createdAt?: string;
  updatedAt?: string;
  _id: string;
};
