/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { get } from 'lodash';
/**
 * gets the values of the MapsManager item state
 */
export const mapsManagerOpened = state => get(state, "mainManagerMenu.openMaps");

export const customManagerOpened = state => get(state, "mainManagerMenu.customMenus");

export const dashboardsManagerOpened = state => get(state, "mainManagerMenu.openDashboardsMenu");
