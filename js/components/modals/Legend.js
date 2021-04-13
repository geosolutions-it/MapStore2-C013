import React from 'react';
import {Glyphicon} from 'react-bootstrap';
import WMSLegend from '../../../MapStore2/web/client/components/TOC/fragments/WMSLegend';
import Portal from '../../../MapStore2/web/client/components/misc/Portal';
import Dialog from  '../../../MapStore2/web/client/components/misc/Dialog';
import Message from "../../../MapStore2/web/client/components/I18N/Message";

export default ({onClose, legendOptions}) => {
    return (
        <Portal>
            <Dialog id={"legend-dialog"} draggable={false} style={{width: 300}} onClickOut={onClose} modal={false}>
                <span role="header" style={{display: "flex", justifyContent: "space-between"}}>
                    <span><Message msgId={"toc.legend.title"} /></span>
                    <button onClick={onClose} className="close"> <Glyphicon glyph="1-close"/></button>
                </span>
                <div role="body">
                    <WMSLegend {...legendOptions} />
                </div>
            </Dialog>
        </Portal>
    );
};
