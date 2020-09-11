/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {Row, Col} = require('react-bootstrap');
const Thumbnail = require('../../../MapStore2/web/client/components/resources/forms/Thumbnail');
const FileDrop = require('../../../MapStore2/web/client/components/resources/forms/FileDrop').default;

module.exports = class MainForm extends React.Component {
    render() {
        const {
            resource,
            enableFileDrop = false,
            acceptedDropFileName,
            fileDropLabel,
            fileDropStatus,
            fileDropErrorMessage,
            fileDropClearMessage,
            onFileDrop = () => { },
            onFileDropClear = () => { },
            onError = () => { },
            onUpdateLinkedResource = () => { },
            resourceThumbnail = ''
        } = this.props;
        return (<Row>
            {enableFileDrop && <Col xs={12}>
                <FileDrop
                    acceptedFileName={acceptedDropFileName}
                    label={fileDropLabel}
                    status={fileDropStatus}
                    errorMessage={fileDropErrorMessage}
                    clearMessage={fileDropClearMessage}
                    onDrop={onFileDrop}
                    onClear={onFileDropClear}
                    onError={onError}/>
            </Col>}
            <Col xs={12}>
                <Thumbnail
                    resource={resource}
                    thumbnail={
                        resourceThumbnail
                    }
                    onError={onError}
                    onRemove={onUpdateLinkedResource}
                    onUpdate={onUpdateLinkedResource} />
            </Col>
        </Row>);
    }
};
