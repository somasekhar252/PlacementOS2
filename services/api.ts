import { server } from '../server';

export const api = {
  async get(endpoint: string) {
    try {
      return await server.handleRequest(endpoint, 'GET');
    } catch (error) {
      console.error(`API GET Error [${endpoint}]:`, error);
      throw error;
    }
  },

  async post(endpoint: string, body: any) {
    try {
      return await server.handleRequest(endpoint, 'POST', body);
    } catch (error) {
      console.error(`API POST Error [${endpoint}]:`, error);
      throw error;
    }
  }
};
