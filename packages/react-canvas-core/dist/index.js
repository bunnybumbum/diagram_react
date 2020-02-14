!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["projectstorm/react-canvas-core"]=t():e["projectstorm/react-canvas-core"]=t()}(window,function(){return function(e){var t={};function i(s){if(t[s])return t[s].exports;var n=t[s]={i:s,l:!1,exports:{}};return e[s].call(n.exports,n,n.exports,i),n.l=!0,n.exports}return i.m=e,i.c=t,i.d=function(e,t,s){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(s,n,function(t){return e[t]}.bind(null,n));return s},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=30)}([function(e,t){e.exports=require("lodash")},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(4);!function(e){e.MOUSE_DOWN="mouse-down",e.MOUSE_UP="mouse-up",e.MOUSE_MOVE="mouse-move",e.MOUSE_WHEEL="mouse-wheel",e.KEY_DOWN="key-down",e.KEY_UP="key-up"}(t.InputType||(t.InputType={}));t.Action=class{constructor(e){this.options=e,this.id=s.Toolkit.UID()}setEngine(e){this.engine=e}}},function(e,t){e.exports=require("react")},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(4);t.BaseObserver=class{constructor(){this.listeners={}}fireEventInternal(e,t,i){this.iterateListeners(s=>{if(!e&&!i.firing)return!1;s[t]&&s[t](i)})}fireEvent(e,t){e=Object.assign({firing:!0,stopPropagation:()=>{e.firing=!1}},e),this.fireEventInternal(!0,"eventWillFire",Object.assign({},e,{function:t})),this.fireEventInternal(!1,t,e),this.fireEventInternal(!0,"eventDidFire",Object.assign({},e,{function:t}))}iterateListeners(e){for(let t in this.listeners)if(!1===e(this.listeners[t]))return}getListenerHandle(e){for(let t in this.listeners)if(this.listeners[t]===e)return{id:t,listner:e,deregister:()=>{delete this.listeners[t]}}}registerListener(e){const t=s.Toolkit.UID();return this.listeners[t]=e,{id:t,listner:e,deregister:()=>{delete this.listeners[t]}}}deregisterListener(e){if("object"==typeof e)return e.deregister(),!0;const t=this.getListenerHandle(e);return!!t&&(t.deregister(),!0)}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(32);class n{static UID(){return n.TESTING?(n.TESTING_UID++,`${n.TESTING_UID}`):"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{const t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)})}static closest(e,t){return document.body.closest?e.closest(t):s(e,t)}}n.TESTING=!1,n.TESTING_UID=0,t.Toolkit=n},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(6),n=i(1);t.AbstractDisplacementState=class extends s.State{constructor(e){super(e),this.registerAction(new n.Action({type:n.InputType.MOUSE_DOWN,fire:e=>{this.initialX=e.event.clientX,this.initialY=e.event.clientY;const t=this.engine.getRelativePoint(e.event.clientX,e.event.clientY);this.initialXRelative=t.x,this.initialYRelative=t.y}})),this.registerAction(new n.Action({type:n.InputType.MOUSE_MOVE,fire:e=>{const{event:t}=e;this.fireMouseMoved({displacementX:t.clientX-this.initialX,displacementY:t.clientY-this.initialY,virtualDisplacementX:(t.clientX-this.initialX)/(this.engine.getModel().getZoomLevel()/100),virtualDisplacementY:(t.clientY-this.initialY)/(this.engine.getModel().getZoomLevel()/100),event:t})}})),this.registerAction(new n.Action({type:n.InputType.MOUSE_UP,fire:e=>{this.eject()}}))}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(1),n=i(0);t.State=class{constructor(e){this.actions=[],this.keys=[],this.childStates=[],this.options=e}setEngine(e){this.engine=e}getOptions(){return this.options}eject(){this.engine.getStateMachine().popState()}transitionWithEvent(e,t){this.engine.getStateMachine().pushState(e),this.engine.getActionEventBus().fireAction(t)}registerAction(e){this.actions.push(e)}tryActivateParentState(e){return this.keys.length>0&&!this.isKeysFullfilled(e)&&(this.eject(),!0)}tryActivateChildState(e){const t=this.findStateToActivate(e);return!!t&&(this.engine.getStateMachine().pushState(t),!0)}findStateToActivate(e){for(let t of this.childStates)if(t.isKeysFullfilled(e))return t;return null}isKeysFullfilled(e){return n.intersection(this.keys,e).length===this.keys.length}activated(e){const t=this.engine.getActionEventBus().getKeys();if(!this.tryActivateParentState(t)&&!this.tryActivateChildState(t)){this.handler1=this.engine.getActionEventBus().registerAction(new s.Action({type:s.InputType.KEY_DOWN,fire:()=>{this.tryActivateChildState(this.engine.getActionEventBus().getKeys())}})),this.handler2=this.engine.getActionEventBus().registerAction(new s.Action({type:s.InputType.KEY_UP,fire:()=>{this.tryActivateParentState(this.engine.getActionEventBus().getKeys())}}));for(let e of this.actions)this.engine.getActionEventBus().registerAction(e)}}deactivated(e){this.handler1&&this.handler1(),this.handler2&&this.handler2();for(let e of this.actions)this.engine.getActionEventBus().deregisterAction(e)}}},function(e,t){e.exports=require("@projectstorm/geometry")},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),n=i(9);t.CanvasModel=class extends n.BaseEntity{constructor(e={}){super(Object.assign({zoom:100,gridSize:0,offsetX:0,offsetY:0},e)),this.layers=[]}getSelectionEntities(){return s.flatMap(this.layers,e=>e.getSelectionEntities())}getSelectedEntities(){return s.filter(this.getSelectionEntities(),e=>e.isSelected())}clearSelection(){s.forEach(this.getSelectedEntities(),e=>{e.setSelected(!1)})}getModels(){return s.flatMap(this.layers,e=>s.values(e.getModels()))}addLayer(e){e.setParent(this),e.registerListener({entityRemoved:e=>{}}),this.layers.push(e)}removeLayer(e){const t=this.layers.indexOf(e);return-1!==t&&(this.layers.splice(t,1),!0)}getLayers(){return this.layers}setGridSize(e=0){this.options.gridSize=e,this.fireEvent({size:e},"gridUpdated")}getGridPosition(e){return 0===this.options.gridSize?e:this.options.gridSize*Math.floor((e+this.options.gridSize/2)/this.options.gridSize)}deserializeModel(e,t){const i={},s={},n={},o={data:e,engine:t,registerModel:e=>{i[e.getID()]=e,n[e.getID()]&&n[e.getID()](e)},getModel:e=>i[e]?Promise.resolve(i[e]):(s[e]||(s[e]=new Promise(t=>{n[e]=t})),s[e])};this.deserialize(o)}deserialize(e){super.deserialize(e),this.options.offsetX=e.data.offsetX,this.options.offsetY=e.data.offsetY,this.options.zoom=e.data.zoom,this.options.gridSize=e.data.gridSize,s.forEach(e.data.layers,t=>{const i=e.engine.getFactoryForLayer(t.type).generateModel({initialConfig:t});i.deserialize(Object.assign({},e,{data:t})),this.addLayer(i)})}serialize(){return Object.assign({},super.serialize(),{offsetX:this.options.offsetX,offsetY:this.options.offsetY,zoom:this.options.zoom,gridSize:this.options.gridSize,layers:s.map(this.layers,e=>e.serialize())})}setZoomLevel(e){this.options.zoom=e,this.fireEvent({zoom:e},"zoomUpdated")}setOffset(e,t){this.options.offsetX=e,this.options.offsetY=t,this.fireEvent({offsetX:e,offsetY:t},"offsetUpdated")}setOffsetX(e){this.setOffset(e,this.options.offsetY)}setOffsetY(e){this.setOffset(this.options.offsetX,e)}getOffsetY(){return this.options.offsetY}getOffsetX(){return this.options.offsetX}getZoomLevel(){return this.options.zoom}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(4),n=i(0),o=i(3);t.BaseEntity=class extends o.BaseObserver{constructor(e={}){super(),this.options=Object.assign({id:s.Toolkit.UID()},e)}getOptions(){return this.options}getID(){return this.options.id}doClone(e={},t){}clone(e={}){if(e[this.options.id])return e[this.options.id];let t=n.cloneDeep(this);return t.options=Object.assign({},this.options,{id:s.Toolkit.UID()}),t.clearListeners(),e[this.options.id]=t,this.doClone(e,t),t}clearListeners(){this.listeners={}}deserialize(e){this.options.id=e.data.id,this.options.locked=e.data.locked}serialize(){return{id:this.options.id,locked:this.options.locked}}fireEvent(e,t){super.fireEvent(Object.assign({entity:this},e),t)}isLocked(){return this.options.locked}setLocked(e=!0){this.options.locked=e,this.fireEvent({locked:e},"lockChanged")}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(9),n=i(8);class o extends s.BaseEntity{constructor(e){super(e)}performanceTune(){return!0}getParentCanvasModel(){return this.parent?this.parent instanceof n.CanvasModel?this.parent:this.parent instanceof o?this.parent.getParentCanvasModel():null:null}getParent(){return this.parent}setParent(e){this.parent=e}getSelectionEntities(){return[this]}serialize(){return Object.assign({},super.serialize(),{type:this.options.type,selected:this.options.selected,extras:this.options.extras})}deserialize(e){super.deserialize(e),this.options.extras=e.data.extras,this.options.selected=e.data.selected}getType(){return this.options.type}isSelected(){return this.options.selected}isLocked(){return!!super.isLocked()||!!this.parent&&this.parent.isLocked()}setSelected(e=!0){this.options.selected!==e&&(this.options.selected=e,this.fireEvent({isSelected:e},"selectionChanged"))}remove(){this.fireEvent({},"entityRemoved")}}t.BaseModel=o},function(e,t){e.exports=require("@emotion/styled")},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(24);t.SelectionLayerModel=class extends s.LayerModel{constructor(){super({transformed:!1,isSvg:!1,type:"selection"})}setBox(e){this.box=e}getChildModelFactoryBank(){return null}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(3),n=i(0);t.FactoryBank=class extends s.BaseObserver{constructor(){super(),this.factories={}}getFactories(){return n.values(this.factories)}clearFactories(){for(let e in this.factories)this.deregisterFactory(e)}getFactory(e){if(!this.factories[e])throw new Error(`Cannot find factory with type [${e}]`);return this.factories[e]}registerFactory(e){e.setFactoryBank(this),this.factories[e.getType()]=e,this.fireEvent({factory:e},"factoryAdded")}deregisterFactory(e){const t=this.factories[e];t.setFactoryBank(null),delete this.factories[e],this.fireEvent({factory:t},"factoryRemoved")}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(1),n=i(0);t.ActionEventBus=class{constructor(e){this.actions={},this.engine=e,this.keys={}}getKeys(){return n.keys(this.keys)}registerAction(e){return e.setEngine(this.engine),this.actions[e.id]=e,()=>{this.deregisterAction(e)}}deregisterAction(e){e.setEngine(null),delete this.actions[e.id]}getActionsForType(e){return n.filter(this.actions,t=>t.options.type===e)}getModelForEvent(e){return e.model?e.model:this.engine.getMouseElement(e.event)}getActionsForEvent(e){const{event:t}=e;return"mousedown"===t.type?this.getActionsForType(s.InputType.MOUSE_DOWN):"mouseup"===t.type?this.getActionsForType(s.InputType.MOUSE_UP):"keydown"===t.type?(this.keys[t.key.toLowerCase()]=!0,this.getActionsForType(s.InputType.KEY_DOWN)):"keyup"===t.type?(delete this.keys[t.key.toLowerCase()],this.getActionsForType(s.InputType.KEY_UP)):"mousemove"===t.type?this.getActionsForType(s.InputType.MOUSE_MOVE):"wheel"===t.type?this.getActionsForType(s.InputType.MOUSE_WHEEL):[]}fireAction(e){const t=this.getActionsForEvent(e);for(let i of t)i.options.fire(e)}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(1);t.ZoomCanvasAction=class extends s.Action{constructor(e={}){super({type:s.InputType.MOUSE_WHEEL,fire:t=>{const{event:i}=t;for(let e of this.engine.getModel().getLayers())e.allowRepaint(!1);const s=this.engine.getModel();i.stopPropagation();const n=this.engine.getModel().getZoomLevel()/100;let o=e.inverseZoom?-i.deltaY:i.deltaY;i.ctrlKey&&o%1!=0?o/=3:o/=60,s.getZoomLevel()+o>10&&s.setZoomLevel(s.getZoomLevel()+o);const r=s.getZoomLevel()/100,a=i.currentTarget.getBoundingClientRect(),c=a.width,l=a.height,d=c*r-c*n,u=l*r-l*n,h=i.clientX-a.left,p=i.clientY-a.top,g=(h-s.getOffsetX())/n/c,f=(p-s.getOffsetY())/n/l;s.setOffset(s.getOffsetX()-d*g,s.getOffsetY()-u*f),this.engine.repaintCanvas();for(let e of this.engine.getModel().getLayers())e.allowRepaint(!0)}})}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(1),n=i(0);t.DeleteItemsAction=class extends s.Action{constructor(e={}){const t=e.keyCodes||[46,8],i=Object.assign({ctrlKey:!1,shiftKey:!1,altKey:!1,metaKey:!1},e.modifiers);super({type:s.InputType.KEY_DOWN,fire:e=>{const{keyCode:s,ctrlKey:o,shiftKey:r,altKey:a,metaKey:c}=e.event;-1!==t.indexOf(s)&&n.isEqual({ctrlKey:o,shiftKey:r,altKey:a,metaKey:c},i)&&(n.forEach(this.engine.getModel().getSelectedEntities(),e=>{e.isLocked()||e.remove()}),this.engine.repaintCanvas())}})}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),n=i(3);t.StateMachine=class extends n.BaseObserver{constructor(e){super(),this.engine=e,this.stateStack=[]}getCurrentState(){return this.currentState}pushState(e){this.stateStack.push(e),this.setState(e)}popState(){this.stateStack.pop(),this.setState(s.last(this.stateStack))}setState(e){e.setEngine(this.engine),this.currentState&&this.currentState.deactivated(e);const t=this.currentState;this.currentState=e,this.currentState&&(this.currentState.activated(t),this.fireEvent({newState:e},"stateChanged"))}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.AbstractFactory=class{constructor(e){this.type=e}setDiagramEngine(e){this.engine=e}setFactoryBank(e){this.bank=e}getType(){return this.type}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(18);t.AbstractModelFactory=class extends s.AbstractFactory{}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(19);t.AbstractReactFactory=class extends s.AbstractModelFactory{}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(10),n=i(7);t.BasePositionModel=class extends s.BaseModel{constructor(e){super(e),this.position=e.position||new n.Point(0,0)}setPosition(e,t){this.position="object"==typeof e?e:new n.Point(e,t),this.fireEvent({},"positionChanged")}getBoundingBox(){return new n.Rectangle(this.position,0,0)}deserialize(e){super.deserialize(e),this.position=new n.Point(e.data.x,e.data.y)}serialize(){return Object.assign({},super.serialize(),{x:this.position.x,y:this.position.y})}getPosition(){return this.position}getX(){return this.position.x}getY(){return this.position.y}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(2),n=i(11),o=i(34);var r;!function(e){const t=o.css`
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		position: absolute;
		pointer-events: none;
		transform-origin: 0 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	`;e.DivLayer=n.default.div`
		${t}
	`,e.SvgLayer=n.default.svg`
		${t}
	`}(r||(r={}));t.TransformLayerWidget=class extends s.Component{constructor(e){super(e),this.state={}}getTransform(){const e=this.props.layer.getParent();return`\n\t\t\ttranslate(\n\t\t\t\t${e.getOffsetX()}px,\n\t\t\t\t${e.getOffsetY()}px)\n\t\t\tscale(\n\t\t\t\t${e.getZoomLevel()/100}\n\t\t\t)\n  \t`}getTransformStyle(){return this.props.layer.getOptions().transformed?{transform:this.getTransform()}:{}}render(){return this.props.layer.getOptions().isSvg?s.createElement(r.SvgLayer,{style:this.getTransformStyle()},this.props.children):s.createElement(r.DivLayer,{style:this.getTransformStyle()},this.props.children)}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(2);t.SmartLayerWidget=class extends s.Component{shouldComponentUpdate(){return this.props.layer.isRepaintEnabled()}render(){return this.props.engine.getFactoryForLayer(this.props.layer).generateReactWidget({model:this.props.layer})}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(10),n=i(0);t.LayerModel=class extends s.BaseModel{constructor(e={}){super(e),this.models={},this.repaintEnabled=!0}deserialize(e){super.deserialize(e),this.options.isSvg=!!e.data.isSvg,this.options.transformed=!!e.data.transformed,n.forEach(e.data.models,t=>{const i=this.getChildModelFactoryBank(e.engine).getFactory(t.type).generateModel({initialConfig:t});i.deserialize(Object.assign({},e,{data:t})),this.addModel(i)})}serialize(){return Object.assign({},super.serialize(),{isSvg:this.options.isSvg,transformed:this.options.transformed,models:n.mapValues(this.models,e=>e.serialize())})}isRepaintEnabled(){return this.repaintEnabled}allowRepaint(e=!0){this.repaintEnabled=e}remove(){this.parent&&this.parent.removeLayer(this),super.remove()}addModel(e){e.setParent(this),this.models[e.getID()]=e}getSelectionEntities(){return n.flatMap(this.models,e=>e.getSelectionEntities())}getModels(){return this.models}getModel(e){return this.models[e]}removeModel(e){const t="string"==typeof e?e:e.getID();return!!this.models[t]&&(delete this.models[t],!0)}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(2),n=i(11);var o;!function(e){e.Container=n.default.div`
		position: absolute;
		background-color: rgba(0, 192, 255, 0.2);
		border: solid 2px rgb(0, 192, 255);
	`}(o||(o={}));t.SelectionBoxWidget=class extends s.Component{render(){const{rect:e}=this.props;return s.createElement(o.Container,{style:{top:e.top,left:e.left,width:e.width,height:e.height}})}}},function(e,t,i){"use strict";var s=this&&this.__awaiter||function(e,t,i,s){return new(i||(i=Promise))(function(n,o){function r(e){try{c(s.next(e))}catch(e){o(e)}}function a(e){try{c(s.throw(e))}catch(e){o(e)}}function c(e){e.done?n(e.value):new i(function(t){t(e.value)}).then(r,a)}c((s=s.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});const n=i(5);t.DragCanvasState=class extends n.AbstractDisplacementState{constructor(){super({name:"drag-canvas"})}activated(e){const t=Object.create(null,{activated:{get:()=>super.activated}});return s(this,void 0,void 0,function*(){t.activated.call(this,e),this.engine.getModel().clearSelection(),yield this.engine.repaintCanvas(!0);for(let e of this.engine.getModel().getLayers())e.allowRepaint(!1);this.initialCanvasX=this.engine.getModel().getOffsetX(),this.initialCanvasY=this.engine.getModel().getOffsetY()})}deactivated(e){super.deactivated(e);for(let e of this.engine.getModel().getLayers())e.allowRepaint(!0)}fireMouseMoved(e){this.engine.getModel().setOffset(this.initialCanvasX+e.displacementX,this.initialCanvasY+e.displacementY),this.engine.repaintCanvas()}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(6),n=i(1),o=i(28);t.SelectingState=class extends s.State{constructor(){super({name:"selecting"}),this.keys=["shift"],this.registerAction(new n.Action({type:n.InputType.MOUSE_DOWN,fire:e=>{const t=this.engine.getActionEventBus().getModelForEvent(e);t?(t.setSelected(!0),this.engine.repaintCanvas()):this.transitionWithEvent(new o.SelectionBoxState,e)}}))}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(5),n=i(12),o=i(7);t.SelectionBoxState=class extends s.AbstractDisplacementState{constructor(){super({name:"selection-box"})}activated(e){super.activated(e),this.layer=new n.SelectionLayerModel,this.engine.getModel().addLayer(this.layer)}deactivated(e){super.deactivated(e),this.layer.remove(),this.engine.repaintCanvas()}getBoxDimensions(e){const t=this.engine.getRelativePoint(e.event.clientX,e.event.clientY);return{left:t.x>this.initialXRelative?this.initialXRelative:t.x,top:t.y>this.initialYRelative?this.initialYRelative:t.y,width:Math.abs(t.x-this.initialXRelative),height:Math.abs(t.y-this.initialYRelative),right:t.x<this.initialXRelative?this.initialXRelative:t.x,bottom:t.y<this.initialYRelative?this.initialYRelative:t.y}}fireMouseMoved(e){this.layer.setBox(this.getBoxDimensions(e));const t=this.engine.getRelativeMousePoint({clientX:this.initialX,clientY:this.initialY});e.virtualDisplacementX<0&&(t.x-=Math.abs(e.virtualDisplacementX)),e.virtualDisplacementY<0&&(t.y-=Math.abs(e.virtualDisplacementY));const i=new o.Rectangle(t,Math.abs(e.virtualDisplacementX),Math.abs(e.virtualDisplacementY));for(let e of this.engine.getModel().getSelectionEntities())if(e.getBoundingBox){const t=e.getBoundingBox();i.containsPoint(t.getTopLeft())&&i.containsPoint(t.getBottomRight())?e.setSelected(!0):e.setSelected(!1)}this.engine.repaintCanvas()}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(5),n=i(1),o=i(21);t.MoveItemsState=class extends s.AbstractDisplacementState{constructor(){super({name:"move-items"}),this.registerAction(new n.Action({type:n.InputType.MOUSE_DOWN,fire:e=>{const t=this.engine.getActionEventBus().getModelForEvent(e);t.isSelected()||this.engine.getModel().clearSelection(),t.setSelected(!0),this.engine.repaintCanvas()}}))}activated(e){super.activated(e),this.initialPositions={}}fireMouseMoved(e){const t=this.engine.getModel().getSelectedEntities(),i=this.engine.getModel();for(let s of t)if(s instanceof o.BasePositionModel){if(s.isLocked())continue;this.initialPositions[s.getID()]||(this.initialPositions[s.getID()]={point:s.getPosition(),item:s});const t=this.initialPositions[s.getID()].point;s.setPosition(i.getGridPosition(t.x+e.virtualDisplacementX),i.getGridPosition(t.y+e.virtualDisplacementY))}this.engine.repaintCanvas()}}},function(e,t,i){"use strict";function s(e){for(var i in e)t.hasOwnProperty(i)||(t[i]=e[i])}Object.defineProperty(t,"__esModule",{value:!0}),s(i(31)),s(i(4)),s(i(8)),s(i(18)),s(i(19)),s(i(20)),s(i(3)),s(i(13)),s(i(1)),s(i(14)),s(i(9)),s(i(10)),s(i(21)),s(i(8)),s(i(33)),s(i(24)),s(i(22)),s(i(23)),s(i(35)),s(i(25)),s(i(12)),s(i(36)),s(i(5)),s(i(6)),s(i(17)),s(i(37)),s(i(26)),s(i(27)),s(i(28)),s(i(29)),s(i(16)),s(i(15))},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),n=i(13),o=i(3),r=i(7),a=i(14),c=i(15),l=i(16),d=i(17);t.CanvasEngine=class extends o.BaseObserver{constructor(e={}){super(),this.model=null,this.eventBus=new a.ActionEventBus(this),this.stateMachine=new d.StateMachine(this),this.layerFactories=new n.FactoryBank,this.registerFactoryBank(this.layerFactories),this.options=Object.assign({registerDefaultDeleteItemsAction:!0,registerDefaultZoomCanvasAction:!0,repaintDebounceMs:0},e),!0===this.options.registerDefaultZoomCanvasAction&&this.eventBus.registerAction(new c.ZoomCanvasAction),!0===this.options.registerDefaultDeleteItemsAction&&this.eventBus.registerAction(new l.DeleteItemsAction)}getStateMachine(){return this.stateMachine}getRelativeMousePoint(e){const t=this.getRelativePoint(e.clientX,e.clientY);return new r.Point((t.x-this.model.getOffsetX())/(this.model.getZoomLevel()/100),(t.y-this.model.getOffsetY())/(this.model.getZoomLevel()/100))}getRelativePoint(e,t){const i=this.canvas.getBoundingClientRect();return new r.Point(e-i.left,t-i.top)}registerFactoryBank(e){e.registerListener({factoryAdded:e=>{e.factory.setDiagramEngine(this)},factoryRemoved:e=>{e.factory.setDiagramEngine(null)}})}getActionEventBus(){return this.eventBus}getLayerFactories(){return this.layerFactories}getFactoryForLayer(e){return"string"==typeof e?this.layerFactories.getFactory(e):this.layerFactories.getFactory(e.getType())}setModel(e){this.model=e,this.canvas&&requestAnimationFrame(()=>{this.repaintCanvas()})}getModel(){return this.model}repaintCanvas(e){const{repaintDebounceMs:t}=this.options,i=()=>{this.iterateListeners(e=>{e.repaintCanvas&&e.repaintCanvas()})};let n=i;if(t>0&&(n=s.debounce(i,t)),e)return new Promise(e=>{const t=this.registerListener({rendered:()=>{e(),t.deregister()}});n()});n()}setCanvas(e){this.canvas!==e&&(this.canvas=e,e&&this.fireEvent({},"canvasReady"))}getCanvas(){return this.canvas}getMouseElement(e){return null}zoomToFit(){const e=this.canvas.clientWidth/this.canvas.scrollWidth,t=this.canvas.clientHeight/this.canvas.scrollHeight,i=e<t?e:t;this.model.setZoomLevel(this.model.getZoomLevel()*i),this.model.setOffset(0,0),this.repaintCanvas()}}},function(e,t){e.exports=require("closest")},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(2),n=i(22),o=i(11),r=i(23);var a;!function(e){e.Canvas=o.default.div`
		position: relative;
		cursor: move;
		overflow: hidden;
	`}(a||(a={}));t.CanvasWidget=class extends s.Component{constructor(e){super(e),this.ref=s.createRef(),this.state={action:null,diagramEngineListener:null}}componentWillUnmount(){this.props.engine.deregisterListener(this.canvasListener),this.props.engine.setCanvas(null),document.removeEventListener("keyup",this.keyUp),document.removeEventListener("keydown",this.keyDown)}registerCanvas(){this.props.engine.setCanvas(this.ref.current),this.props.engine.iterateListeners(e=>{e.rendered&&e.rendered()})}componentDidUpdate(){this.registerCanvas()}componentDidMount(){this.canvasListener=this.props.engine.registerListener({repaintCanvas:()=>{this.forceUpdate()}}),this.keyDown=e=>{this.props.engine.getActionEventBus().fireAction({event:e})},this.keyUp=e=>{this.props.engine.getActionEventBus().fireAction({event:e})},document.addEventListener("keyup",this.keyUp),document.addEventListener("keydown",this.keyDown),this.registerCanvas()}render(){const e=this.props.engine.getModel();return s.createElement(a.Canvas,{className:this.props.className,ref:this.ref,onWheel:e=>{this.props.engine.getActionEventBus().fireAction({event:e})},onMouseDown:e=>{this.props.engine.getActionEventBus().fireAction({event:e})},onMouseUp:e=>{this.props.engine.getActionEventBus().fireAction({event:e})},onMouseMove:e=>{this.props.engine.getActionEventBus().fireAction({event:e})}},e.getLayers().map(e=>s.createElement(n.TransformLayerWidget,{layer:e,key:e.getID()},s.createElement(r.SmartLayerWidget,{layer:e,engine:this.props.engine,key:e.getID()}))))}}},function(e,t){e.exports=require("@emotion/core")},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(2),n=i(20),o=i(12),r=i(25);t.SelectionBoxLayerFactory=class extends n.AbstractReactFactory{constructor(){super("selection")}generateModel(e){return new o.SelectionLayerModel}generateReactWidget(e){return s.createElement(r.SelectionBoxWidget,{rect:e.model.box})}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(2),n=i(0);t.PeformanceWidget=class extends s.Component{shouldComponentUpdate(e,t,i){return!this.props.model.performanceTune()||this.props.model!==e.model||!n.isEqual(this.props.serialized,e.serialized)}render(){return this.props.children()}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(6),n=i(1),o=i(26),r=i(27),a=i(29);t.DefaultState=class extends s.State{constructor(){super({name:"default"}),this.childStates=[new r.SelectingState],this.registerAction(new n.Action({type:n.InputType.MOUSE_DOWN,fire:e=>{this.engine.getActionEventBus().getModelForEvent(e)?this.transitionWithEvent(new a.MoveItemsState,e):this.transitionWithEvent(new o.DragCanvasState,e)}}))}}}])});