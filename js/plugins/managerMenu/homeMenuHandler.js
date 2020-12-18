
/**
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import HTML  from '../../../MapStore2/web/client/components/I18N/HTML';

export const homeMenuHandler = (router) => {
    return {
        action: () => {
            router.history.push("/");
            return {
                type: "@@router/LOCATION_CHANGE",
                payload: {
                    action: router.history.action,
                    isFirstRendering: false,
                    location: router.history.location
                }
            };
        },
        text: <HTML msgId={"home.dropdown.home"}/>
    };
};
