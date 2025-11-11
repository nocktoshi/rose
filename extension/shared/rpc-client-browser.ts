/**
 * Browser gRPC-web client for Nockchain
 * Uses nice-grpc-web for browser compatibility
 */

import { createChannel, createClientFactory, Metadata } from 'nice-grpc-web';
import { NockchainServiceDefinition } from '../generated/web/nockchain/public/v2/nockchain';
import type { Note } from './types';

// RPC endpoint configuration
const DEFAULT_ENDPOINT = 'https://rpc.nockchain.net';

/**
 * Browser RPC client for Nockchain blockchain
 * Compatible with Chrome extensions and web browsers
 */
export class NockchainBrowserRPCClient {
  private client: any;
  private endpoint: string;

  constructor(endpoint: string = DEFAULT_ENDPOINT) {
    this.endpoint = endpoint;

    // Create gRPC-web channel
    const channel = createChannel(endpoint);

    // Create client factory and instantiate service
    const clientFactory = createClientFactory();
    this.client = clientFactory.create(NockchainServiceDefinition, channel);
  }

  /**
   * Get balance (UTXOs/notes) for an address
   * @param address - Base58-encoded v0 address (132 characters - full public key)
   */
  async getBalance(address: string): Promise<Note[]> {
    console.log(`[RPC Browser] Fetching balance for ${address.slice(0, 20)}... from ${this.endpoint}`);

    try {
      const response = await this.client.walletGetBalance({
        address: { key: address },
        page: {
          clientPageItemsLimit: 100,
          pageToken: '',
          maxBytes: '0',
        },
      });

      if (response.error) {
        console.error('[RPC Browser] Server error:', response.error);
        throw new Error(`Server error: ${response.error.message || 'Unknown error'}`);
      }

      if (!response.balance) {
        console.log('[RPC Browser] No balance data in response (empty balance)');
        return [];
      }

      console.log('[RPC Browser] Balance response:', {
        noteCount: response.balance.notes?.length || 0,
        blockHeight: response.balance.height?.value,
      });

      return this.convertBalanceToNotes(response.balance);
    } catch (error) {
      console.error('[RPC Browser] Error fetching balance:', error);
      throw new Error(`Failed to fetch balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get notes by first-name (v1 query method)
   * @param firstNameBase58 - Base58-encoded first-name hash (~55 characters)
   * @returns Array of notes with matching first-name
   */
  async getNotesByFirstName(firstNameBase58: string): Promise<Note[]> {
    console.log(`[RPC Browser] Fetching notes by first-name ${firstNameBase58.slice(0, 20)}... from ${this.endpoint}`);

    try {
      console.log('[RPC Browser] Sending gRPC request with payload:', {
        firstName: { hash: firstNameBase58.slice(0, 20) + '...' },
        page: { clientPageItemsLimit: 100, pageToken: '', maxBytes: '0' }
      });
      const response = await this.client.walletGetBalance({
        firstName: { hash: firstNameBase58 },
        page: {
          clientPageItemsLimit: 100,
          pageToken: '',
          maxBytes: '0',
        },
      });

      console.log('[RPC Browser] Received response:', {
        hasError: !!response.error,
        hasBalance: !!response.balance,
        responseKeys: Object.keys(response),
      });

      if (response.error) {
        console.error('[RPC Browser] Server error:', response.error);
        throw new Error(`Server error: ${response.error.message || 'Unknown error'}`);
      }

      if (!response.balance) {
        console.log('[RPC Browser] No balance data in response (empty balance)');
        return [];
      }

      const noteCount = response.balance.notes?.length || 0;
      console.log('[RPC Browser] Balance response:', {
        noteCount,
        blockHeight: response.balance.height?.value,
        rawNotes: response.balance.notes,
      });

      const notes = this.convertBalanceToNotes(response.balance);
      console.log(`[RPC Browser] Converted ${notes.length} notes, total assets:`, notes.reduce((sum, n) => sum + n.assets, 0));

      return notes;
    } catch (error) {
      console.error('[RPC Browser] Error fetching notes by first-name:', error);
      throw new Error(`Failed to fetch notes by first-name: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get current block height from balance query
   */
  async getCurrentBlockHeight(): Promise<bigint> {
    try {
      // Use a dummy address to get chain info
      const dummyAddress = '1'.repeat(132);
      const response = await this.client.walletGetBalance({
        address: { key: dummyAddress },
        page: { clientPageItemsLimit: 1, pageToken: '', maxBytes: '0' }
      });

      if (response.balance?.height?.value) {
        return BigInt(response.balance.height.value);
      }

      return BigInt(0);
    } catch (error) {
      console.error('[RPC Browser] Error getting block height:', error);
      return BigInt(0);
    }
  }

  /**
   * Convert proto Balance format to our Note[] interface
   */
  private convertBalanceToNotes(balance: any): Note[] {
    if (!balance.notes || balance.notes.length === 0) {
      return [];
    }

    const notes: Note[] = [];

    for (const entry of balance.notes) {
      try {
        const note = this.convertProtoNote(entry);
        if (note) {
          notes.push(note);
        }
      } catch (error) {
        console.error('[RPC Browser] Error converting note:', error, entry);
      }
    }

    return notes;
  }

  /**
   * Convert a single proto note to our Note interface
   */
  private convertProtoNote(balanceEntry: any): Note | null {
    if (!balanceEntry.note) {
      return null;
    }

    const protoNote = balanceEntry.note;
    const name = balanceEntry.name;

    const noteData = protoNote.legacy || protoNote.v1;
    if (!noteData) {
      console.warn('[RPC Browser] Unknown note format:', protoNote);
      return null;
    }

    const nameBytes = name?.bytes || new Uint8Array(80);
    const nameFirst = nameBytes.slice(0, 40);
    const nameLast = nameBytes.slice(40, 80);

    if (protoNote.legacy) {
      return {
        version: 0,
        originPage: BigInt(noteData.originPage || 0),
        timelockMin: noteData.timelockMin ? BigInt(noteData.timelockMin) : undefined,
        timelockMax: noteData.timelockMax ? BigInt(noteData.timelockMax) : undefined,
        nameFirst,
        nameLast,
        lockPubkeys: noteData.lock?.pubkeys || [],
        lockKeysRequired: BigInt(noteData.lock?.keysRequired || 1),
        sourceHash: noteData.source?.hash?.bytes || new Uint8Array(40),
        sourceIsCoinbase: noteData.source?.isCoinbase || false,
        assets: Number(noteData.assets || 0),
      };
    } else {
      return {
        version: noteData.version || 1,
        originPage: BigInt(noteData.originPage || 0),
        timelockMin: undefined,
        timelockMax: undefined,
        nameFirst,
        nameLast,
        lockPubkeys: [],
        lockKeysRequired: BigInt(1),
        sourceHash: new Uint8Array(40),
        sourceIsCoinbase: false,
        assets: Number(noteData.assets || 0),
      };
    }
  }
}

/**
 * Create a browser client instance
 * @param endpoint - gRPC-web endpoint URL (defaults to Zorp's public API)
 */
export function createBrowserClient(endpoint = DEFAULT_ENDPOINT): NockchainBrowserRPCClient {
  return new NockchainBrowserRPCClient(endpoint);
}
