
/**
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './Settings.less';
import OpacitySlider from '../../../../MapStore2/web/client/components/TOC/fragments/OpacitySlider';
import VisibilityCheck from '../../../../MapStore2/web/client/components/TOC/fragments/VisibilityCheck';
import LayersTool from '../../../../MapStore2/web/client/components/TOC/fragments/LayersTool';
import Title from '../../../../MapStore2/web/client/components/TOC/fragments/Title';

export const Settings = ({activateOpacityTool, hideOpacityTooltip, node, onUpdateNode, visibilityCheckType, propertiesChangeHandler, toolbar, currentLocale, selectedNodes}) => {

    const renderVisibility = () => {
        return node.loadingError === 'Error' ?
            (<LayersTool key="loadingerror"
                glyph="exclamation-mark text-danger"
                tooltip="toc.loadingerror"
                className="toc-error" />)
            :
            (<VisibilityCheck key="visibilitycheck"
                tooltip={node.loadingError === 'Warning' ? 'toc.toggleLayerVisibilityWarning' : 'toc.toggleLayerVisibility'}
                node={node}
                checkType={visibilityCheckType}
                propertiesChangeHandler={propertiesChangeHandler} />);
    };

    const renderOpacitySlider = (hideOpacityTooltipValue) => {
        return activateOpacityTool ? (
            <div className="opacity-slider-container">
                <OpacitySlider
                    opacity={node.opacity}
                    disabled={!node.visibility}
                    hideTooltip={hideOpacityTooltipValue}
                    onChange={opacity => onUpdateNode(node.id, 'layers', {opacity})}/>
            </div>
        ) : null;
    };

    return (<div className="layer settings-popup">
        {!node.loadingError && node.visibility && renderOpacitySlider(hideOpacityTooltip)}
        <div className="tools-container">
            {renderVisibility()}
            {node.id === selectedNodes[0] && toolbar}
        </div>
        <Title
            node={node}
            currentLocale={currentLocale}
        />
    </div>);
};

Settings.propTypes = {
    activateOpacityTool: PropTypes.bool,
    hideOpacityTooltip: PropTypes.bool,
    node: PropTypes.object,
    onUpdateNode: PropTypes.func,
    visibilityCheckType: PropTypes.string,
    propertiesChangeHandler: PropTypes.func,
    currentLocale: PropTypes.string,
    selectedNodes: PropTypes.array
};
