import { type SchemaTypeDefinition } from "sanity";
import dashboardAccount from "./dashboardAccount";
import appAccount from "./appAccount";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [dashboardAccount, appAccount],
};
