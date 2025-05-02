import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { Response, Request, Headers, fetch } from 'undici';
Object.assign(global, { Response, Request, Headers, fetch }); 