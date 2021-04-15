import React, {useState, useEffect} from 'react';
import {Glyphicon, Tooltip} from 'react-bootstrap';
import WMSLegend from '../../../MapStore2/web/client/components/TOC/fragments/WMSLegend';
import Portal from '../../../MapStore2/web/client/components/misc/Portal';
import Dialog from  '../../../MapStore2/web/client/components/misc/Dialog';
import Message from '../../../MapStore2/web/client/components/I18N/Message';
import OverlayTrigger from '../../../MapStore2/web/client/components/misc/OverlayTrigger';

export default ({onClose, legendOptions}) => {
    const imgElement = document.querySelector('#legend-dialog img');
    const [href, setHref] = useState(null);
    useEffect(()=>{ setHref(imgElement?.src) },[imgElement]);
    return (
        <Portal>
            <Dialog id={"legend-dialog"} draggable={false} style={{width: 300}} onClickOut={onClose} modal={false}>
                <span role="header" style={{display: "flex", justifyContent: "space-between"}}>
                    <span><Message msgId={"toc.legend.title"} /></span>
                    <button onClick={onClose} className="close"> <Glyphicon glyph="1-close"/></button>
                </span>
                <div role="body">
                    <OverlayTrigger key="addLayer" placement="bottom"
                                    overlay={<Tooltip><Message msgId={"toc.legend.view"}/></Tooltip>}>
                        <a href={href} target="_blank">
                            <WMSLegend {...legendOptions} />
                        </a>
                    </OverlayTrigger>
                </div>
            </Dialog>
        </Portal>
    );
};
