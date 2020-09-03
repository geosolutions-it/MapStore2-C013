/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {connect} from 'react-redux';
import {compose, withProps} from 'recompose';
import {find} from 'lodash';
import {createSelector} from 'reselect';

import { createPlugin } from '../../MapStore2/web/client/utils/PluginsUtils';

import BackgroundSelector from '../../MapStore2/web/client/components/background/BackgroundSelector';
import thumbs from '../../MapStore2/web/client/plugins/background/DefaultThumbs';

import {toggleControl, setControlProperty} from '../../MapStore2/web/client/actions/controls';
import {changeLayerProperties, removeNode, updateNode, addLayer} from '../../MapStore2/web/client/actions/layers';
import {addBackground, addBackgroundProperties, confirmDeleteBackgroundModal, backgroundAdded,
    updateThumbnail, removeBackground, clearModalParameters, backgroundEdited, setCurrentBackgroundLayer} from '../../MapStore2/web/client/actions/backgroundselector';


import {allBackgroundLayerSelector, backgroundControlsSelector,
    currentBackgroundSelector, tempBackgroundSelector} from '../../MapStore2/web/client/selectors/layers';
import {mapSelector, mapIsEditableSelector, projectionSelector} from '../../MapStore2/web/client/selectors/map';
import {modalParamsSelector, isDeletedIdSelector, backgroundListSelector,
    backgroundLayersSelector, confirmDeleteBackgroundModalSelector, allowBackgroundsDeletionSelector} from '../../MapStore2/web/client/selectors/backgroundselector';
import {mapLayoutValuesSelector} from '../../MapStore2/web/client/selectors/maplayout';

import controlsReducer from  '../../MapStore2/web/client/reducers/controls';
import backgroundSelectorReducer from  '../../MapStore2/web/client/reducers/backgroundselector';

import backgroundSelectorEpic from  '../../MapStore2/web/client/epics/backgroundselector';

const backgroundSelector = createSelector([
    projectionSelector,
    modalParamsSelector,
    backgroundListSelector,
    isDeletedIdSelector,
    allBackgroundLayerSelector,
    mapSelector,
    mapIsEditableSelector,
    backgroundLayersSelector,
    backgroundControlsSelector,
    currentBackgroundSelector,
    tempBackgroundSelector,
    state => mapLayoutValuesSelector(state, {left: true, bottom: true}),
    state => state.controls && state.controls.metadataexplorer && state.controls.metadataexplorer.enabled,
    state => state.browser && state.browser.mobile ? 'mobile' : 'desktop',
    confirmDeleteBackgroundModalSelector,
    allowBackgroundsDeletionSelector],
(projection, modalParams, backgroundList, deletedId, backgrounds, map, mapIsEditable, layers, controls, currentLayer, tempLayer, style, enabledCatalog, mode, confirmDeleteBackgroundModalObj, allowDeletion) => ({
    mode,
    modalParams,
    backgroundList,
    deletedId,
    backgrounds,
    size: map && map.size || {width: 0, height: 0},
    mapIsEditable,
    layers,
    tempLayer,
    currentLayer,
    start: controls.start || 0,
    enabled: controls.enabled,
    style,
    enabledCatalog,
    confirmDeleteBackgroundModal: confirmDeleteBackgroundModalObj,
    allowDeletion,
    projection
}));

/**
  * BackgroundSelector Plugin.
  * @class BackgroundSelector
  * @memberof plugins
  * @static
  *
  * @prop {number} cfg.left plugin position from left of the map
  * @prop {number} cfg.bottom plugin position from bottom of the map
  * @prop {object} cfg.dimensions dimensions of buttons
  * @class
  * @example
  * {
  *   "name": "BackgroundSelector",
  *   "cfg": {
  *     "dimensions": {
  *       "side": 65,
  *       "sidePreview": 65,
  *       "frame": 3,
  *       "margin": 5,
  *       "label": false,
  *       "vertical": true
  *     }
  *   }
  * }
  */

export const BackgroundSelectorPlugin =
compose(
    connect(backgroundSelector, {
        onPropertiesChange: changeLayerProperties,
        onToggle: toggleControl.bind(null, 'backgroundSelector', null),
        onLayerChange: setControlProperty.bind(null, 'backgroundSelector'),
        onStartChange: setControlProperty.bind(null, 'backgroundSelector', 'start'),
        onAdd: addBackground,
        addLayer: addLayer,
        backgroundAdded,
        onRemove: removeNode,
        onBackgroundEdit: backgroundEdited,
        updateNode,
        onUpdateThumbnail: updateThumbnail,
        removeBackground,
        clearModal: clearModalParameters,
        addBackgroundProperties,
        onRemoveBackground: confirmDeleteBackgroundModal,
        setCurrentBackgroundLayer
    }, (stateProps, dispatchProps, ownProps) => ({
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        thumbs: {
            ...thumbs,
            ...ownProps.thumbs
        }
    })),
    // check if catalog is present to render the + button. TODO: move the add button in the catalog
    withProps(({ items = [] }) => ({
        hasCatalog: !!find(items, { name: 'MetadataExplorer' })
    }))
)(BackgroundSelector);

const FilterLayer = () => null;

export default createPlugin('BackgroundSelectorPlugin',
    {
        component: FilterLayer,
        containers: {
            TOC: {
                name: "BackgroundSelector"
            }
        },
        reducers: {
            controls: controlsReducer,
            backgroundSelector: backgroundSelectorReducer
        },
        epics: backgroundSelectorEpic
    });
