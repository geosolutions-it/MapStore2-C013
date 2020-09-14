/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {themeLoaded} = require('../MapStore2/web/client/actions/theme');

module.exports = (config = {}, pluginsDef, overrideConfig = cfg => cfg) => {
    const React = require('react');
    const ReactDOM = require('react-dom');
    const {connect} = require('react-redux');
    const LocaleUtils = require('../MapStore2/web/client/utils/LocaleUtils');

    const startApp = () => {
        const {loadVersion} = require('../MapStore2/web/client/actions/version');
        const {versionSelector} = require('../MapStore2/web/client/selectors/version');
        const {loadAfterThemeSelector} = require('../MapStore2/web/client/selectors/config');
        const StandardApp = require('../MapStore2/web/client/components/app/StandardApp');

        const {
            appEpics = {},
            baseEpics,
            appReducers = {},
            baseReducers,
            initialState,
            pages,
            printingEnabled = true,
            storeOpts,
            themeCfg = {},
            mode
        } = config;

        const StandardRouter = connect((state) => ({
            locale: state.locale || {},
            pages,
            themeCfg,
            version: versionSelector(state),
            loadAfterTheme: loadAfterThemeSelector(state),
            themeLoaded: state.theme && state.theme.loaded
        }), {
            onThemeLoaded: themeLoaded
        })(require('../MapStore2/web/client/components/app/StandardRouter').default);

        const {updateMapLayoutEpic} = require('../MapStore2/web/client/epics/maplayout');
        const {setSupportedLocales} = require('../MapStore2/web/client/epics/localconfig');
        const {readQueryParamsOnMapEpic} = require('../MapStore2/web/client/epics/queryparams');

        /**
         * appStore data needed to create the store
         * @param {object} baseReducers is used to override all the appReducers
         * @param {object} appReducers is used to extend the appReducers
         * @param {object} baseEpics is used to override all the appEpics
         * @param {object} appEpics is used to extend the appEpics
         * @param {object} initialState is used to initialize the state of the application
        */
        const appStore = require('./stores/StandardStore').bind(null,
            initialState,
            baseReducers || {
                maptype: require('../MapStore2/web/client/reducers/maptype'),
                maps: require('../MapStore2/web/client/reducers/maps'),
                maplayout: require('../MapStore2/web/client/reducers/maplayout'),
                version: require('../MapStore2/web/client/reducers/version'),
                mapPopups: require('../MapStore2/web/client/reducers/mapPopups').default,
                ...appReducers
            },
            baseEpics || {
                updateMapLayoutEpic,
                setSupportedLocales,
                readQueryParamsOnMapEpic,
                ...appEpics
            }
        );

        const initialActions = [
            loadVersion
        ];

        const appConfig = overrideConfig({
            storeOpts,
            appEpics,
            appStore,
            pluginsDef,
            initialActions,
            appComponent: StandardRouter,
            printingEnabled,
            themeCfg,
            mode
        });

        ReactDOM.render(
            <StandardApp enableExtensions {...appConfig}/>,
            document.getElementById('container')
        );
    };

    if (!global.Intl ) {
        // Ensure Intl is loaded, then call the given callback
        LocaleUtils.ensureIntl(startApp);
    } else {
        startApp();
    }
};
