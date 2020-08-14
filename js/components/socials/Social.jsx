/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

export const Social = props => (
    <a href={props.href || "#"} target="_blank" rel="noopener noreferrer" >
        <img id="social-fb" src={props.src} alt={props.alt || "social-logo"} {...props}/>
    </a>
);

Social.propTypes = {
    href: PropTypes.string,
    src: PropTypes.string,
    alt: PropTypes.string
};
