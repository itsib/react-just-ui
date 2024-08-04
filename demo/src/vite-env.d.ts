/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV;
  readonly PROD;
  readonly VITE_LIB_VERSION: string;
  readonly VITE_LIB_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}