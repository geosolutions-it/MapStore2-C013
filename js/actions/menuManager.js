/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const TOGGLE_MAP_MANAGER = "HOME_DROPDOWN:TOGGLE_MAP_MANAGER";
export const TOGGLE_CUSTOM_MANAGER = "HOME_DROPDOWN:TOGGLE_CUSTOM_MANAGER";
export const TOGGLE_DASHBOARD_MANAGER = "HOME_DROPDOWN:TOGGLE_DASHBOARD_MANAGER";

export const toggleMapsManagerMenu = (value) => ({
    type: TOGGLE_MAP_MANAGER,
    payload: value
});

export const toggleCustomManagerMenu = (value) => ({
    type: TOGGLE_CUSTOM_MANAGER,
    payload: value
});

export const toggleDashboardManagerMenu = (value) => ({
    type: TOGGLE_DASHBOARD_MANAGER,
    payload: value
});
