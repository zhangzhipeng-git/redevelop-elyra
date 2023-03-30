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

import { IDictionary } from './parsing';
import { RequestHandler } from './requests';

const ELYRA_METADATA_API_ENDPOINT = 'redevelop-elyra/metadata/';
const ELYRA_SCHEMA_API_ENDPOINT = 'redevelop-elyra/schema/';
const ELYRA_SCHEMASPACE_API_ENDPOINT = 'redevelop-elyra/schemaspace';

/**
 * A service class for accessing the redevelop-elyra api.
 */
export class MetadataService {
  /**
   * Service function for making GET calls to the redevelop-elyra metadata API.
   *
   * @param schemaspace - the metadata schemaspace being accessed
   *
   * @returns a promise that resolves with the requested metadata or
   * an error dialog result
   */
  static async getMetadata(schemaspace: string): Promise<any> {
    return RequestHandler.makeGetRequest(
      ELYRA_METADATA_API_ENDPOINT + schemaspace
    ).then(metadataResponse => metadataResponse[schemaspace]);
  }

  /**
   * Service function for making POST calls to the redevelop-elyra metadata API.
   *
   * @param schemaspace - the metadata schemaspace being accessed
   * @param requestBody - the body of the request
   *
   * @returns a promise that resolves with the newly created metadata or
   * an error dialog result
   */
  static async postMetadata(
    schemaspace: string,
    requestBody: any
  ): Promise<any> {
    return RequestHandler.makePostRequest(
      ELYRA_METADATA_API_ENDPOINT + schemaspace,
      requestBody
    );
  }

  /**
   * Service function for making PUT calls to the redevelop-elyra metadata API.
   *
   * @param schemaspace - the metadata schemaspace being accessed
   * @param name - the metadata name being updated
   * @param requestBody - the body of the request
   *
   * @returns a promise that resolves with the updated metadata or
   * an error dialog result
   */
  static async putMetadata(
    schemaspace: string,
    name: string,
    requestBody: any
  ): Promise<any> {
    return RequestHandler.makePutRequest(
      `${ELYRA_METADATA_API_ENDPOINT}${schemaspace}/${name}`,
      requestBody
    );
  }

  /**
   * Service function for making DELETE calls to the redevelop-elyra metadata API.
   *
   * @param schemaspace - the metadata schemaspace being accessed
   * @param name - the metadata name being updated
   *
   * @returns void or an error dialog result
   */
  static async deleteMetadata(schemaspace: string, name: string): Promise<any> {
    return RequestHandler.makeDeleteRequest(
      `${ELYRA_METADATA_API_ENDPOINT}${schemaspace}/${name}`
    );
  }

  private static schemaCache: IDictionary<any> = {};
  private static _clone = (o: any) => JSON.parse(JSON.stringify(o));
  /**
   * Service function for making GET calls to the redevelop-elyra schema API.
   *
   * @param schemaspace - the schema schemaspace being requested
   *
   * @returns a promise that resolves with the requested schemas or
   * an error dialog result
   */
  static async getSchema(schemaspace: string): Promise<any> {
    if (this.schemaCache[schemaspace]) {
      // Deep copy cached schema to mimic request call
      return this._clone(this.schemaCache[schemaspace]);
    }

    return RequestHandler.makeGetRequest(
      ELYRA_SCHEMA_API_ENDPOINT + schemaspace
    ).then(schemaResponse => {
      if (schemaResponse[schemaspace]) {
        this.schemaCache[schemaspace] = schemaResponse[schemaspace];
      }

      return this._clone(schemaResponse[schemaspace]);
    });
  }

  /**
   * Service function for making GET calls to the redevelop-elyra schema API.
   *
   * @returns a promise that resolves with the requested schemas or
   * an error dialog result
   */
  static async getAllSchema(): Promise<any> {
    try {
      const schemaspaces = await RequestHandler.makeGetRequest(
        ELYRA_SCHEMASPACE_API_ENDPOINT
      );
      const schemas = [];

      for (const schemaspace of schemaspaces['schemaspaces']) {
        const schema = await this.getSchema(schemaspace);
        schemas.push(...schema);
      }
      return schemas;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
