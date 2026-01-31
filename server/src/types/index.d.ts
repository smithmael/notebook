// index.d.ts
import "@prisma/client";

declare module "@prisma/client" {
  export interface Prisma {
    Role: {
      USER: "USER";
      ADMIN: "ADMIN";
      OWNER: "OWNER";
    };
  }
}