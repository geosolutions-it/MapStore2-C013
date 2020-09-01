/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from 'expect';

import { toggleMapsManagerMenu, toggleCustomManagerMenu } from "../../actions/menuManager";
import menuManager from "../menuManager";

describe('Test the menuManager reducer', () => {
    it('menuManager toggleMapsManagerMenu', () => {
        const action = toggleMapsManagerMenu(true);
        const state = menuManager(undefined, action);
        expect(state).toExist();
        expect(state.openMaps).toBe(true);
    });

    it('menuManager toggleCustomManagerMenu', () => {
        const action = toggleCustomManagerMenu({testHeading: true});
        const state = menuManager(undefined, action);
        expect(state).toExist();
        expect(state.customMenus).toEqual({ testHeading: true });
    });
});
