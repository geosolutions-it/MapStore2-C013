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
const {defaultProps, compose, mapPropsStream} = require('recompose');
const {createSelector} = require('reselect');
const {connect} = require('react-redux');
const {isEqual} = require('lodash');
const { setFeaturedMapsEnabled} = require('../../MapStore2/web/client/actions/maps');

const Message = require("../../MapStore2/web/client/components/I18N/Message");
const maptypeEpics = require('../../MapStore2/web/client/epics/maptype');
const mapsEpics = require('../../MapStore2/web/client/epics/maps');
const {userRoleSelector} = require('../../MapStore2/web/client/selectors/security');
const {versionSelector} = require('../../MapStore2/web/client/selectors/version');
const {mapTypeSelector} = require('../../MapStore2/web/client/selectors/maptype');
const {resourceSelector, searchTextSelector, isFeaturedMapsEnabled} = require('../../MapStore2/web/client/selectors/featuredmaps');
const {loadPage, updateItemsLifecycle} = require('../../MapStore2/web/client/components/maps/enhancers/featuredMaps');
const gridPagination = require('../../MapStore2/web/client/components/misc/enhancers/gridPagination');

const MapsGrid = require('../../MapStore2/web/client/plugins/maps/MapsGrid');
const MetadataModal = require('../../MapStore2/web/client/plugins/maps/MetadataModal');

const PAGE_SIZE = 4;

class FeaturedMaps extends React.Component {

    static propTypes = {
        mapType: PropTypes.string,
        items: PropTypes.array,
        colProps: PropTypes.object,
        fluid: PropTypes.bool,
        bottom: PropTypes.node,
        className: PropTypes.string,
        previousItems: PropTypes.array,
        enableFeaturedMaps: PropTypes.func,
        version: PropTypes.string,
        showAPIShare: PropTypes.bool
    };

    static contextTypes = {
        router: PropTypes.object
    };


    UNSAFE_componentWillMount() {
        this.props.enableFeaturedMaps(true);
    }

    getShareOptions = (res) => {
        if (res.category && res.category.name === 'GEOSTORY') {
            return {
                embedPanel: false,
                advancedSettings: {
                    homeButton: true
                }
            };
        }

        if (res.category && res.category.name === 'MAP') {
            return {
                embedPanel: true
            };
        }

        return {
            embedPanel: false
        };
    }

    render() {
        const items = this.props.items.length > 0 && this.props.items || this.props.previousItems || [];
        return (
            <MapsGrid
                id="ms-featured-maps"
                fluid={this.props.fluid}
                className={this.props.className}
                title={<h3><Message msgId="manager.featuredMaps" /></h3>}
                maps={items}
                colProps={this.props.colProps}
                version={this.props.version}
                viewerUrl={(res) => this.context.router.history.push('/' + this.makeShareUrl(res).url)}
                getShareUrl={this.makeShareUrl}
                shareOptions={this.getShareOptions} // TODO: share options depending on the content type
                metadataModal={MetadataModal}
                bottom={this.props.bottom}
                style={items.length === 0 ? {display: 'none'} : {}}/>
        );
    }

    makeShareUrl = (res) => {
        if (res.category && res.category.name === "DASHBOARD") {
            return {
                url: `dashboard/${res.id}`,
                shareApi: false
            };
        }
        if (res.category && res.category.name === "GEOSTORY") {
            return {
                url: `geostory/${res.id}`,
                shareApi: false
            };
        }
        return {
            url: res.contextName ?
                "context/" + res.contextName + "/" + res.id :
                "viewer/" + this.props.mapType + "/" + res.id,
            shareApi: this.props.showAPIShare

        };
    }
}

const featuredMapsPluginSelector = createSelector([
    mapTypeSelector,
    userRoleSelector,
    state => state.browser && state.browser.mobile,
    searchTextSelector,
    resourceSelector,
    isFeaturedMapsEnabled,
    versionSelector
], (mapType, role, isMobile, searchText, resource, isFeaturedEnabled, version) => ({
    mapType,
    role,
    permission: role === 'ADMIN',
    pagination: isMobile ? 'virtual-scroll-horizontal' : 'show-more',
    searchText,
    resource,
    isFeaturedEnabled,
    version
}));

const updateFeaturedMapsStream = mapPropsStream(props$ =>
    props$.merge(props$.take(1).switchMap(({searchText = '', permission, viewSize, pageSize, loadFirst = () => {} }) => {
        return props$
            .startWith({searchText, permission, viewSize, pageSize, loading: true})
            .distinctUntilChanged((previous, next) =>
                isEqual(previous.resource, next.resource)
                && previous.searchText === next.searchText
                && previous.permission === next.permission
                && previous.role === next.role
            )
            .do(({permission: newPermission, viewSize: newViewSize, searchText: newSearchText, pageSize: newPageSize} = {}) =>
                loadFirst({permission: newPermission, viewSize: newViewSize, searchText: newSearchText, pageSize: newPageSize})
            )
            .ignoreElements();
    })));

/**
 * FeaturedMaps plugin. Shows featured maps in a grid.
 * @prop {string} cfg.pageSize change the page size (only desktop)
 * @memberof plugins
 * @class
 */

const FeaturedMapsPlugin = compose(
    connect(featuredMapsPluginSelector, {
        enableFeaturedMaps: setFeaturedMapsEnabled
    }),
    defaultProps({
        mapType: 'leaflet',
        onGoToMap: () => {},
        fluid: false,
        mapsOptions: {start: 0, limit: 12},
        colProps: {
            xs: 12,
            sm: 6,
            lg: 3,
            md: 4,
            className: 'ms-map-card-col'
        },
        showAPIShare: true,
        items: [],
        pageSize: PAGE_SIZE,
        skip: 0,
        total: 0,
        viewSize: PAGE_SIZE,
        onChangeSize: () => {},
        onLoadMore: () => {},
        loading: false,
        className: '',
        previousItems: [],
        searchText: ''
    }),
    gridPagination({loadPage, pageSize: PAGE_SIZE}),
    updateItemsLifecycle,
    updateFeaturedMapsStream
)((FeaturedMaps));

module.exports = {
    FeaturedMapsPlugin: assign(FeaturedMapsPlugin),
    epics: {
        ...maptypeEpics,
        ...mapsEpics
    },
    reducers: {
        featuredmaps: require('../../MapStore2/web/client/reducers/featuredmaps'),
        maptype: require('../../MapStore2/web/client/reducers/maptype'),
        currentMap: require('../../MapStore2/web/client/reducers/currentMap')
    }
};
