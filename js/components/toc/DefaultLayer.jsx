/*
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const { isObject, castArray, find } = require('lodash');
const { Grid, Row, Col, Glyphicon, Image} = require('react-bootstrap');

const Node = require('../../../MapStore2/web/client/components/TOC/Node');
const draggableComponent = require('../../../MapStore2/web/client/components/TOC/enhancers/draggableComponent');
const VisibilityCheck = require('../../../MapStore2/web/client/components/TOC/fragments/VisibilityCheck');
const Title = require('../../../MapStore2/web/client/components/TOC/fragments/Title');
const WMSLegend = require('../../../MapStore2/web/client/components/TOC/fragments/WMSLegend');
const LayersTool = require('../../../MapStore2/web/client/components/TOC/fragments/LayersTool');
const OpacitySlider = require('../../../MapStore2/web/client/components/TOC/fragments/OpacitySlider');
const ToggleFilter = require('../../../MapStore2/web/client/components/TOC/fragments/ToggleFilter');
const withTooltip = require('../../../MapStore2/web/client/components/data/featuregrid/enhancers/withTooltip');
const localizedProps = require('../../../MapStore2/web/client/components/misc/enhancers/localizedProps');
const { Settings } = require('./fragments/Settings');
const defaultThumb = require('../../../MapStore2/web/client/components/catalog/img/default.jpg');

const GlyphIndicator = localizedProps('tooltip')(withTooltip(Glyphicon));
const axios = require('../../../MapStore2/web/client/libs/ajax');
const SaveModal = require('../modals/Save');

require('./DefaultLayer.less');
/**
 * Default layer node for TOC
 */
class DefaultLayer extends React.Component {
    static propTypes = {
        node: PropTypes.object,
        propertiesChangeHandler: PropTypes.func,
        onToggle: PropTypes.func,
        onContextMenu: PropTypes.func,
        onSelect: PropTypes.func,
        style: PropTypes.object,
        sortableStyle: PropTypes.object,
        activateLegendTool: PropTypes.bool,
        activateOpacityTool: PropTypes.bool,
        indicators: PropTypes.array,
        visibilityCheckType: PropTypes.string,
        currentZoomLvl: PropTypes.number,
        scales: PropTypes.array,
        additionalTools: PropTypes.array,
        legendOptions: PropTypes.object,
        currentLocale: PropTypes.string,
        selectedNodes: PropTypes.array,
        filterText: PropTypes.string,
        onUpdateNode: PropTypes.func,
        titleTooltip: PropTypes.bool,
        filter: PropTypes.func,
        showFullTitleOnExpand: PropTypes.bool,
        hideOpacityTooltip: PropTypes.bool,
        tooltipOptions: PropTypes.object,
        connectDragPreview: PropTypes.func,
        connectDragSource: PropTypes.func,
        connectDropTarget: PropTypes.func,
        isDraggable: PropTypes.bool,
        isDragging: PropTypes.bool,
        isOver: PropTypes.bool,
        language: PropTypes.string,
        activatePreviewTool: PropTypes.bool,
        toolbar: PropTypes.object,
        catalogRecords: PropTypes.array
    };

    static defaultProps = {
        style: {},
        sortableStyle: {},
        propertiesChangeHandler: () => {},
        onToggle: () => {},
        onContextMenu: () => {},
        onSelect: () => {},
        activateLegendTool: false,
        activateOpacityTool: true,
        indicators: [],
        visibilityCheckType: "glyph",
        additionalTools: [],
        currentLocale: 'en-US',
        joinStr: ' - ',
        selectedNodes: [],
        filterText: '',
        onUpdateNode: () => {},
        filter: () => true,
        titleTooltip: false,
        showFullTitleOnExpand: false,
        hideOpacityTooltip: false,
        connectDragPreview: (x) => x,
        connectDragSource: (x) => x,
        connectDropTarget: (x) => x,
        activatePreviewTool: true,
        toolbar: {},
        catalogRecords: []
    };

    constructor(props) {
        super(props);
        this.state = {
            isMounted: false,
            openSettings: false,
            thumbnail: '',
            openSaveThumbnail: false
        };
    }

    componentDidMount() {
        this.setState({isMounted: true});
        !this.props.node?.thumbURL
        && this.props.node?.catalogURL
        && axios.get(this.props.node?.catalogURL).then((response) => {
            const parser = new DOMParser();
            const fetchedThumbnail = parser.parseFromString(response.data, "text/xml")?.querySelector('[name="thumbnail"]');
            if (fetchedThumbnail && this.state.isMounted) {
                this.setState({thumbnail: fetchedThumbnail?.textContent});
            }
        });
    }

