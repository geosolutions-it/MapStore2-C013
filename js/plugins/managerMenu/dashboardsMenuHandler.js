
/**
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import HTML  from '../../../MapStore2/web/client/components/I18N/HTML';
import {toggleDashboardManagerMenu} from "@js/actions/menuManager";
import {includes} from "lodash";

export const dashboardsMenuHandler = (isOpen, items = []) => {
    return ({
        action: () => toggleDashboardManagerMenu(!isOpen),
        text: <HTML msgId={"home.dropdown.dashboardsItem"}/>,
        cfg: {glyph: "dashboard"},
        items: items
            .filter((item) => isOpen && includes(['dashboards', 'createNewDashboard'], item.key))
            .sort((a, b) => a.position - b.position)
    });
};
