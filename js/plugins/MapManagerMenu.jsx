/**
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from 'react';
import {connect} from 'react-redux';
import PropTypes  from 'prop-types';
import assign  from 'object-assign';
import {DropdownButton, Glyphicon, MenuItem}  from 'react-bootstrap';

import { itemSelected } from '../../MapStore2/web/client/actions/manager';
import { isPageConfigured }  from "../../MapStore2/web/client/selectors/plugins";
import { mapsManagerOpened, customManagerOpened }  from '../selectors/menuManager';
import ToolsContainer  from '../../MapStore2/web/client/plugins/containers/ToolsContainer';
import Message  from '../../MapStore2/web/client/plugins/locale/Message';
import HTML  from '../../MapStore2/web/client/components/I18N/HTML';
import { isFeaturedMapsEnabled } from '../../MapStore2/web/client/selectors/featuredmaps';
import {mapTypeSelector}  from '../../MapStore2/web/client/selectors/maptype';
import menuManagerReducer from '../reducers/menuManager';
import contentTabsEpic from '../../MapStore2/web/client/epics/contenttabs';
import customMenusTest from '../../customMenuItems.json';
import { customMenuHandler } from './managerMenu/customMenuHandler';
import './managerMenu/managerMenu.less';
import '../../MapStore2/web/client/plugins/burgermenu/burgermenu.css';
import {toggleControl} from '../../MapStore2/web/client/actions/controls';

const drawerMenuButton = ({
    toggleMenu = () => {}
}) => {
    return ({
        action: () => toggleMenu(),
        text: <HTML msgId={"home.dropdown.layersItem"}/>,
        cfg: {glyph: "1-layer"}
    });
};

const DropdownManager = (props = {}) => {
    const [open, setOpen] = useState(props.open || false);
    return (
        <DropdownButton
            open={open}
            {...props}
            onToggle={(isOpen, event, eventDetails) => {
                if (props.disabled
                || eventDetails?.source === 'select'
                ) {
                    return null;
                }
                return setOpen(!open);
            }}
            {...props}
        />
    );
};

const Container = connect(() => ({
    noCaret: true,
    pullRight: true,
    bsStyle: "primary",
    title: <Glyphicon glyph="menu-hamburger"/>,
    id: "congo-dropdown-menu"
}))(DropdownManager);

class MapManagerMenu extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string,
        dispatch: PropTypes.func,
        role: PropTypes.string,
        entries: PropTypes.array,
        title: PropTypes.node,
        onItemClick: PropTypes.func,
        itemSelected: PropTypes.func,
        controls: PropTypes.object,
        mapType: PropTypes.string,
        panelStyle: PropTypes.object,
        panelClassName: PropTypes.string,
        enableRulesManager: PropTypes.bool,
        enableImporter: PropTypes.bool,
        enableContextManager: PropTypes.bool,
        items: PropTypes.array,
        isOpenMapsManager: PropTypes.bool,
        maps: PropTypes.array,
        defaultMap: PropTypes.object
    };

    static contextTypes = {
        messages: PropTypes.object,
        router: PropTypes.object
    };

    static defaultProps = {
        id: "mapstore-burger-menu",
        entries: [
            {
                "msgId": "users.title",
                "glyph": "1-group-mod",
                "path": "/manager/usermanager"
            },
            {
                "msgId": "contextManager.title",
                "glyph": "wrench",
                "path": "/context-manager"
            },
            {
                "msgId": "contextManager.title",
                "glyph": "wrench",
                "path": "/context-manager"
            }
        ],
        role: "",
        onItemClick: () => {},
        itemSelected: () => {},
        controls: [],
        mapType: "leaflet",
        panelStyle: {
            minWidth: "300px",
            zIndex: 100,
            position: "absolute",
            overflow: "auto"
        },
        panelClassName: "toolbar-panel",
        enableContextManager: false,
        items: [],
        selected: 0,
        hiddenTabs: {},
        className: "content-tabs",
        style: {},
        onSelect: () => {},
        isOpenMapsManager: false,
        maps: [],
        defaultMap: {}
    };

    getTools = () => {
        return [
            ...this.props.entries
                .filter(e => this.props.enableRulesManager || e.path !== "/rules-manager")
                .filter(e => this.props.enableImporter || e.path !== "/importer")
                .filter(e => this.props.enableContextManager || e.path !== "/context-manager")
                .filter(e => (this.props.role !== "ADMIN" && e.path !== "/manager/usermanager") || (this.props.role === "ADMIN"))
                .sort((a, b) => a.position - b.position).map((entry) => {
                    return {
                        action: (context) => {
                            context.router.history.push(entry.path);
                            this.props.itemSelected(entry.id);
                            return {
                                type: "@@router/LOCATION_CHANGE",
                                payload: {
                                    action: context.router.history.action,
                                    isFirstRendering: false,
                                    location: context.router.history.location
                                }
                            };
                        },
                        text: entry.msgId ? <Message msgId={entry.msgId} /> : entry.text,
                        cfg: {...entry}
                    };
                }),
            drawerMenuButton({toggleMenu: this.props.toggleMenu}),
            ...customMenuHandler(customMenusTest, this.props.menuStates)
                .sort((a, b) => a.position - b.position)
        ];
    };

    render() {
        return (
            <>
                <ToolsContainer id={this.props.id} className="square-button"
                    container={Container}
                    mapType={this.props.mapType}
                    toolStyle="primary"
                    activeStyle="default"
                    stateSelector="burgermenu"
                    eventSelector="onSelect"
                    tool={MenuItem}
                    tools={this.getTools()}
                    panelStyle={this.props.panelStyle}
                    panelClassName={this.props.panelClassName}
                />
            </>
        );
    }
}

const IMPORTER_ID = 'importer';
const RULE_MANAGER_ID = 'rulesmanager';

/**
 * This plugin provides a special Manager dropdown menu, that contains various administration tools
 * @memberof plugins
 * @name ManagerMenu
 * @class
 * @prop {boolean} cfg.enableContextManager: enable context manager menu entry, default `true`
 * @prop {object} cfg.defaultMap: predefined map to go from manager menu
 */
export default {
    MapManagerMenuPlugin: assign(connect((state) => ({
        enableRulesManager: isPageConfigured(RULE_MANAGER_ID)(state),
        enableImporter: isPageConfigured(IMPORTER_ID)(state),
        controls: state.controls,
        role: state.security && state.security.user && state.security.user.role,
        isOpenMapsManager: mapsManagerOpened(state),
        menuStates: customManagerOpened(state),
        mapType: mapTypeSelector(state),
        maps: state.maps && state.maps.results
            ? state.maps?.results?.map(map => ({...map, featuredEnabled: isFeaturedMapsEnabled(state) && state?.security?.user?.role === 'ADMIN'}))
            : [],
        toggleMenu: toggleControl.bind(null, 'drawer', null)
    }), {
        itemSelected
    })(MapManagerMenu), {
        OmniBar: {
            name: "mapmanagermenu",
            position: 7,
            tool: true,
            priority: 1
        }
    }),
    reducers: {
        mainManagerMenu: menuManagerReducer
    },
    epics: contentTabsEpic
};
