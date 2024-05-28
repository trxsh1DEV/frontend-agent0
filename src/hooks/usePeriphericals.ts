import { request } from "../utils/request";

export const createPeripherical = async (data: any) => {
  return await request.post("/peripherical", data);
};
