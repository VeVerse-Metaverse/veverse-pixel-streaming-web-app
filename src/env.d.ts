/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_V2: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
