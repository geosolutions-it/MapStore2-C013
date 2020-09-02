/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from 'expect';

import { mapsManagerOpened, customManagerOpened } from "../menuManager";

describe('menuManager selectors', () => {
    it('menuManagerOpened', () => {
        expect(mapsManagerOpened({mainManagerMenu: {openMaps: false}})).toEqual(false);
        expect(mapsManagerOpened({mainManagerMenu: {openMaps: true}})).toEqual(true);
    });
    it('customManagerOpened', () => {
        expect(customManagerOpened({mainManagerMenu: {customMenus: {'testHeading': true}}})).toEqual({'testHeading': true});
    });
});
