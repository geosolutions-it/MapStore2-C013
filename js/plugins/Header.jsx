/**
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';

import { createPlugin } from "../../MapStore2/web/client/utils/PluginsUtils";
import HTML from '../../MapStore2/web/client/components/I18N/HTML';
import { backgroundImgs } from "./header/backgrounds";
import './header/header.less';

const backgroundStyle = {
    backgroundImage: `url(${backgroundImgs[Math.floor(backgroundImgs.length * Math.random())]})`
};

const Header = (props) => (
    <div style={{...backgroundStyle, ...props.style}} className="mapstore-header">
        <h1>
            <HTML msgId="home.title"/>
        </h1>
    </div>
);

Header.propTypes = {
    style: PropTypes.object
};

export default createPlugin('Header', {
    component: Header
});
