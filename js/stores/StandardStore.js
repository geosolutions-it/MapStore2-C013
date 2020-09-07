/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const assign = require('object-assign');

const {mapConfigHistory, createHistory} = require('../../MapStore2/web/client/utils/MapHistoryUtils');

const map = mapConfigHistory(require('../../MapStore2/web/client/reducers/map'));

const { layers } = require('../reducers/layers');

const mapConfig = require('../../MapStore2/web/client/reducers/config');

const DebugUtils = require('../../MapStore2/web/client/utils/DebugUtils').default;
const {combineEpics, combineReducers} = require('../../MapStore2/web/client/utils/PluginsUtils');

const LayersUtils = require('../../MapStore2/web/client/utils/LayersUtils');
const {CHANGE_BROWSER_PROPERTIES} = require('../../MapStore2/web/client/actions/browser');
const {createEpicMiddleware} = require('redux-observable');

const ListenerEnhancer = require('@carnesen/redux-add-action-listener-enhancer').default;

const { routerMiddleware, connectRouter } = require('connected-react-router');

const layersEpics = require('../../MapStore2/web/client/epics/layers');
const controlsEpics = require('../../MapStore2/web/client/epics/controls');
const configEpics = require('../../MapStore2/web/client/epics/config');
const timeManagerEpics = require('../../MapStore2/web/client/epics/dimension');
const {persistMiddleware, persistEpic} = require('../../MapStore2/web/client/utils/StateUtils');

const standardEpics = {
    ...layersEpics,
    ...controlsEpics,
    ...timeManagerEpics,
    ...configEpics
};

module.exports = (initialState = {defaultState: {}, mobile: {}}, appReducers = {}, appEpics = {}, plugins = {}, storeOpts = {}) => {
    const history = storeOpts.noRouter ? null : require('../../MapStore2/web/client/stores/History').default;
    const allReducers = combineReducers(plugins, {
        ...appReducers,
        localConfig: require('../../MapStore2/web/client/reducers/localConfig'),
        locale: require('../../MapStore2/web/client/reducers/locale'),
        locales: () => {return null; },
        browser: require('../../MapStore2/web/client/reducers/browser'),
        controls: require('../../MapStore2/web/client/reducers/controls'),
        theme: require('../../MapStore2/web/client/reducers/theme').default,
        help: require('../../MapStore2/web/client/reducers/help'),
        map: () => {return null; },
        mapInitialConfig: () => {return null; },
        mapConfigRawData: () => null,
        layers: () => {return null; },
        router: storeOpts.noRouter ? undefined : connectRouter(history)
    });
    const rootEpic = persistEpic(combineEpics(plugins, {...standardEpics, ...appEpics}));
    const optsState = storeOpts.initialState || {defaultState: {}, mobile: {}};
    const defaultState = assign({}, initialState.defaultState, optsState.defaultState);
    const mobileOverride = assign({}, initialState.mobile, optsState.mobile);
    const epicMiddleware = persistMiddleware(createEpicMiddleware(rootEpic));
    const rootReducer = (state, action) => {
        let mapState = createHistory(LayersUtils.splitMapAndLayers(mapConfig(state, action)));
        let newState = {
            ...allReducers(state, action),
            map: mapState && mapState.map ? map(mapState.map, action) : null,
            mapInitialConfig: mapState && mapState.mapInitialConfig || mapState && mapState.loadingError && {
                loadingError: mapState.loadingError,
                mapId: mapState.loadingError.mapId
            } || null,
            mapConfigRawData: mapState && mapState.mapConfigRawData || null,
            layers: mapState ? layers(mapState.layers, action) : null
        };
        if (action && action.type === CHANGE_BROWSER_PROPERTIES && newState.browser.mobile) {
            newState = assign(newState, mobileOverride);
        }

        return newState;
    };
    let store;
    let enhancer;
    if (storeOpts && storeOpts.notify !== false) {
        enhancer = ListenerEnhancer;
    }
    if (storeOpts && storeOpts.persist) {
        storeOpts.persist.whitelist.forEach((fragment) => {
            const fragmentState = localStorage.getItem('mapstore2.persist.' + fragment);
            if (fragmentState) {
                defaultState[fragment] = JSON.parse(fragmentState);
            }
        });
        if (storeOpts.onPersist) {
            setTimeout(() => {storeOpts.onPersist(); }, 0);
        }
    }

    let middlewares = [epicMiddleware];
    if (!storeOpts.noRouter) {
        // Build the middleware for intercepting and dispatching navigation actions
        const reduxRouterMiddleware = routerMiddleware(history);
        middlewares = [...middlewares, reduxRouterMiddleware];
    }

    store = DebugUtils.createDebugStore(rootReducer, defaultState, middlewares, enhancer);
    if (storeOpts && storeOpts.persist) {
        const persisted = {};
        store.subscribe(() => {
            storeOpts.persist.whitelist.forEach((fragment) => {
                const fragmentState = store.getState()[fragment];
                if (fragmentState && persisted[fragment] !== fragmentState) {
                    persisted[fragment] = fragmentState;
                    localStorage.setItem('mapstore2.persist.' + fragment, JSON.stringify(fragmentState));
                }
            });
        });
    }
    return store;
};
