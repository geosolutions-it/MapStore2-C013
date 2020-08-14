

/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TOGGLE_MAP_MANAGER } from '../actions/mapsManager';

const DEFAULT_STATE = {
    openMaps: false
};
/**
 * Reducer for map list in menuManager.
 * Manages the state of MenuManager plugin
 */
export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
    case TOGGLE_MAP_MANAGER:
        return {
            ...state,
            openMaps: action.payload || false
        };
    default:
        return state;
    }

};
