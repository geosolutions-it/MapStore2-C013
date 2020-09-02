import React from 'react';
import {isEmpty}  from 'lodash';
import {TOGGLE_MAP_MANAGER} from "../../actions/menuManager";
import HTML  from '../../../MapStore2/web/client/components/I18N/HTML';

export const mapsMenuHandler = (isOpen, router, role, maps = [], mapType, defaultMap = {}) => {
    const map = maps[0] || {};
    if (role !== "ADMIN" && (defaultMap.path || maps.length)) {
        return ({
            action: () => {
                if (!isEmpty(defaultMap) && defaultMap.id) {
                    defaultMap.contextName
                        ? router.history.push("/context/" + defaultMap.contextName + "/" + defaultMap.id)
                        : router.history.push("/viewer/" + mapType + "/" + defaultMap.id);
                } else {
                    map.contextName
                        ? router.history.push("/context/" + map.contextName + "/" + map.id)
                        : router.history.push("/viewer/" + mapType + "/" + map.id);
                }
                return {
                    type: "@@router/LOCATION_CHANGE",
                    payload: {
                        action: router.history.action,
                        isFirstRendering: false,
                        location: router.history.location
                    }
                };
            },
            text: <HTML msgId={"home.dropdown.mapsItem"}/>,
            cfg: {glyph: "1-layer"}
        });
    }

    return ({
        action: () => ({
            type: TOGGLE_MAP_MANAGER,
            payload: !isOpen
        }),
        text: <HTML msgId={"home.dropdown.mapsItem"}/>,
        cfg: {glyph: "1-layer"}
    });
};
