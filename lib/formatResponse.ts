import type {
  ServerlessResponse,
} from "./serverlessResponse";
import type {
  ProviderOptions,
} from "./types";
import {
  APIGatewayProxyResult,
} from "aws-lambda";

export const formatResponse = (
  response: ServerlessResponse,
  options: ProviderOptions,
): APIGatewayProxyResult => {
  const {
    statusCode,
  } = response;

  // const body = ServerlessResponse.body(response).toString(en)
  return {
    statusCode,
    body: "",
  }
};
