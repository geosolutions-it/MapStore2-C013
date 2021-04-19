/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const { withProps, compose } = require('recompose');
const { createSelector } = require('reselect');
const { connect } = require('react-redux');
const PropTypes = require('prop-types');

const { isDashboardEditing } = require('../../../MapStore2/web/client/selectors/dashboard');
const { dashboardHasWidgets, getWidgetsDependenciesGroups } = require('../../../MapStore2/web/client/selectors/widgets');
const { showConnectionsSelector, isDashboardLoading } = require('../../../MapStore2/web/client/selectors/dashboard');
const { buttonCanEdit } = require('../../selectors/dashboard');
const { dashboardSelector, dashboardsLocalizedSelector } = require('../../../MapStore2/web/client/plugins/widgetbuilder/commons');

const { createWidget, toggleConnection } = require('../../../MapStore2/web/client/actions/widgets');
const { triggerShowConnections } = require('../../../MapStore2/web/client/actions/dashboard');
const dashboardReducer = require('../../../MapStore2/web/client/reducers/dashboard');
const dashboardEpic = require('../../../MapStore2/web/client/epics/dashboard');

const withDashboardExitButton = require('../../../MapStore2/web/client/plugins/widgetbuilder/enhancers/withDashboardExitButton');
const LoadingSpinner = require('../../../MapStore2/web/client/components/misc/LoadingSpinner');

const Builder =
    compose(
        connect(dashboardSelector, { toggleConnection, triggerShowConnections }),
        connect(dashboardsLocalizedSelector),
        withProps(({ availableDependencies = [] }) => ({
            availableDependencies: availableDependencies.filter(d => d !== "map")
        })),
        withDashboardExitButton
    )(require('../../../MapStore2/web/client/plugins/widgetbuilder/WidgetTypeBuilder'));

const Toolbar = compose(
    connect(
        createSelector(
            showConnectionsSelector,
            dashboardHasWidgets,
            buttonCanEdit,
            getWidgetsDependenciesGroups,
            (showConnections, hasWidgets, edit, groups = []) => ({
                showConnections,
                hasConnections: groups.length > 0,
                hasWidgets,
                canEdit: edit
            })
        ),
        {
            onShowConnections: triggerShowConnections,
            onAddWidget: createWidget
        }
    ),
    withProps(({
        onAddWidget = () => { },
        hasWidgets,
        canEdit,
        hasConnections,
        showConnections,
        onShowConnections = () => { }
    }) => ({
        buttons: [{
            glyph: 'plus',
            tooltipId: 'dashboard.editor.addACardToTheDashboard',
            bsStyle: 'primary',
            visible: canEdit,
            id: 'ms-add-card-dashboard',
            onClick: () => onAddWidget()
        },
        {
            glyph: showConnections ? 'bulb-on' : 'bulb-off',
            tooltipId: showConnections ? 'dashboard.editor.hideConnections' : 'dashboard.editor.showConnections',
            bsStyle: showConnections ? 'success' : 'primary',
            visible: !!hasWidgets && !!hasConnections || !canEdit,
            onClick: () => onShowConnections(!showConnections)
        }]
    }))
)(require('../../../MapStore2/web/client/components/misc/toolbar/Toolbar'));

const { setEditing, setEditorAvailable } = require('../../../MapStore2/web/client/actions/dashboard');


class DashboardEditorComponent extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        editing: PropTypes.bool,
        loading: PropTypes.bool,
        limitDockHeight: PropTypes.bool,
        fluid: PropTypes.bool,
        zIndex: PropTypes.number,
        dockSize: PropTypes.number,
        position: PropTypes.string,
        onMount: PropTypes.func,
        onUnmount: PropTypes.func,
        setEditing: PropTypes.func,
        dimMode: PropTypes.string,
        src: PropTypes.string,
        style: PropTypes.object
    };
    static defaultProps = {
        id: "dashboard-editor",
        editing: false,
        dockSize: 500,
        loading: true,
        limitDockHeight: true,
        zIndex: 10000,
        fluid: false,
        dimMode: "none",
        position: "left",
        onMount: () => { },
        onUnmount: () => { },
        setEditing: () => { }
    };
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }
    render() {
        return this.props.editing
            ? <div className="dashboard-editor de-builder"><Builder enabled={this.props.editing} onClose={() => this.props.setEditing(false)} catalog={this.props.catalog} /></div>
            : (<div className="ms-vertical-toolbar dashboard-editor de-toolbar" id={this.props.id}>
                <Toolbar transitionProps={false} btnGroupProps={{ vertical: true }} btnDefaultProps={{ tooltipPosition: 'right', className: 'square-button-md', bsStyle: 'primary' }} />
                {this.props.loading ? <LoadingSpinner style={{ position: 'fixed', bottom: 0}} /> : null}
            </div>);
    }
}

const Plugin = connect(
    createSelector(
        isDashboardEditing,
        isDashboardLoading,
        (editing, loading) => ({ editing, loading }),
    ), {
        setEditing,
        onMount: () => setEditorAvailable(true),
        onUnmount: () => setEditorAvailable(false)
    }
)(DashboardEditorComponent);
module.exports = {
    DashboardEditorPlugin: Plugin,
    reducers: {
        dashboard: dashboardReducer
    },
    epics: dashboardEpic
};