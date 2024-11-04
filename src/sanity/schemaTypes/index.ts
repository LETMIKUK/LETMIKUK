import { type SchemaTypeDefinition } from "sanity";
import dashboardAccount from "./dashboardAccount";
import appAccount from "./appAccount";
import augmentImage from "./augmentImage";
import demografiBalitaProvinsi from "./provinsi/demografiBalitaProvinsi";
import pengukuranGiziProvinsi from "./provinsi/pengukuranGiziProvinsi";
import kesiapanPosyanduProvinsi from "./provinsi/kesiapanPosyanduProvinsi";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    dashboardAccount,
    appAccount,
    augmentImage,
    demografiBalitaProvinsi,
    pengukuranGiziProvinsi,
    kesiapanPosyanduProvinsi,
  ],
};
