import { TOGGLE_CUSTOM_MANAGER } from "../../actions/menuManager";
import { MenuItem }  from 'react-bootstrap';

const DEFAULT_LANG = 'en-US';

export const customMenuHandler = (menus = [], menuStates = {}, currentLocale = DEFAULT_LANG) => {
    const backgroundColor = "#4E97A0";
    return menus.map(menu => {
        const nestedMenus = menu.items.filter(() => menuStates[menu.name.DEFAULT_LANG])
            .map(childMenu => {
                return ({
                    tool: MenuItem,
                    text: childMenu.name[currentLocale],
                    cfg: {href: childMenu.link, target: "_blank"},
                    style: {backgroundColor: backgroundColor, borderBottomColor: backgroundColor}
                });
            });
        return [{
            text: menu.name[currentLocale],
            action: () => ({
                type: TOGGLE_CUSTOM_MANAGER,
                payload: {[menu.name.DEFAULT_LANG]: !menuStates[menu.name.DEFAULT_LANG]}
            })
        }, ...nestedMenus];
    }).flat();
};
