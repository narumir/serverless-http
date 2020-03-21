import {
  IncomingMessage,
} from "http";
import type {
  APIGatewayEventRequestContext,
} from "aws-lambda";
import type {
  ServerlessRequestParams,
  ServerlessSocket,
} from "./types";

export class ServerlessRequest extends IncomingMessage {

  requestContext: APIGatewayEventRequestContext;
  ip: string;
  body: string | Buffer;

  constructor({
    method,
    url,
    headers,
    body,
    remoteAddress,
    requestContext
  }: ServerlessRequestParams) {
    super({
      readable: false,
      remoteAddress,
      address: () => ({
        port: 443,
      }),
      encrypted: true,
    } as ServerlessSocket);
    this.requestContext = requestContext;
    this.ip = remoteAddress;
    this.complete = true;
    this.httpVersion = "1.1";
    this.httpVersionMajor = 1;
    this.httpVersionMinor = 1;
    this.method = method;
    this.headers = headers;
    this.body = body;
    this.url = url;
    this.push(body);
    this.push(null);
  }

}
