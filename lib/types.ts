import {
  getCleanEvent,
} from "./getCleanEvent"
import type {
  APIGatewayEventRequestContext,
} from "aws-lambda";
import type {
  Socket,
} from "net";

export type ProviderOptions = {
  requestId: string;
}

export type CleanEvent = ReturnType<typeof getCleanEvent>;

export type RequestHeaders = {
  [header: string]: string;
}

export type ResponseHeaders = {
  [header: string]: string | string[] | undefined;
}

export type ServerlessRequestParams = {
  method: string;
  url: string;
  headers: RequestHeaders;
  body: Buffer | string;
  remoteAddress: string;
  requestContext: APIGatewayEventRequestContext;
};

export interface ServerlessSocket extends Socket {
  encrypted: boolean;
}
