import { type SchemaTypeDefinition } from "sanity";
import dashboardAccount from "./dashboardAccount";
import userAccount from "./userAccount";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [dashboardAccount, userAccount],
};
