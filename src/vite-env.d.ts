/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_EVENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}





declare module 'html5-qrcode' {
  export class Html5Qrcode {
    constructor(elementId: string, config?: any);
    start(cameraId: any, config: any, qrCodeSuccessCallback: (decodedText: string, result: Html5QrcodeResult) => void, qrCodeErrorCallback: (errorMessage: string, error: Html5QrcodeError) => void): Promise<void>;
    stop(): Promise<void>;
    // Add other methods as needed
  }

  export interface Html5QrcodeResult {
    decodedText: string;
    result: any;
  }

  export interface Html5QrcodeError {
    message: string;
    name: string;
    // Add other properties if needed
  }
}

