/**
 * Mock transaction data for development and testing
 * TODO: Replace with real blockchain data when backend is ready
 */

import { Transaction } from '../types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'sent',
    amount: 100,
    address: '89dF13w7K2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrSsw5Lvw',
    timestamp: new Date(Date.now() - 34 * 60 * 1000), // 34m ago
    status: 'confirmed',
  },
  {
    id: '2',
    type: 'received',
    amount: 50,
    address: '89dF13w7K2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrSsw5Lvw',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1d ago
    status: 'confirmed',
  },
  {
    id: '3',
    type: 'received',
    amount: 50,
    address: '89dF13w7K2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrSsw5Lvw',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2d ago
    status: 'pending',
  },
];
