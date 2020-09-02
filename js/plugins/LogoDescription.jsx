/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { createPlugin } from "../../MapStore2/web/client/utils/PluginsUtils";
import HTML from '../../MapStore2/web/client/components/I18N/HTML';
import src from '../../assets/img/icons/RDC.png';
import './logoDescription/logoDescription.less';

const LogoDescriptionEmpty = () => null;

const LogoDescription = () => (
    <>
        <img className="customer-logo" src={src} height="52" width="80" alt="DRC logo"/>
        <div className="logo-description">
            <h3><HTML msgId="home.country"/></h3>
            <h4><HTML msgId="home.institute"/></h4>
        </div>
    </>
);

export default createPlugin('LogoDescription', {
    component: LogoDescriptionEmpty,
    containers: {
        NavMenu: {
            position: 6,
            label: <LogoDescription/>
        }
    }
});
