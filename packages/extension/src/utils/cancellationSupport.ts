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

import { v4 as uuidv4 } from 'uuid';
import { commands } from 'vscode';
import { type CancellationToken } from 'vscode-languageclient';
import { LEGEND_CANCEL_COMMAND } from '@finos/legend-engine-ide-client-vscode-shared';

export function withCancellationSupport(
  token: CancellationToken,
  onCancel: () => void,
): string {
  const requestId = uuidv4();
  token.onCancellationRequested(() =>
    commands.executeCommand(LEGEND_CANCEL_COMMAND, requestId).then(onCancel),
  );
  return requestId;
}
