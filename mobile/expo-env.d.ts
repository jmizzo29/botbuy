/// <reference types="expo/types" />

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_BASE?: string;
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
  }
}
