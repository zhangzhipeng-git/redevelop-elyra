/*
 * Copyright 2018-2022 Redevelop-Elyra Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Dialog } from '@jupyterlab/apputils';
import { URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';

import CONFIG from '@src/config';
import { Loading } from '@src/app/ui-components/loading';
import { RequestErrors } from '../ui-components';

/**
 * A service class for making requests to the jupyter lab server.
 */
export class RequestHandler {
  /**
   * Make a GET request to the jupyter lab server.
   *
   * All errors returned by the server are handled by displaying a relevant
   * error dialog. If provided a `longRequestDialog` then the dialog is displayed
   * to users while waiting for the server response. On success a promise that
   * resolves to the server response is returned.
   *
   * @param requestPath - The url path for the request.
   * This path is appended to the base path of the server for the request.
   *
   * @param longRequestDialog - A optional Dialog param.
   * A warning Dialog to display while waiting for the request to return.
   *
   * @returns a promise that resolves with the server response on success or
   * an error dialog result in cases of failure.
   */
  static async makeGetRequest<T = any>(
    requestPath: string,
    longRequestDialog?: Dialog<any>
  ): Promise<T> {
    return this.makeServerRequest(
      requestPath,
      { method: 'GET' },
      longRequestDialog
    );
  }

  /**
   * Make a POST request to the jupyter lab server.
   *
   * All errors returned by the server are handled by displaying a relevant
   * error dialog. If provided a `longRequestDialog` then the dialog is displayed
   * to users while waiting for the server response. On success a promise that
   * resolves to the server response is returned.
   *
   * @param requestPath - The url path for the request.
   * This path is appended to the base path of the server for the request.
   *
   * @param requestBody - The body of the request.
   * Will be included in the RequestInit object passed to `makeServerRequest`
   *
   * @param longRequestDialog - A optional Dialog param.
   * A warning Dialog to display while waiting for the request to return.
   *
   * @returns a promise that resolves with the server response on success or
   * an error dialog result in cases of failure.
   */
  static async makePostRequest<T = any>(
    requestPath: string,
    requestBody: any,
    isUpload = false,
    headers: any = { 'Content-Type': 'application/json;charset=utf-8' },
    longRequestDialog?: Dialog<any>
  ): Promise<T> {
    if (isUpload && headers['Content-Type']) delete headers['Content-Type'];
    return this.makeServerRequest(
      requestPath,
      {
        method: 'POST',
        headers,
        body: requestBody
      },
      longRequestDialog
    );
  }

  /**
   * Make a PUT request to the jupyter lab server.
   *
   * All errors returned by the server are handled by displaying a relevant
   * error dialog. If provided a `longRequestDialog` then the dialog is displayed
   * to users while waiting for the server response. On success a promise that
   * resolves to the server response is returned.
   *
   * @param requestPath - The url path for the request.
   * This path is appended to the base path of the server for the request.
   *
   * @param requestBody - The body of the request.
   * Will be included in the RequestInit object passed to `makeServerRequest`
   *
   * @param longRequestDialog - A optional Dialog param.
   * A warning Dialog to display while waiting for the request to return.
   *
   * @returns a promise that resolves with the server response on success or
   * an error dialog result in cases of failure.
   */
  static async makePutRequest<T = any>(
    requestPath: string,
    requestBody: any,
    isUpload = false,
    headers: any = { 'Content-Type': 'application/json;charset=utf-8' },
    longRequestDialog?: Dialog<any>
  ): Promise<T> {
    if (isUpload && headers['Content-Type']) delete headers['Content-Type'];
    return this.makeServerRequest(
      requestPath,
      {
        method: 'PUT',
        headers,
        body: requestBody
      },
      longRequestDialog
    );
  }

  /**
   * Make a DELETE request to the jupyter lab server.
   *
   * All errors returned by the server are handled by displaying a relevant
   * error dialog. If provided a `longRequestDialog` then the dialog is displayed
   * to users while waiting for the server response. On success a promise that
   * resolves to the server response is returned.
   *
   * @param requestPath - The url path for the request.
   * This path is appended to the base path of the server for the request.
   *
   * @param longRequestDialog - A optional Dialog param.
   * A warning Dialog to display while waiting for the request to return.
   *
   * @returns a promise that resolves with the server response on success or
   * an error dialog result in cases of failure.
   */
  static async makeDeleteRequest<T = any>(
    requestPath: string,
    longRequestDialog?: Dialog<any>
  ): Promise<T> {
    return this.makeServerRequest(
      requestPath,
      { method: 'DELETE' },
      longRequestDialog
    );
  }

