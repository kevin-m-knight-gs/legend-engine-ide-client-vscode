/**
 * Copyright (c) 2024-present, Goldman Sachs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createModelSchema, primitive, list } from 'serializr';
import {
  SerializationFactory,
  TextLocation,
  usingModelSchema,
} from '@finos/legend-engine-ide-client-vscode-shared';

export class ExecuteTestRequest {
  location!: TextLocation;
  testId!: string;
  excludedTestIds: string[] | undefined;

  static readonly serialization = new SerializationFactory(
    createModelSchema(ExecuteTestRequest, {
      location: usingModelSchema(TextLocation.serialization.schema),
      testId: primitive(),
      excludedTestIds: list(primitive()),
    }),
  );
}
