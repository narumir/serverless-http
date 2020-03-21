import {
  getCleanEvent,
} from "./getCleanEvent";
import {
  createRequest
} from "./createRequest";
import {
  createResponse,
} from "./createResponse";
import {
  formatResponse
} from "./formatResponse";
import type {
  RequestListener,
} from 'http';
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import type {
  ProviderOptions,
} from "./types";

const options: ProviderOptions = {
  requestId: 'x-request-id'
};

export const serverless = (listener: RequestListener) => {
  return async (
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> => {
    const cleanEvent = getCleanEvent(event);
    const request = createRequest(cleanEvent, options);
    const response = await createResponse(listener, request);
    return formatResponse(response, options);
  };
};
