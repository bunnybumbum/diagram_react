import {
	DiagramEngine,
	DefaultNodeFactory,
	DefaultLinkFactory,
	DiagramModel,
	DefaultNodeModel,
	LinkModel,
	DefaultPortModel,
	DiagramWidget,
	DefaultNodeInstanceFactory,
	DefaultPortInstanceFactory,
	LinkInstanceFactory
} from "../../src/main";
import {distributeElements} from './dagre-utils';
import * as React from "react";


function createNode(name) {
	return new DefaultNodeModel(name, "rgb(0,192,255)");
}

let count = 0;

function connectNodes(nodeFrom, nodeTo) {
	count++;
	const portOut = nodeFrom.addPort(new DefaultPortModel(true, `${nodeFrom.name}-out-${count}`, "Out"));
	const portTo = nodeTo.addPort(new DefaultPortModel(false, `${nodeFrom.name}-to-${count}`, "IN"));
	let link = new LinkModel();
	link.setSourcePort(portOut);
	link.setTargetPort(portTo);
	return link;
}

/**
 * Tests auto distribution
 */
class Demo8Widget extends React.Component<any, any> {

	constructor(props) {
		super(props);
		this.state = {};
	}


	render() {
		const {engine} = this.props;

		return (
			<div>
				<DiagramWidget diagramEngine={engine}/>
			</div>
		);
	}
}
function getDistributedModel(engine, model){
	const serialized = model.serializeDiagram();
	const distributedSerializedDiagram = distributeElements(serialized);
	//deserialize the model
	var model2 = new DiagramModel();
	model2.deSerializeDiagram(distributedSerializedDiagram, engine);
	return model2
}
export default () => {
	//1) setup the diagram engine
	let engine = new DiagramEngine();
	engine.registerNodeFactory(new DefaultNodeFactory());
	engine.registerLinkFactory(new DefaultLinkFactory());


	//2) setup the diagram model
	let model = new DiagramModel();

	//3) create a default nodes

	let nodesFrom = [];
	let nodesTo = [];

	nodesFrom.push(createNode('from-1'));
	nodesFrom.push(createNode('from-2'));
	nodesFrom.push(createNode('from-3'));

	nodesTo.push(createNode('to-1'));
	nodesTo.push(createNode('to-2'));
	nodesTo.push(createNode('to-3'));
	//4) link nodes together
	let links = nodesFrom.map((node, index) => {
		return connectNodes(node, nodesTo[index]);
	});
	links.push(connectNodes(nodesFrom[0], nodesTo[1]));
	links.push(connectNodes(nodesTo[0], nodesFrom[1]));
	links.push(connectNodes(nodesFrom[1], nodesTo[2]));
	nodesFrom.forEach((node, index) => {
		node.x = index * 70;
		model.addNode(node);
	});
	nodesTo.forEach((node, index) => {
		node.x = index * 70;
		node.y = 100;
		model.addNode(node);
	});
	links.forEach((link) => {
		model.addLink(link);
	});
	//5) load model into engine
	//we need this to help the system know what models to create form the JSON
	engine.registerInstanceFactory(new DefaultNodeInstanceFactory());
	engine.registerInstanceFactory(new DefaultPortInstanceFactory());
	engine.registerInstanceFactory(new LinkInstanceFactory());
	let model2 = getDistributedModel(engine, model);
	engine.setDiagramModel(model2);

	return <Demo8Widget engine={engine}/>
};