    componentWillUnmount() {
        this.state.isMounted = false;
    }

    getTitle = (layer) => {
        const translation = isObject(layer.title) ? layer.title[this.props.currentLocale] || layer.title?.default : layer.title;
        return translation || layer.name;
    };

    renderOpacitySlider = (hideOpacityTooltip) => {
        return this.props.activateOpacityTool ? (
            <OpacitySlider
                opacity={this.props.node.opacity}
                disabled={!this.props.node.visibility}
                hideTooltip={hideOpacityTooltip}
                onChange={opacity => this.props.onUpdateNode(this.props.node.id, 'layers', {opacity})}/>
        ) : null;
    }

    renderCollapsible = () => {
        return (
            <div key="legend" position="collapsible" className="collapsible-toc">
                <Grid fluid>
                    {this.props.showFullTitleOnExpand ? <Row><Col xs={12} className="toc-full-title">{this.getTitle(this.props.node)}</Col></Row> : null}
                    {this.props.activateLegendTool ?
                        <Row>
                            <Col xs={12}>
                                <WMSLegend node={this.props.node} currentZoomLvl={this.props.currentZoomLvl} scales={this.props.scales} language={this.props.language} {...this.props.legendOptions} />
                            </Col>
                        </Row> : null}
                </Grid>
                {this.renderOpacitySlider(this.props.hideOpacityTooltip)}
            </div>);
    };

    renderVisibility = () => {
        return this.props.node.loadingError === 'Error' ?
            (<LayersTool key="loadingerror"
                glyph="exclamation-mark text-danger"
                tooltip="toc.loadingerror"
                className="toc-error" />)
            :
            (<VisibilityCheck key="visibilitycheck"
                tooltip={this.props.node.loadingError === 'Warning' ? 'toc.toggleLayerVisibilityWarning' : 'toc.toggleLayerVisibility'}
                node={this.props.node}
                checkType={this.props.visibilityCheckType}
                propertiesChangeHandler={this.props.propertiesChangeHandler} />);
    }

    renderToolsLegend = (isEmpty) => {
        return this.props.node.loadingError === 'Error' || isEmpty ?
            null
            :
            (<LayersTool
                node={this.props.node}
                tooltip="toc.displayLegendAndTools"
                key="toollegend"
                className="toc-legend"
                ref="target"
                glyph="chevron-left"
                onClick={(node) => this.props.onToggle(node.id, node.expanded)} />);
    }
    renderIndicators = () => {
        /** initial support to render icons in TOC nodes (now only type = "dimension" supported) */
        return castArray(this.props.indicators).map( indicator =>
            (indicator.type === "dimension" ? find(this.props.node && this.props.node.dimensions || [], indicator.condition) : false)
                ? indicator.glyph && <GlyphIndicator key={indicator.key} glyph={indicator.glyph} {...indicator.props} />
                : null);
    }

    renderThumb = (thumbURL, layer) => {
        let thumbCatalogSrc = {};
        if (!thumbURL || !this.state.thumbnail) {
            const recordFromCatalog = this.props.catalogRecords?.filter(record => record?.dc?.title === this.props.node.title);
            const layerURI =  recordFromCatalog[0] && recordFromCatalog[0].dc?.URI || [];
            thumbCatalogSrc = layerURI.find(uri=> uri.name === 'thumbnail') || {};
        }
        const thumbSrc = thumbURL || this.state.thumbnail || thumbCatalogSrc?.value || defaultThumb;

        return (<Image className="preview-img" src={thumbSrc} alt={layer && this.getTitle(layer)}/>);
    };

    renderThumbnailSelector = () => {
        return  (<LayersTool
            node={this.props.node}
            tooltip="toc.thumbnail"
            key="thumbnailPopup"
            className="toc-thumbnail"
            ref="target"
            glyph="pencil"
            onClick={() => this.setState((state) => ({openSaveThumbnail: !state.openSaveThumbnail}))}
        />);
    };

    renderSettings = () => {
        return  (<LayersTool
            node={this.props.node}
            tooltip="toc.settingsPopup"
            key="settingsPopup"
            className="toc-legend"
            ref="target"
            glyph="cog"
            onClick={() => this.setState((state) => ({openSettings: !state.openSettings}))}
        />);
    };

