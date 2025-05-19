import { PGlite } from "@electric-sql/pglite";

export const db = new PGlite("idb://patient_db", { relaxedDurability: true });
