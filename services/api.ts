
import { server } from '../server';

// Helper function to add timeout to promises
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    )
  ]);
};

export const api = {
  async get(endpoint: string, timeout: number = 15000) {
    return withTimeout(
      server.handleRequest(endpoint, 'GET'),
      timeout,
      `Request to ${endpoint} timed out after ${timeout}ms`
    );
  },

  async post(endpoint: string, body: any, timeout: number = 60000) {
    return withTimeout(
      server.handleRequest(endpoint, 'POST', body),
      timeout,
      `Request to ${endpoint} timed out after ${timeout}ms`
    );
  }
};
