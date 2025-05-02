import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// These exports are not needed as they are handled in setupTests.ts
export { server };
