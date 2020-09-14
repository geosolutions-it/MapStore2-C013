/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from 'expect';

import { catalogRecordsSelector } from "../catalog";

describe('catalog selectors', () => {
    it('catalogRecordsSelector', () => {
        expect(catalogRecordsSelector({
            catalog: {  result: { records: [{"test": "test"}] } }
        })).toEqual([{"test": "test"}]);
    });
});