    renderNode = (grab, hide, selected, error, warning, isDummy, other) => {
        const isEmpty = this.props.node.type === 'wms' && !this.props.activateLegendTool && !this.props.showFullTitleOnExpand
        || this.props.node.type !== 'wms' && !this.props.showFullTitleOnExpand;
        const head = (isDummy ?
            <div style={{padding: 0, height: 10}} className="toc-default-layer-head"/> :
            <div className="toc-default-layer-head">
                {grab}
                {!this.props.activatePreviewTool && this.renderVisibility()}
                <ToggleFilter node={this.props.node} propertiesChangeHandler={this.props.propertiesChangeHandler}/>
                <Title
                    tooltipOptions={this.props.tooltipOptions}
                    tooltip={this.props.titleTooltip}
                    filterText={this.props.filterText}
                    node={this.props.node}
                    currentLocale={this.props.currentLocale}
                    onClick={this.props.onSelect}
                    onContextMenu={this.props.onContextMenu}
                />

                {this.props.node.loading ? <div className="toc-inline-loader"></div> : this.renderToolsLegend(isEmpty)}
                {this.props.indicators ? this.renderIndicators() : null}
                {this.props.activatePreviewTool && this.renderSettings()}
            </div>
        );
        return (
            <>
                <Node className={(this.props.isDragging || this.props.node.placeholder ? "is-placeholder " : "") + 'toc-default-layer ' + hide + selected + error + warning + (this.props.activatePreviewTool && ' preview')} style={this.props.style} type="layer" {...other}>
                    {!isDummy && this.props.activatePreviewTool && this.renderThumbnailSelector()}
                    {!isDummy && this.props.activatePreviewTool && this.renderThumb(this.props.node.thumbURL, this.props.node)}
                    {other.isDraggable && !isDummy ? this.props.connectDragPreview(head) : head}
                    {isDummy || !this.props.activateOpacityTool || this.props.node.expanded || !this.props.node.visibility || this.props.node.loadingError === 'Error' || this.props.activatePreviewTool ? null : this.renderOpacitySlider(this.props.hideOpacityTooltip)}
                    {isDummy || this.props.activatePreviewTool || isEmpty ? null : this.renderCollapsible()}
                    {!isDummy && this.state.openSettings && this.props.activatePreviewTool &&
                    <Settings
                        hideOpacityTooltip={this.props.hideOpacityTooltip}
                        activateOpacityTool={this.props.activateOpacityTool}
                        node={this.props.node}
                        onUpdateNode={this.props.onUpdateNode}
                        visibilityCheckType={this.props.visibilityCheckType}
                        propertiesChangeHandler={this.props.propertiesChangeHandler}
                        toolbar={this.props.toolbar}
                        currentLocale={this.props.currentLocale}
                        selectedNodes={this.props.selectedNodes}
                    />}
                </Node>
                <SaveModal
                    show={this.state.openSaveThumbnail}
                    onClose={()=> {this.setState((state) => ({openSaveThumbnail: !state.openSaveThumbnail}));}}
                    onSave={this.props.onUpdateNode}
                    node={this.props.node}
                    onUpdateLinkedResource={(e) => {this.setState({newThumbnail: e});}}
                    resourceThumbnail={this.state.newThumbnail}/>
            </>
        );
    }

    render() {
        let {children, propertiesChangeHandler, onToggle, connectDragSource, connectDropTarget, ...other } = this.props;
        const hide = !this.props.node.visibility || this.props.node.invalid ? ' visibility' : '';
        const selected = this.props.selectedNodes.filter((s) => s === this.props.node.id).length > 0 ? ' selected' : '';
        const error = this.props.node.loadingError === 'Error' ? ' layer-error' : '';
        const warning = this.props.node.loadingError === 'Warning' ? ' layer-warning' : '';
        const grab = other.isDraggable ? <LayersTool key="grabTool" tooltip="toc.grabLayerIcon" className="toc-grab" ref="target" glyph="menu-hamburger"/> : <span className="toc-layer-tool toc-grab"/>;
        const isDummy = !!this.props.node.dummy;
        const filteredNode = !isDummy && this.filterLayers(this.props.node) ? this.renderNode(grab, hide, selected, error, warning, isDummy, other) : null;
        const tocListItem = (
            <div style={isDummy ? {opacity: 0, boxShadow: 'none'} : {}} className="toc-list-item">
                {!this.props.filterText || (this.props.filterText && isDummy) ? this.renderNode(grab, hide, selected, error, warning, isDummy, other) : filteredNode}
            </div>
        );
        if (other.node.showComponent !== false && !other.node.hide && this.props.filter(this.props.node)) {
            return connectDropTarget(other.isDraggable && !isDummy ? connectDragSource(tocListItem) : tocListItem);
        }
        return null;
    }

    filterLayers = (layer) => {
        const translation = isObject(layer.title) ? layer.title[this.props.currentLocale] || layer.title.default : layer.title;
        const title = translation || layer.name;
        return title.toLowerCase().indexOf(this.props.filterText.toLowerCase()) !== -1;
    };
}

module.exports = draggableComponent('LayerOrGroup', DefaultLayer);
