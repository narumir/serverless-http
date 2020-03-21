import {
  ServerResponse,
} from 'http'
import {
  Writable,
} from 'stream'
import {
  Socket,
} from "net";
import {
  ServerlessRequest,
} from './serverlessRequest';
import type {
  ResponseHeaders,
} from './types';

const headerEnd = '\r\n\r\n';

const BODY = Symbol();
const HEADERS = Symbol();

const getString = (data: unknown) => {
  if (Buffer.isBuffer(data)) {
    return data.toString('utf8');
  } else if (typeof data === 'string') {
    return data;
  } else {
    throw new Error(`response.write() of unexpected type: ${typeof data}`);
  }
}

export class ServerlessResponse extends ServerResponse {

  private _wroteHeader: boolean = false;
  [BODY]: Buffer[];
  [HEADERS]: ResponseHeaders;

  static from(req: ServerlessRequest) {
    const response = new ServerlessResponse(req);
    response.statusCode = req.statusCode || 500;
    response.headers
    response[HEADERS] = req.headers;
    response[BODY] = [Buffer.from(req.body)];
    response.end();
    return response;
  }

  static body(response: ServerlessResponse) {
    return Buffer.concat(response[BODY]);
  }

  static headers(response: ServerlessResponse) {
    const headers = typeof response.getHeaders === "function"
      ? response.getHeaders()
      : response.headers; // response._headers
    return Object.assign(headers, response[HEADERS]);
  }

  get headers() {
    return this[HEADERS];
  }

  setHeader(key: string, value: string) {
    if (this._wroteHeader) {
      this[HEADERS][key] = value;
    } else {
      super.setHeader(key, value);
    }
  }

  writeHead: any = (statusCode: number, reason?: string, obj?: any) => {
    const headers = typeof reason === 'string'
      ? obj
      : reason

    for (const name in headers) {
      this.setHeader(name, headers[name])

      if (!this._wroteHeader) {
        // we only need to initiate super.headers once
        // writeHead will add the other headers itself
        break
      }
    }

    super.writeHead(statusCode, reason, obj)
  }

  constructor(request: ServerlessRequest) {
    super(request);
    this[BODY] = [];
    this[HEADERS] = {};
    this.useChunkedEncodingByDefault = false;
    this.chunkedEncoding = false;

    const addData = (data: unknown) => {
      if (Buffer.isBuffer(data) || typeof data === 'string') {
        this[BODY].push(Buffer.from(data));
      } else {
        throw new Error(`response.write() of unexpected type: ${typeof data}`);
      }
    };

    const socket = new Writable({
      write: (chunk, encoding: string | null, done) => {
        if (typeof encoding === "function") {
          done = encoding;
          encoding = null;
        }
        if (this._wroteHeader) {
          addData(chunk);
        } else {
          const str = getString(chunk);
          const index = str.indexOf(headerEnd);
          if (index !== -1) {
            const remainder = str.slice(index + headerEnd.length);
            if (remainder) {
              addData(remainder);
            }
            this._wroteHeader = true
          }
        }
        if (typeof done === "function") {
          done();
        }
      }
    })
    this.assignSocket(socket as Socket);
  }

};
