/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import '../../../../MapStore2/web/client/components/TOC/fragments/css/groupchildren.css';

export class GroupChildren extends React.Component {
    static propTypes = {
        node: PropTypes.object,
        filter: PropTypes.func,
        onSort: PropTypes.func,
        onError: PropTypes.func,
        setDndState: PropTypes.func,
        level: PropTypes.number,
        activatePreviewTool: PropTypes.bool
    };

    static inheritedPropTypes = ['node', 'filter', 'onSort'];

    static defaultProps = {
        node: null,
        filter: () => true,
        onSort: null,
        level: 1,
        activatePreviewTool: true
    };

    render() {
        let content = [];
        if (this.props.children) {
            let nodes = (this.props.node.nodes || [])
                .filter((node) => this.props.filter(node, this.props.node));
            let i = 0;
            content = nodes.map((node) => React.cloneElement(this.props.children, {
                node: node,
                parentNodeId: this.props.node ? this.props.node.id : '',
                key: node.id,
                sortIndex: node.hide || node.dummy ? i : i++,
                onSort: this.props.onSort,
                onError: this.props.onError,
                level: this.props.level,
                isDraggable: !!this.props.onSort,
                setDndState: this.props.setDndState
            }));
        }
        if (this.props.onSort) {
            return (
                <div className={`toc-group-children ${this.props.activatePreviewTool && ' preview'}`} >
                    {content}
                </div>
            );
        }
        return (
            <div className={`toc-group-children ${this.props.activatePreviewTool && ' preview'}`} >{content}</div>
        );
    }
}
