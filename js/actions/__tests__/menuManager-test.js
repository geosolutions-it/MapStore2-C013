/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from "expect";

import { TOGGLE_MAP_MANAGER, toggleMapsManagerMenu, TOGGLE_CUSTOM_MANAGER, toggleCustomManagerMenu } from "../menuManager";

describe('test menuManager action creators', () => {
    it('toggleMenuManagerMenu', () => {
        const action = toggleMapsManagerMenu(true);
        expect(action.type).toBe(TOGGLE_MAP_MANAGER);
        expect(action.payload).toBe(true);
    });
    it('toggleCustomManagerMenu', () => {
        const action = toggleCustomManagerMenu({testHeading: true});
        expect(action.type).toBe(TOGGLE_CUSTOM_MANAGER);
        expect(action.payload).toEqual({testHeading: true});
    });
});
