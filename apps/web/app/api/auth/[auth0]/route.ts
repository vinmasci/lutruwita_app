import { handleAuth } from '@auth0/nextjs-auth0';

/**
 * Dynamic API route handler for Auth0 authentication
 * Handles login, logout, callback, and other Auth0 operations
 */
const handler = handleAuth();

export const GET = handler;
export const POST = handler;
