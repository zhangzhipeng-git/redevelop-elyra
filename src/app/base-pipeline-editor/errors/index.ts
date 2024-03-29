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

export class ElyraOutOfDateError extends Error {
  constructor() {
    /* istanbul ignore next */
    super(
      'Pipeline was last edited in a newer version of Redevelop-Elyra. Update Redevelop-Elyra to use this pipeline.'
    );
  }
}

export class PipelineOutOfDateError extends Error {
  constructor() {
    /* istanbul ignore next */
    super('Pipeline is out of date.');
  }
}

export class InvalidPipelineError extends Error {
  constructor() {
    /* istanbul ignore next */
    super('Pipeline is invalid.');
  }
}
