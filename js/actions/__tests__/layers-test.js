/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from "expect";

import { SET_DEFAULT_EXPANDED, setDefaultExpanded } from "../layers";

describe('test layers action creators', () => {
    it('setDefaultExpanded', () => {
        const action = setDefaultExpanded('Default', {expanded: false});
        expect(action.type).toBe(SET_DEFAULT_EXPANDED);
        expect(action.group).toBe('Default');
        expect(action.expanded).toEqual({expanded: false});
    });
});
