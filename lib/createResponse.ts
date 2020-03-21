import {
  ServerlessRequest,
} from "./serverlessRequest";
import {
  ServerlessResponse,
} from "./serverlessResponse";
import type {
  RequestListener,
} from "http";

const finish = async (
  item: ServerlessRequest | ServerlessResponse,
) => {
  return new Promise((resolve, reject) => {
    if (item instanceof ServerlessRequest && item.complete) {
      return resolve();
    }
    if (item instanceof ServerlessResponse && item.finished) {
      return resolve();
    }
    let finished = false;
    const done = (
      err: Error | null,
    ) => {
      if (finished) {
        return;
      }
      finished = true;
      item.removeListener("end", done);
      item.removeListener("finish", done);
      if (err) {
        reject(err);
      }
      resolve();
    };
    item.once("end", done);
    item.once("finish", done);
  });
};

export const createResponse = async (
  listener: RequestListener,
  request: ServerlessRequest,
) => {
  await finish(request);
  const response = new ServerlessResponse(request);
  listener(request, response);
  await finish(response);
  return response;
};
