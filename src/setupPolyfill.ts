// Set up polyfills before importing undici
import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream, TransformStream } from 'stream/web';
import { webcrypto } from 'crypto';

// Set up Web APIs
Object.defineProperties(global, {
  TextEncoder: { value: TextEncoder },
  TextDecoder: { value: TextDecoder },
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream },
  crypto: { value: webcrypto },
  MessagePort: {
    value: class MessagePort {
      onmessage: ((this: MessagePort, ev: MessageEvent) => any) | null = null;
      onmessageerror: ((this: MessagePort, ev: MessageEvent) => any) | null = null;
      
      close() {}
      postMessage(message: any, transfer?: Transferable[]) {}
      start() {}
      
      addEventListener() {}
      removeEventListener() {}
      dispatchEvent() { return true; }
    }
  },
  MessageChannel: {
    value: class MessageChannel {
      port1: MessagePort = new MessagePort();
      port2: MessagePort = new MessagePort();
    }
  },
  BroadcastChannel: {
    value: class BroadcastChannel {
      constructor(public name: string) {}
      
      onmessage: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
      onmessageerror: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
      
      close() {}
      postMessage(message: any) {}
      
      addEventListener() {}
      removeEventListener() {}
      dispatchEvent() { return true; }
    }
  }
});

// Set up fetch API
const { Response, Request, Headers, fetch } = require('undici');
Object.assign(global, { Response, Request, Headers, fetch }); 