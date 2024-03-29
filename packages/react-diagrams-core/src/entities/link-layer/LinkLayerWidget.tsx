import * as React from 'react';
import styled from '@emotion/styled';
import _map from 'lodash/map';
import { LinkWidget } from '../link/LinkWidget';
import { LinkLayerModel } from './LinkLayerModel';
import { DiagramEngine } from '../../DiagramEngine';

export interface LinkLayerWidgetProps {
	layer: LinkLayerModel;
	engine: DiagramEngine;
}

namespace S {
	export const Container = styled.div``;
}

export class LinkLayerWidget extends React.Component<LinkLayerWidgetProps> {
	render() {
		return (
			<>
				{
					//only perform these actions when we have a diagram
					_map(this.props.layer.getLinks(), (link) => {
						return <LinkWidget key={link.getID()} link={link} diagramEngine={this.props.engine} />;
					})
				}
			</>
		);
	}
}
