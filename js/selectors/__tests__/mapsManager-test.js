/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from 'expect';

import { mapsManagerOpened } from "../mapsManager";

describe('mapsManager selectors', () => {
    it('mapsManagerOpened', () => {
        expect(mapsManagerOpened({mapsManager: {openMaps: false}})).toEqual(false);
        expect(mapsManagerOpened({mapsManager: {openMaps: true}})).toEqual(true);
    });
});
