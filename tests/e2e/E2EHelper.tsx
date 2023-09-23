import {ElementHandle, Page} from "puppeteer";
import {NodeModel} from "../../src/models/NodeModel";
import {LinkModel} from "../../src/models/LinkModel";

export class E2EElement{
	page: Page;
	element: ElementHandle;
	id: string;

	constructor(page: Page, element: ElementHandle, id: string) {
		this.page = page;
		this.element = element;
		this.id = id;
	}
}

export class E2ENode extends E2EElement{

	async port(id: string): Promise<E2EPort>{
		return new E2EPort(this.page, await this.element.$('div[data-name="'+id+'"]'), id, this);
	}

	async model(): Promise<NodeModel>{
		return await this.page.evaluate((id) => {
			return window['diagram_instance'].getDiagramModel().getNode(id).serialize();
		}, this.id)
	}

}

export class E2EPort extends E2EElement{

	parent: E2ENode;

	constructor(page: Page, element: ElementHandle, id: string, parent: E2ENode) {
		super(page, element, id);
		this.parent = parent;
	}


	async link(port: E2EPort){
		let bounds = await this.element.boundingBox();

		// click on this port
		this.page.mouse.move(bounds.x, bounds.y);
		this.page.mouse.down();

		let bounds2 = await port.element.boundingBox();

		// drag to other port
		this.page.mouse.move(bounds2.x, bounds2.y);
		this.page.mouse.up();

		// get the parent to get the link
		await this.parent.model();
	}

}

export class E2ELink extends E2EElement{

	async model(): Promise<LinkModel>{
		return await this.page.evaluate((id) => {
			return window['diagram_instance'].getDiagramModel().getLink(id).serialize();
		}, this.id)
	}

	async select(): Promise<any>{
		let point = await this.page.evaluate((id) => {
			let path = (document.querySelector('path[data-linkid="' + id + '"]') as SVGPathElement);
			let point = path.getPointAtLength(path.getTotalLength()/2);
			return {
				x: point.x,
				y: point.y
			}
		}, this.id);
		await this.page.keyboard.down('Shift');
		await this.page.mouse.move(point.x, point.y);
		await this.page.mouse.down();
		await this.page.keyboard.up('Shift');
	}
}


export class E2EHelper {

	page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async link(id): Promise<E2ELink> {
		let selector = await this.page.waitForSelector('path[data-linkid="' + id + '"]');
		return new E2ELink(this.page, selector, id);
	}

	async node(id): Promise<E2ENode> {
		let selector = await this.page.waitForSelector('div[data-nodeid="' + id + '"]');
		return new E2ENode(this.page, selector, id);
	}

}