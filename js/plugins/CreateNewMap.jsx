/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {assign} from 'lodash';
import {ButtonToolbar, Button as ButtonB, SplitButton as SplitButtonB, MenuItem, Grid, Col, Glyphicon} from 'react-bootstrap';

import Message from '../../MapStore2/web/client/components/I18N/Message';

import NewMapDialog from '../../MapStore2/web/client/components/misc/NewMapDialog';
import tooltip from '../../MapStore2/web/client/components/misc/enhancers/tooltip';

import {showNewMapDialog, createNewMap} from '../../MapStore2/web/client/actions/createnewmap';

import {
    showNewMapDialogSelector,
    hasContextsSelector,
    loadingSelector,
    loadFlagsSelector
} from '../../MapStore2/web/client/selectors/createnewmap';
import {mapTypeSelector} from '../../MapStore2/web/client/selectors/maptype';

import createnewmap from '../../MapStore2/web/client/reducers/createnewmap';

import * as epics from '../../MapStore2/web/client/epics/createnewmap';

import './createNewMap/createNewMap.less';

const Button = tooltip(ButtonB);
const SplitButton = tooltip(SplitButtonB);

class CreateNewMap extends React.Component {
    static propTypes = {
        loading: PropTypes.bool,
        loadFlags: PropTypes.object,
        mapType: PropTypes.string,
        showNewDashboard: PropTypes.bool,
        showNewGeostory: PropTypes.bool,
        colProps: PropTypes.object,
        isLoggedIn: PropTypes.bool,
        allowedRoles: PropTypes.array,
        user: PropTypes.object,
        fluid: PropTypes.bool,
        hasContexts: PropTypes.bool,
        showNewMapDialog: PropTypes.bool,
        onShowNewMapDialog: PropTypes.func,
        onNewMap: PropTypes.func
    };

    static contextTypes = {
        router: PropTypes.object
    };

    static defaultProps = {
        loading: false,
        loadFlags: {},
        mapType: "leaflet",
        showNewDashboard: true,
        showNewGeostory: true,
        isLoggedIn: false,
        allowedRoles: ["ADMIN"],
        colProps: {
            xs: 12,
            sm: 12,
            lg: 12,
            md: 12
        },
        fluid: false,
        hasContexts: false,
        showNewMapDialog: false,
        onShowNewMapDialog: () => {},
        onNewMap: () => {}
    };

    render() {
        const display = this.isAllowed() ? null : "none";
        return (
            <div className="create-new-map-container">
                <Grid fluid={this.props.fluid} style={{marginBottom: "30px", padding: 0, display}}>
                    <Col {...this.props.colProps} >
                        <ButtonToolbar>
                            {this.props.hasContexts &&
                                <SplitButton
                                    tooltipId="newMap"
                                    className="square-button"
                                    bsStyle="primary"
                                    title={<Glyphicon glyph="add-map" />}
                                    onClick={() => this.createNewEmptyMap()}>
                                    <MenuItem onClick={() => this.createNewEmptyMap()}>
                                        <Message msgId="newMapEmpty"/>
                                    </MenuItem>
                                </SplitButton>
                            }
                            {!this.props.hasContexts &&
                                <Button
                                    tooltipId="newMap"
                                    className="square-button"
                                    bsStyle="primary"
                                    onClick={() => this.createNewEmptyMap()}>
                                    <Glyphicon glyph="add-map"/>
                                </Button>
                            }
                            {this.props.showNewDashboard ?
                                <Button tooltipId="resources.dashboards.newDashboard" className="square-button" bsStyle="primary" onClick={() => { this.context.router.history.push("/dashboard"); }}>
                                    <Glyphicon glyph="add-dashboard" />
                                </Button>
                                : null}
                            {this.props.showNewGeostory ?
                                <Button tooltipId="resources.geostories.newGeostory" className="square-button" bsStyle="primary" onClick={() => { this.context.router.history.push("/geostory/newgeostory/"); }}>
                                    <Glyphicon glyph="add-geostory" />
                                </Button>
                                : null}
                        </ButtonToolbar>
                    </Col>
                </Grid>
                <NewMapDialog
                    show={this.props.showNewMapDialog}
                    onClose={() => this.props.onShowNewMapDialog(false)}
                    onSelect={this.props.onNewMap}/>
            </div>
        );
    }

    createNewEmptyMap = () => {
        this.context.router.history.push("/viewer/" + this.props.mapType + "/new");
    };

    isAllowed = () => this.props.isLoggedIn && this.props.allowedRoles.indexOf(this.props.user && this.props.user.role) >= 0;
}

/**
 * Button bar to create a new map or dashboard.
 * @memberof plugins
 * @class CreateNewMap
 * @static
 * @prop {boolean} cfg.showNewDashboard show/hide th create new dashboard button.
 * @prop {boolean} cfg.showNewGeostory show/hide th create new geostory button.
 * @prop {boolean} cfg.showNewContext show/hide the create new context button.
 * @prop {string[]} cfg.allowedRoles array of users roles allowed to create maps and/or dashboards. default: `["ADMIN", "USER"]`. Users that don't have these roles will never see the buttons.
 */
export default {
    CreateNewMapPlugin: assign(connect((state) => ({
        loading: loadingSelector(state),
        loadFlags: loadFlagsSelector(state),
        mapType: mapTypeSelector(state),
        isLoggedIn: state && state.security && state.security.user && state.security.user.enabled && !(state.browser && state.browser.mobile) && true || false,
        user: state && state.security && state.security.user,
        hasContexts: hasContextsSelector(state),
        showNewMapDialog: showNewMapDialogSelector(state)
    }), {
        onShowNewMapDialog: showNewMapDialog,
        onNewMap: createNewMap
    })(CreateNewMap), {
        ManagerMenu: {
            name: 'createNewMap',
            key: 'createNewMap',
            position: 2,
            tool: true,
            priority: 1
        }
    }),
    reducers: {
        createnewmap
    },
    epics
};
