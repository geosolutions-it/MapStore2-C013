import { createSelector } from 'reselect';
import {pathnameSelector} from '../../MapStore2/web/client/selectors/router';
import {dashboardResource, isBrowserMobile} from '../../MapStore2/web/client/selectors/dashboard';

export const buttonCanEdit = createSelector(pathnameSelector, dashboardResource, isBrowserMobile,
    (path, resource, isMobile) => isMobile ? !isMobile : (resource && resource.canEdit || isNaN(path.substr(-2))));
