import { sha512 } from "js-sha512";

import reduxStore from "../storage/reduxStore";
import UIStore from "../storage/UIStore";
import UserStorage from "../storage/UserStorage";
import constraints from "./constraints";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type statusResponse = {
  success: boolean;
  errors?: string;
};
type dataResponse<T = object> = {
  data: T;
} & statusResponse;

function fetchAPI<T extends statusResponse>(
  method: Method,
  url: string,
  body?: object,
  showLoadingOverlay?: boolean,
): Promise<T> {
  if (showLoadingOverlay) UIStore.showLoadingOverlay();

  const token = reduxStore.getState().user;
  const category = reduxStore.getState().userCategory;

  const abortController = new AbortController();
  const abortSignal = abortController.signal;
  setTimeout(() => abortController.abort(), 5000);

  const options: RequestInit = {
    method: method,
    signal: abortSignal,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token != undefined && token.token != undefined) {
    // @ts-ignore
    options.headers["x-auth"] = token.token;
    // @ts-ignore
    options.headers["x-timestamp"] = Math.floor(Date.now() / 1000);
    // @ts-ignore
    options.headers["x-sign"] = sha512(`${options.headers["x-timestamp"]}${token.privKey}`);
  }
  if (category != null) {
    // @ts-ignore
    options.headers["x-category"] = category.categoryId;
    // @ts-ignore
    options.headers["x-major"] = category.majorId;
  }

  if (method != "GET") {
    options.body = JSON.stringify(body);
  }

  const url_complete = `${constraints.SERVER_URL}${url}`;
  return fetch(url_complete, options)
    .catch(err => {
      console.log(err);
      if (err.name && (err.name === "AbortError" || err.name === "TimeoutError")) {
        return Promise.reject("서버와 통신에 실패 했습니다 (Timeout)");
      }

      return Promise.reject("서버와 통신 중 오류가 발생했습니다.");
    })
    .then(res => {
      // 특수 처리 (로그인 실패시에도 401이 들어옴)
      // 로그인의 경우는 바로 내려 보냄
      if (url == "/user/login") {
        console.info(res);
        return res.json();
      }

      if (res.status === 401) {
        res.json().then(j => console.error(j));
        // 로그인 안됨 (unauthorized)
        UserStorage.removeUserData();
        return Promise.reject("로그인 토큰이 만료되었습니다.");
      }

      return res.json();
    })
    .then(json => {
      const resp = json as T;

      if (json.status !== true && resp.success === false) {
        return Promise.reject(resp.errors ?? json.message);
      }

      return Promise.resolve(resp);
    })
    .finally(() => {
      if (showLoadingOverlay) UIStore.hideLoadingOverlay();
    });
}

function GetAPI<T extends statusResponse = dataResponse>(
  url: string,
  params?: Record<string, string | number>,
  showLoadingOverlay: boolean = false,
) {
  if (params != undefined) {
    const urlParams = new URLSearchParams();
    Object.keys(params)
      .filter(key => params[key] !== undefined)
      .forEach(key => urlParams.append(key, params[key].toString()));

    url = `${url}?${urlParams.toString()}`;
  }

  return fetchAPI<T>("GET", url, undefined, showLoadingOverlay);
}
function PostAPI<T extends statusResponse = dataResponse>(
  url: string,
  body?: object,
  showLoadingOverlay: boolean = false,
) {
  return fetchAPI<T>("POST", url, body, showLoadingOverlay);
}
function PutAPI<T extends statusResponse = dataResponse>(
  url: string,
  body?: object,
  showLoadingOverlay: boolean = false,
) {
  return fetchAPI<T>("PUT", url, body, showLoadingOverlay);
}
function DeleteAPI<T extends statusResponse = dataResponse>(
  url: string,
  body?: object,
  showLoadingOverlay: boolean = false,
) {
  return fetchAPI<T>("DELETE", url, body, showLoadingOverlay);
}
function PatchAPI<T extends statusResponse = dataResponse>(
  url: string,
  body?: object,
  showLoadingOverlay: boolean = false,
) {
  return fetchAPI<T>("PATCH", url, body, showLoadingOverlay);
}

export type { dataResponse, statusResponse };
export { DeleteAPI, GetAPI, PatchAPI, PostAPI, PutAPI };
