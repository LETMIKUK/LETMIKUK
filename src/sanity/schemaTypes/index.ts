import { type SchemaTypeDefinition } from "sanity";
import dashboardAccount from "./dashboardAccount";
import appAccount from "./appAccount";
import augmentImage from "./augmentImage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [dashboardAccount, appAccount, augmentImage],
};
