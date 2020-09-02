/*
* Copyright 2020, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/
const React = require('react');
const PropTypes = require('prop-types');
const assign = require('object-assign');
const {connect} = require('react-redux');
const { compose } = require('recompose');
const ConfigUtils = require('../../MapStore2/web/client/utils/ConfigUtils');
const Message = require("../../MapStore2/web/client/components/I18N/Message");

const maptypeEpics = require('../../MapStore2/web/client/epics/maptype');
const mapsEpics = require('../../MapStore2/web/client/epics/maps');
const {mapTypeSelector} = require('../../MapStore2/web/client/selectors/maptype');
const {userRoleSelector} = require('../../MapStore2/web/client/selectors/security');
const {versionSelector} = require('../../MapStore2/web/client/selectors/version');
const { isFeaturedMapsEnabled } = require('../../MapStore2/web/client/selectors/featuredmaps');
const emptyState = require('../../MapStore2/web/client/components/misc/enhancers/emptyState');
const {createSelector} = require('reselect');

const MapsGrid = require('../components/maps/MapsGrid');
const MetadataModal = require('../../MapStore2/web/client/plugins/maps/MetadataModal');
const EmptyMaps = require('../../MapStore2/web/client/plugins/maps/EmptyMaps').default;

const {loadMaps, setShowMapDetails} = require('../../MapStore2/web/client/actions/maps');

const PaginationToolbar = connect((state) => {
    if (!state.maps ) {
        return {};
    }
    let {start, limit, results, loading, totalCount, searchText} = state.maps;
    const total = Math.min(totalCount || 0, limit || 0);
    const page = results && total && Math.ceil(start / total) || 0;
    return {
        page: page,
        pageSize: limit,
        items: results,
        total: totalCount,
        searchText,
        loading
    };
}, {onSelect: loadMaps}, (stateProps, dispatchProps) => {

    return {
        ...stateProps,
        onSelect: (pageNumber) => {
            let start = stateProps.pageSize * pageNumber;
            let limit = stateProps.pageSize;
            dispatchProps.onSelect(ConfigUtils.getDefaults().geoStoreUrl, stateProps.searchText, {start, limit});
        }
    };
})(require('../components/misc/PaginationToolbar'));

/**
 * Plugin for Maps resources
 * @name Maps
 * @memberof plugins
 * @prop {boolean} cfg.showCreateButton default true, use to render create a new one button
 */
class Maps extends React.Component {
    static propTypes = {
        mapType: PropTypes.string,
        title: PropTypes.any,
        onGoToMap: PropTypes.func,
        loadMaps: PropTypes.func,
        setShowMapDetails: PropTypes.func,
        showMapDetails: PropTypes.bool,
        maps: PropTypes.array,
        searchText: PropTypes.string,
        mapsOptions: PropTypes.object,
        colProps: PropTypes.object,
        version: PropTypes.string,
        fluid: PropTypes.bool,
        showAPIShare: PropTypes.bool
    };

    static contextTypes = {
        router: PropTypes.object
    };

    static defaultProps = {
        mapType: "leaflet",
        onGoToMap: () => {},
        loadMaps: () => {},
        setShowMapDetails: () => {},
        fluid: false,
        title: <h3><Message msgId="manager.maps_title" /></h3>,
        mapsOptions: {start: 0, limit: 12},
        colProps: {
            xs: 12,
            sm: 12,
            lg: 12,
            md: 12,
            className: 'ms-map-card-col'
        },
        maps: [],
        showAPIShare: true
    };

    render() {
        return (<MapsGrid
            maps={this.props.maps.filter(map => !map.contextName)}
            fluid={this.props.fluid}
            title={this.props.title}
            colProps={this.props.colProps}
            viewerUrl={(map = {}) => {
                if (map.contextName) {
                    this.context.router.history.push("/context/" + map.contextName + "/" + map.id);
                } else {
                    this.context.router.history.push("/viewer/" + this.props.mapType + "/" + map.id);
                }
            }}
            getShareUrl={(map) => map.contextName ? `context/${map.contextName}/${map.id}` : `viewer/${this.props.mapType}/${map.id}`}
            shareApi={this.props.showAPIShare}
            version={this.props.version}
            bottom={<PaginationToolbar />}
            metadataModal={MetadataModal}
        />);
    }
}

const mapsPluginSelector = createSelector([
    mapTypeSelector,
    state => state.maps && state.maps.searchText,
    state => state.maps && state.maps.results ? state.maps.results : [],
    state => state.maps && state.maps.loading,
    isFeaturedMapsEnabled,
    userRoleSelector,
    versionSelector
], (mapType, searchText, maps, loading, featuredEnabled, role, version) => ({
    mapType,
    searchText,
    version,
    maps: maps.map(map => ({...map, featuredEnabled: featuredEnabled && role === 'ADMIN'})),
    loading
}));

const MapsPlugin = compose(
    connect(mapsPluginSelector, {
        loadMaps, setShowMapDetails
    }),
    emptyState(
        ({maps = [], loading}) => !loading && maps.length === 0,
        ({showCreateButton = true}) => ({
            glyph: "1-map",
            title: <Message msgId="resources.maps.noMapAvailable" />,
            content: <EmptyMaps showCreateButton={showCreateButton} />
        })
    )
)(Maps);

module.exports = {
    MapsPlugin: assign(MapsPlugin, {
        NavMenu: {
            position: 2,
            label: <Message msgId="manager.maps_title" />,
            linkId: '#mapstore-maps-grid',
            glyph: '1-map'
        },
        ManagerMenu: {
            name: 'maps',
            key: 'maps',
            position: 1,
            tool: true,
            priority: 1
        }
    }),
    epics: {
        ...maptypeEpics,
        ...mapsEpics
    },
    reducers: {
        maps: require('../../MapStore2/web/client/reducers/maps'),
        maptype: require('../../MapStore2/web/client/reducers/maptype'),
        currentMap: require('../../MapStore2/web/client/reducers/currentMap')
    }
};
