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
            onmessage = null;
            onmessageerror = null;
            close() { }
            postMessage(message, transfer) { }
            start() { }
            addEventListener() { }
            removeEventListener() { }
            dispatchEvent() { return true; }
        }
    },
    MessageChannel: {
        value: class MessageChannel {
            port1 = new MessagePort();
            port2 = new MessagePort();
        }
    },
    BroadcastChannel: {
        value: class BroadcastChannel {
            name;
            constructor(name) {
                this.name = name;
            }
            onmessage = null;
            onmessageerror = null;
            close() { }
            postMessage(message) { }
            addEventListener() { }
            removeEventListener() { }
            dispatchEvent() { return true; }
        }
    }
});
// Set up fetch API
const { Response, Request, Headers, fetch } = require('undici');
Object.assign(global, { Response, Request, Headers, fetch });
