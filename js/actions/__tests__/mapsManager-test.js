/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from "expect";

import { TOGGLE_MAP_MANAGER, toggleMapsManagerMenu } from "../mapsManager";

describe('test mapsManager action creators', () => {
    it('toggleMapsManagerMenu', () => {
        const action = toggleMapsManagerMenu(true);
        expect(action.type).toBe(TOGGLE_MAP_MANAGER);
        expect(action.payload).toBe(true);
    });
});
