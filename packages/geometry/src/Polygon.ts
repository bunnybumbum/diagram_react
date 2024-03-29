import { Point } from './Point';
import _forEach from 'lodash/forEach';
import _map from 'lodash/map';
import { Matrix } from './Matrix';
import { boundingBoxFromPoints } from './toolkit';
import { Bounds, BoundsCorner } from './Bounds';

export class Polygon {
	protected points: Point[];

	constructor(points: Point[] = []) {
		this.points = points;
	}

	serialize() {
		return _map(this.points, (point) => {
			return [point.x, point.y];
		});
	}

	deserialize(data: any) {
		this.points = _map(data, (point) => {
			return new Point(point[0], point[1]);
		});
	}

	scale(x, y, origin: Point) {
		let matrix = Matrix.createScaleMatrix(x, y, origin);
		_forEach(this.points, (point) => {
			point.transform(matrix);
		});
	}

	transform(matrix: Matrix) {
		_forEach(this.points, (point) => {
			point.transform(matrix);
		});
	}

	setPoints(points: Point[]) {
		this.points = points;
	}

	getPoints(): Point[] {
		return this.points;
	}

	rotate(degrees: number) {
		this.transform(Matrix.createRotateMatrix(degrees / (180 / Math.PI), this.getOrigin()));
	}

	translate(offsetX: number, offsetY: number) {
		_forEach(this.points, (point) => {
			point.translate(offsetX, offsetY);
		});
	}

	doClone(ob: this) {
		this.points = _map(ob.points, (point) => {
			return point.clone();
		});
	}

	clone(): this {
		let ob = Object.create(this);
		ob.doClone(this);
		return ob;
	}

	getOrigin(): Point {
		if (this.points.length === 0) {
			return null;
		}
		let dimensions = boundingBoxFromPoints(this.points);
		return Point.middlePoint(dimensions[BoundsCorner.TOP_LEFT], dimensions[BoundsCorner.BOTTOM_RIGHT]);
	}

	getBoundingBox(): Bounds {
		return boundingBoxFromPoints(this.points);
	}
}
