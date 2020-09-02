import { TOGGLE_CUSTOM_MANAGER } from "../../actions/menuManager";
import { MenuItem }  from 'react-bootstrap';

export const customMenuHandler = (menus = [], menuStates = {}) => {
    const backgroundColor = "#4E97A0";
    return menus.map(menu => {
        const nestedMenus = menu.items.filter(() => menuStates[menu.name])
            .map(childMenu => {
                return ({
                    tool: MenuItem,
                    text: childMenu.name,
                    cfg: {href: childMenu.link, target: "_blank"},
                    style: {backgroundColor: backgroundColor, borderBottomColor: backgroundColor}
                });
            });
        return [{
            text: menu.name,
            action: () => ({
                type: TOGGLE_CUSTOM_MANAGER,
                payload: {[menu.name]: !menuStates[menu.name]}
            })
        }, ...nestedMenus];
    }).flat();
};
