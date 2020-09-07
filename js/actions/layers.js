/**
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const SET_DEFAULT_EXPANDED = 'LAYERS:SET_DEFAULT_EXPANDED';

/**
 * Move a node in state.groups from one parent to another
 * @memberof actions.layers
 * @function
 * @param {object} node an id of a node to move
 * @param {object} groupId an id of a group node to move current node into
 * @param {number} index a position that inserted node should have(ordering)
 */

export const setDefaultExpanded = (group, expanded) => ({
    type: SET_DEFAULT_EXPANDED,
    group: group,
    expanded: expanded
});
