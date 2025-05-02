import { TextEncoder, TextDecoder } from 'util';
import { webcrypto } from 'crypto';
import { ReadableStream, TransformStream } from 'stream/web';
class MessageChannel {
    port1;
    port2;
    constructor() {
        this.port1 = {};
        this.port2 = {};
    }
}
class MessagePort {
    onmessage;
    onmessageerror;
    postMessage(message) { }
    start() { }
    close() { }
}
Object.defineProperties(global, {
    TextEncoder: { value: TextEncoder },
    TextDecoder: { value: TextDecoder },
    crypto: { value: webcrypto },
    ReadableStream: { value: ReadableStream },
    TransformStream: { value: TransformStream },
    MessageChannel: { value: MessageChannel },
    MessagePort: { value: MessagePort },
});
