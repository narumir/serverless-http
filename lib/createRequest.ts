import URL from "url";
import {
  ServerlessRequest,
} from "./serverlessRequest";
import type {
  CleanEvent,
  ProviderOptions,
  RequestHeaders,
} from "./types";

const requestHeader = (
  event: CleanEvent,
): RequestHeaders => {
  return Object.keys(event.headers).reduce((headers, key) => {
    Object.assign(headers, { [key.toLowerCase()]: event.headers[key] });
    return headers;
  }, {});
};

const requestBody = (
  event: CleanEvent,
) => {
  const bodyType = Buffer.isBuffer(event.body) ? "buffer" : typeof event.body;
  switch (bodyType) {
    case "buffer":
      return event.body;
    case "string":
      return Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");
    case "object":
      return Buffer.from(JSON.stringify(event.body));
    default:
      throw new Error(`Unexpected event.body type: ${bodyType}`);
  }
};

export const createRequest = (
  event: CleanEvent,
  options: ProviderOptions,
) => {
  const method = event.httpMethod;
  const query = event.multiValueQueryStringParameters || event.queryStringParameters;
  const remoteAddress = event.requestContext.identity.sourceIp;
  const headers = requestHeader(event);
  const body = requestBody(event);

  if (typeof options.requestId === "string" && options.requestId.length > 0) {
    const header = options.requestId.toLowerCase();
    headers[header] = headers[header] || event.requestContext.requestId;
  }

  const request = new ServerlessRequest({
    method,
    headers,
    body,
    remoteAddress,
    url: URL.format({
      pathname: event.path,
      query,
    }),
    requestContext: event.requestContext,
  });

  return request;
};