  /**
   * Make a request to the jupyter lab server.
   *
   * The method of request is set in the `method` value in `requestInit`.
   * All errors returned by the server are handled by displaying a relevant
   * error dialog. If provided a `longRequestDialog` then the dialog is displayed
   * to users while waiting for the server response. On success a promise that
   * resolves to the server response is returned.
   *
   * @param requestPath - The url path for the request.
   * This path is appended to the base path of the server for the request.
   *
   * @param requestInit - The initialization options for the request.
   * A RequestInit object to be passed directly to `ServerConnection.makeRequest`
   * that must include a value for `method`.
   * This is based on "@typescript/lib/lib.dom.d/RequestInit"
   * @see {@link https://github.com/Microsoft/TypeScript/blob/master/lib/lib.dom.d.ts#L1558}
   * and {@link https://fetch.spec.whatwg.org/#requestinit}
   *
   * @param longRequestDialog - A optional Dialog param.
   * A warning Dialog to display while waiting for the request to return.
   *
   * @returns a promise that resolves with the server response on success or
   * an error dialog result in cases of failure.
   */
  static async makeServerRequest<T = any>(
    requestPath: string,
    options: RequestInit & { type?: 'blob' | 'json' | 'text' },
    longRequestDialog?: Dialog<any> | Loading,
    config?: { baseUrl: string }
  ): Promise<T> {
    const _baseUrl = CONFIG.baseUrl;
    // use ServerConnection utility to make calls to Jupyter Based services
    // which in this case are in the extension installed by this package
    const settings = ServerConnection.makeSettings(
      Object.assign(
        {
          baseUrl:
            _baseUrl.indexOf('http') > -1 ? _baseUrl : `http://${_baseUrl}`
        },
        config || {}
      )
    );

    const requestUrl = URLExt.join(
      settings.baseUrl,
      `${CONFIG.apiContext ?? ''}${requestPath}`
    );

    const extOptions = { mode: 'cors' };
    // credentials: "include" - 允许跨域携带 cookie
    if (CONFIG.cookie) Object.assign(extOptions, { credentials: 'include' });
    const { type = 'json', ...requestInit } = Object.assign(
      options,
      extOptions
    );

    console.log(`Sending a ${requestInit.method} request to ${requestUrl}`);

    if (longRequestDialog) {
      longRequestDialog.launch();
    }

    const getServerResponse: Promise<T> = new Promise((resolve, reject) => {
      ServerConnection.makeRequest(requestUrl, requestInit, settings).then(
        (response: any) => {
          if (longRequestDialog) longRequestDialog.resolve();

          response[type]().then(
            // handle cases where the server returns a valid response
            (result: any) => {
              if (response.status === 405) {
                resolve(null as T);
                return;
              }
              if (response.status < 200 || response.status >= 300) {
                return reject(result);
              }

              resolve(result);
            },
            // handle 404 if the server is not found
            (reason: any) => {
              if (response.status === 404 || response.status === 409) {
                response['requestPath'] = requestPath;
                return reject(response);
              } else if (response.status === 204) {
                resolve({} as T);
              } else {
                return reject(reason);
              }
            }
          );
        },
        // something unexpected went wrong with the request
        (reason: any) => {
          return reject(reason);
        }
      );
    })
      .then((res: any) => {
        // 返回成功
        if (res.code === '0') {
          return res.data as T;
        }
        // 返回失败
        if (res.code !== undefined) {
          return Promise.reject({
            message: _getErrorHtml(requestUrl, requestInit, res),
            msg: res.msg
          });
        }
        // 其他结构数据
        return res;
      })
      .catch(error => {
        RequestErrors.serverError(error);
        return Promise.reject(error);
      });

    return getServerResponse;
  }
}

function _getErrorHtml(requestUrl: string, requestInit: RequestInit, res: any) {
  const { method } = requestInit;
  return (
    `<div style="word-break:break-all; line-height:20px">` +
    `请求地址：${requestUrl}<br/>` +
    `请求方式：${method}<br/>` +
    `失败原因：${res.msg || '未知'}` +
    `</div>`
  );
}
