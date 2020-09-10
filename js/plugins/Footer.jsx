/**
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { createPlugin } from "../../MapStore2/web/client/utils/PluginsUtils";
import HTML from '../../MapStore2/web/client/components/I18N/HTML';
import './footer/footer.less';

const Footer = () => (
    <div id="viewer-footer" className="ms-footer col-md-12">
        <p>
            <HTML msgId="home.footerDescription"/>
        </p>
    </div>
);

export default createPlugin('Footer', {
    component: Footer
});
