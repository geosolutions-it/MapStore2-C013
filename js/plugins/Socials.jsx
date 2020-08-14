/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { Social} from "../components/socials/Social";
import { createPlugin } from "../../MapStore2/web/client/utils/PluginsUtils";

import FB from "../../assets/img/icons/fb.svg";
import Linkedin from "../../assets/img/icons/linkedin.svg";
import Twitter from "../../assets/img/icons/twitter.svg";

import '../components/socials/socials.less';

const SocialsEmpty = () => null;

const Socials = () => (
    <div className="socials-container">
        <Social className="social-item social-fb" href="" src={FB} alt="fb-logo"/>
        <Social className="social-item social-twitter" href="" src={Twitter} alt="tw-logo"/>
        <Social className="social-item social-linkedin" href="" src={Linkedin} alt="linked-logo"/>
    </div>
);

export default createPlugin('Socials', {
    component: SocialsEmpty,
    containers: {
        OmniBar: {
            position: 4,
            name: 'socials',
            tool: () => <Socials />,
            priority: 2
        }
    }
});
