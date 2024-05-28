import { z } from "zod";

export const schemaPeripherical = z.object({
  status: z.enum(["Normal", "Critico"], {
    errorMap: () => {
      return { message: "Informe 'Normal' ou 'Critico'" };
    },
  }),
  host: z.string().min(10, "Host deve ter ao menos 3 caracteres"),
  class: z.string(),
  local: z.string(),
  person: z.string(),
  manufacturer: z.string(),
  sample: z.string(),
  so: z.string(),
  department: z.string(),
  patrimony: z.string(),
  date_warranty: z.string(),
  category: z.array(z.string()),
  nfe: z.string(),
  purchase_price: z.number().min(1),
});

export type FormPropsPeripherical = z.infer<typeof schemaPeripherical>;

export const schemaTeste = z.object({
  name: z.string().min(5, "Maior que 5"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "password pequena"),
});

export type FormPropsTeste = z.infer<typeof schemaTeste>;
