/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {assign} from 'lodash';
import {ButtonToolbar, Grid, Button as ButtonB, Col, Glyphicon} from 'react-bootstrap';
import {
    loadingSelector,
    loadFlagsSelector
} from '../../../MapStore2/web/client/selectors/createnewmap';
import tooltip from '../../../MapStore2/web/client/components/misc/enhancers/tooltip';
const Button = tooltip(ButtonB);
class CreateNewDashboard extends React.Component {
    static propTypes = {
        loading: PropTypes.bool,
        loadFlags: PropTypes.object,
        showNewDashboard: PropTypes.bool,
        colProps: PropTypes.object,
        isLoggedIn: PropTypes.bool,
        allowedRoles: PropTypes.array,
        user: PropTypes.object,
        fluid: PropTypes.bool
    };

    static contextTypes = {
        router: PropTypes.object
    };

    static defaultProps = {
        loading: false,
        loadFlags: {},
        showNewDashboard: true,
        isLoggedIn: false,
        allowedRoles: ["ADMIN"],
        colProps: {
            xs: 12,
            sm: 12,
            lg: 12,
            md: 12
        },
        fluid: false
    };

    render() {
        const display = this.isAllowed() ? null : "none";
        return (
            <div className="create-new-map-container">
                <Grid fluid={this.props.fluid} style={{marginBottom: "30px", padding: 0, display}}>
                    <Col {...this.props.colProps} >
                        <ButtonToolbar>
                            {this.props.showNewDashboard ?
                                <Button tooltipId="resources.dashboards.newDashboard" className="square-button" bsStyle="primary" onClick={() => { this.context.router.history.push("/dashboard"); }}>
                                    <Glyphicon glyph="add-dashboard" />
                                </Button>
                                : null}
                        </ButtonToolbar>
                    </Col>
                </Grid>
            </div>
        );
    }

    isAllowed = () => this.props.isLoggedIn && this.props.allowedRoles.indexOf(this.props.user && this.props.user.role) >= 0;
}

/**
 * Button bar to create a new dashboard.
 * @memberof plugins
 * @class CreateNewDashboard
 * @static
 * @prop {boolean} cfg.showNewDashboard show/hide th create new dashboard button.
 * @prop {string[]} cfg.allowedRoles array of users roles allowed to create maps and/or dashboards. default: `["ADMIN", "USER"]`. Users that don't have these roles will never see the buttons.
 */
export default {
    CreateNewDashboardPlugin: assign(connect((state) => ({
        loading: loadingSelector(state),
        loadFlags: loadFlagsSelector(state),
        isLoggedIn: state && state.security && state.security.user && state.security.user.enabled && !(state.browser && state.browser.mobile) && true || false,
        user: state && state.security && state.security.user
    }), {
    })(CreateNewDashboard), {
        ManagerMenu: {
            name: 'createNewDashboard',
            key: 'createNewDashboard',
            position: 3,
            tool: true,
            priority: 1
        }
    }),
    reducers: {},
    epics: {}
};
