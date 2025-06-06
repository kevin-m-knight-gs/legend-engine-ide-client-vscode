/**
 * Copyright (c) 2023-present, Goldman Sachs
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
import {
  type Diagram,
  type PlainObject,
  DIAGRAM_ALIGNER_OPERATOR,
  DIAGRAM_ZOOM_LEVELS,
  V1_diagramModelSchema,
  V1_transformDiagram,
  AlignBottomIcon,
  AlignCenterIcon,
  AlignEndIcon,
  AlignMiddleIcon,
  AlignStartIcon,
  AlignTopIcon,
  CaretDownIcon,
  ControlledDropdownMenu,
  CORE_PURE_PATH,
  DistributeHorizontalIcon,
  DistributeVerticalIcon,
  MenuContent,
  MenuContentDivider,
  MenuContentItem,
  SaveIcon,
  Point,
  CustomSelectorInput,
  compareLabelFn,
} from '@finos/legend-vscode-extension-dependencies';
import { useState } from 'react';
import { serialize } from 'serializr';
import { observer } from 'mobx-react-lite';
import { flowResult } from 'mobx';
import { WRITE_ENTITY } from '@finos/legend-engine-ide-client-vscode-shared';
import type { DiagramEditorState } from '../../stores/DiagramEditorState';
import { postMessage } from '../../utils/VsCodeUtils';

export const DiagramEditorHeader = observer(
  (props: { diagramEditorState: DiagramEditorState }) => {
    const { diagramEditorState } = props;
    const [classSearchValue, setClassSearchValue] = useState('');
    const createCenterZoomer =
      (zoomLevel: number): (() => void) =>
      (): void => {
        diagramEditorState.renderer.zoomCenter(zoomLevel / 100);
      };
    const zoomToFit = (): void => diagramEditorState.renderer.zoomToFit();

    const isAlignerDisabled =
      diagramEditorState.renderer.selectedClasses.length < 2;

    const classEntities = diagramEditorState.entities.filter(
      (entity) => entity.classifierPath === CORE_PURE_PATH.CLASS,
    );

    return (
      <div className="diagram-editor__header">
        <CustomSelectorInput
          className="diagram-editor__header__action diagram-editor__header__search__action"
          options={classEntities
            .map((cl) => ({
              label: cl.path,
              value: cl.path,
            }))
            .sort(compareLabelFn)}
          isLoading={false}
          onInputChange={(value: string) => setClassSearchValue(value)}
          inputValue={classSearchValue}
          onChange={(value: { label: string; value: string }) => {
            const position =
              diagramEditorState.renderer.canvasCoordinateToModelCoordinate(
                diagramEditorState.renderer.eventCoordinateToCanvasCoordinate(
                  new Point(200, 200),
                ),
              );
            flowResult(
              diagramEditorState.addClassView(value.value, position),
            ).catch(
              // eslint-disable-next-line no-console
              (error: unknown) => console.error(error),
            );
          }}
          value={{ label: '', value: '' }}
          placeholder="Search for a Class..."
          isClearable={true}
          escapeClearsValue={true}
          darkMode={true}
          optionCustomization={{
            rowHeight: window.innerHeight * 0.03,
          }}
        />
        <div className="diagram-editor__header__group">
          <button
            className="diagram-editor__header__action diagram-editor__header__group__action"
            title="Save"
            tabIndex={-1}
            onClick={(): void =>
              postMessage({
                command: WRITE_ENTITY,
                entityPath: diagramEditorState.diagramId,
                msg: serialize(
                  V1_diagramModelSchema,
                  V1_transformDiagram(
                    diagramEditorState._renderer?.diagram as Diagram,
                  ),
                ) as PlainObject,
              })
            }
          >
            <SaveIcon className="diagram-editor__icon--aligner" />
          </button>
          <button
            className="diagram-editor__header__action diagram-editor__header__group__action"
            title="Align left"
            disabled={isAlignerDisabled}
            tabIndex={-1}
            onClick={(): void =>
              diagramEditorState.renderer.align(
                DIAGRAM_ALIGNER_OPERATOR.ALIGN_LEFT,
              )
            }
          >
            <AlignStartIcon className="diagram-editor__icon--aligner" />
          </button>
          <button
            className="diagram-editor__header__action diagram-editor__header__group__action"
            title="Align center"
            disabled={isAlignerDisabled}
            tabIndex={-1}
            onClick={(): void =>
              diagramEditorState.renderer.align(
                DIAGRAM_ALIGNER_OPERATOR.ALIGN_CENTER,
              )
            }
          >
            <AlignCenterIcon className="diagram-editor__icon--aligner" />
          </button>
          <button
            className="diagram-editor__header__action diagram-editor__header__group__action"
            title="Align right"
            disabled={isAlignerDisabled}
            tabIndex={-1}
            onClick={(): void =>
              diagramEditorState.renderer.align(
                DIAGRAM_ALIGNER_OPERATOR.ALIGN_RIGHT,
              )
            }
          >
            <AlignEndIcon className="diagram-editor__icon--aligner" />
          </button>
        </div>
        <div className="diagram-editor__header__group__separator" />
        <div className="diagram-editor__header__group">
          <button
            className="diagram-editor__header__action diagram-editor__header__group__action"
            title="Align top"
            disabled={isAlignerDisabled}
            tabIndex={-1}
            onClick={(): void =>
              diagramEditorState.renderer.align(
                DIAGRAM_ALIGNER_OPERATOR.ALIGN_TOP,
              )
            }
          >
            <AlignTopIcon className="diagram-editor__icon--aligner" />
          </button>
          <button
            className="diagram-editor__header__action diagram-editor__header__group__action"
            title="Align middle"
            disabled={isAlignerDisabled}
            tabIndex={-1}
            onClick={(): void =>
              diagramEditorState.renderer.align(
                DIAGRAM_ALIGNER_OPERATOR.ALIGN_MIDDLE,
              )
            }
          >
            <AlignMiddleIcon className="diagram-editor__icon--aligner" />
          </button>
          <button
            className="diagram-editor__header__action diagram-editor__header__group__action"
            title="Align bottom"
            disabled={isAlignerDisabled}
            tabIndex={-1}
            onClick={(): void =>
              diagramEditorState.renderer.align(
                DIAGRAM_ALIGNER_OPERATOR.ALIGN_BOTTOM,
              )
            }
          >
            <AlignBottomIcon className="diagram-editor__icon--aligner" />
          </button>
        </div>
        <div className="diagram-editor__header__group__separator" />
        <div className="diagram-editor__header__group">
          <button
            className="diagram-editor__header__action diagram-editor__header__group__action"
            title="Space horizontally"
            disabled={isAlignerDisabled}
            tabIndex={-1}
            onClick={(): void =>
              diagramEditorState.renderer.align(
                DIAGRAM_ALIGNER_OPERATOR.SPACE_HORIZONTALLY,
              )
            }
          >
            <DistributeHorizontalIcon className="diagram-editor__icon--aligner" />
          </button>
          <button
            className="diagram-editor__header__action diagram-editor__header__group__action"
            title="Space vertically"
            disabled={isAlignerDisabled}
            tabIndex={-1}
            onClick={(): void =>
              diagramEditorState.renderer.align(
                DIAGRAM_ALIGNER_OPERATOR.SPACE_VERTICALLY,
              )
            }
          >
            <DistributeVerticalIcon className="diagram-editor__icon--aligner" />
          </button>
        </div>
        <ControlledDropdownMenu
          className="diagram-editor__header__dropdown"
          title="Zoom..."
          content={
            <MenuContent>
              <MenuContentItem
                className="diagram-editor__header__zoomer__dropdown__menu__item"
                onClick={zoomToFit}
              >
                Fit
              </MenuContentItem>
              <MenuContentDivider />
              {DIAGRAM_ZOOM_LEVELS.map((zoomLevel) => (
                <MenuContentItem
                  key={zoomLevel}
                  className="diagram-editor__header__zoomer__dropdown__menu__item"
                  onClick={createCenterZoomer(zoomLevel)}
                >
                  {zoomLevel}%
                </MenuContentItem>
              ))}
            </MenuContent>
          }
          menuProps={{
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
            transformOrigin: { vertical: 'top', horizontal: 'right' },
            elevation: 7,
          }}
        >
          <div className="diagram-editor__header__dropdown__label diagram-editor__header__zoomer__dropdown__label">
            {Math.round(diagramEditorState.renderer.zoom * 100)}%
          </div>
          <div className="diagram-editor__header__dropdown__trigger diagram-editor__header__zoomer__dropdown__trigger">
            <CaretDownIcon />
          </div>
        </ControlledDropdownMenu>
      </div>
    );
  },
);
