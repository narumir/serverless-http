import type {
  APIGatewayProxyEvent,
} from "aws-lambda";

export const getCleanEvent = (
  event: APIGatewayProxyEvent,
) => {
  const cleanEvent = {
    ...event,
    httpMethod: event.httpMethod || "GET",
    path: typeof event.path === "string" ? event.path : "/",
    body: event.body ?? "",
    headers: event.headers || {},
  };
  return cleanEvent;
};
