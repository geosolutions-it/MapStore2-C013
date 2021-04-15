/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Dashboards from '../../MapStore2/web/client/plugins/Dashboards';
import assign from 'object-assign';

export default assign(Dashboards, {
    DashboardsPlugin: assign(Dashboards.DashboardsPlugin, {
        ManagerMenu: {
            name: 'dashboards',
            key: 'dashboards',
            position: 3,
            tool: true,
            priority: 1
        }
    })
});
