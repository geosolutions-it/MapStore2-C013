/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from 'expect';

import { toggleMapsManagerMenu } from "../../actions/mapsManager";
import mapsManager from "../mapsManager";

describe('Test the mapsManager reducer', () => {
    it('mapsManager toggleMapsManagerMenu', () => {
        const action = toggleMapsManagerMenu(true);
        const state = mapsManager(undefined, action);
        expect(state).toExist();
        expect(state.openMaps).toBe(true);
    });
});
