/**
 * Mock transaction data for development and testing
 */

import { CachedTransaction } from '../types';

/**
 * Set to true to use mock transactions instead of real cached data
 */
export const USE_MOCK_TRANSACTIONS = true;

export const MOCK_TRANSACTIONS: CachedTransaction[] = [
  {
    txid: 'mock_tx_1_' + Date.now(),
    type: 'received',
    amount: 75,
    fee: 0,
    address:
      '89dF13w7K2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrSsw5Lvw',
    timestamp: Date.now() - 15 * 60 * 1000, // 15m ago
    status: 'confirmed',
  },
  {
    txid: 'mock_tx_2_' + Date.now(),
    type: 'sent',
    amount: 100,
    fee: 1,
    address:
      '89dF13w7K2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrSsw5Lvw',
    timestamp: Date.now() - 34 * 60 * 1000, // 34m ago
    status: 'confirmed',
  },
  {
    txid: 'mock_tx_3_' + Date.now(),
    type: 'received',
    amount: 50,
    fee: 0,
    address:
      '89dF13w7K2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrSsw5Lvw',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1d ago
    status: 'confirmed',
  },
  {
    txid: 'mock_tx_4_' + Date.now(),
    type: 'received',
    amount: 50,
    fee: 0,
    address:
      '89dF13w7K2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrSsw5Lvw',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2d ago
    status: 'pending',
  },
  {
    txid: 'mock_tx_5_' + Date.now(),
    type: 'sent',
    amount: 25,
    fee: 0.5,
    address:
      '89dF13w7K2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrS6tU8vWxY1zA3bC5dE7fG9hJ0kL2mN4pQrSsw5Lvw',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3d ago
    status: 'failed',
  },
];
