import 'mocha';
import { expect } from 'chai';
import { Scene, Entity, Component } from './Scene';

describe('Scene', () => {
	it('update iterator', async () => {
		const A = new DummyComponent();
		const scene = new Scene().addChild(new Entity('A', A));

		let stepper = scene.update({
			time: 0,
			deltaTime: 0,
			frameCount: 0,
			timeScale: 1,
		});

		// onStart
		expect(stepper.next().done).to.equal(false);
		expect(A.mountCount).to.equal(1);
		expect(A.updateCount).to.equal(0);

		// onUpdate
		expect(stepper.next().done).to.equal(false);
		expect(A.mountCount).to.equal(1);
		expect(A.updateCount).to.equal(1);

		expect(stepper.next().done).to.equal(true);
	});

	it('component entity order', async () => {
		const A = new DummyComponent();
		const B = new DummyComponent();
		const C = new DummyComponent();

		const scene = new Scene().addChild(new Entity('A', A).addChild(new Entity('B', B))).addChild(new Entity('C', C));

		let stepper = scene.update({
			time: 0,
			deltaTime: 0,
			frameCount: 0,
			timeScale: 1,
		});

		expect(stepper.next().done).to.equal(false);
		expect(A.mountCount).to.equal(1);
		expect(A.updateCount).to.equal(0);
		expect(B.mountCount).to.equal(0);
		expect(B.updateCount).to.equal(0);
		expect(C.mountCount).to.equal(0);
		expect(C.updateCount).to.equal(0);
		expect(stepper.next().done).to.equal(false);
		expect(A.mountCount).to.equal(1);
		expect(A.updateCount).to.equal(0);
		expect(B.mountCount).to.equal(1);
		expect(B.updateCount).to.equal(0);
		expect(C.mountCount).to.equal(0);
		expect(C.updateCount).to.equal(0);
		expect(stepper.next().done).to.equal(false);
		expect(A.mountCount).to.equal(1);
		expect(A.updateCount).to.equal(0);
		expect(B.mountCount).to.equal(1);
		expect(B.updateCount).to.equal(0);
		expect(C.mountCount).to.equal(1);
		expect(C.updateCount).to.equal(0);
		expect(stepper.next().done).to.equal(false);
		expect(A.mountCount).to.equal(1);
		expect(A.updateCount).to.equal(1);
		expect(B.mountCount).to.equal(1);
		expect(B.updateCount).to.equal(0);
		expect(C.mountCount).to.equal(1);
		expect(C.updateCount).to.equal(0);
		expect(stepper.next().done).to.equal(false);
		expect(A.mountCount).to.equal(1);
		expect(A.updateCount).to.equal(1);
		expect(B.mountCount).to.equal(1);
		expect(B.updateCount).to.equal(1);
		expect(C.mountCount).to.equal(1);
		expect(C.updateCount).to.equal(0);
		expect(stepper.next().done).to.equal(false);
		expect(A.mountCount).to.equal(1);
		expect(A.updateCount).to.equal(1);
		expect(B.mountCount).to.equal(1);
		expect(B.updateCount).to.equal(1);
		expect(C.mountCount).to.equal(1);
		expect(C.updateCount).to.equal(1);

		expect(stepper.next().done).to.equal(true);
	});

	it('component execution order', async () => {
		const A = new DummyComponent();
		const B = new PriorityComponent();

		const scene = new Scene().addChild(new Entity('A', A)).addChild(new Entity('B', B));

		let stepper = scene.update({
			time: 0,
			deltaTime: 0,
			frameCount: 0,
			timeScale: 1,
		});

		expect(stepper.next().done).to.equal(false);
		expect(A.mountCount).to.equal(1);
		expect(A.updateCount).to.equal(0);
		expect(B.mountCount).to.equal(0);
		expect(B.updateCount).to.equal(0);
		expect(stepper.next().done).to.equal(false);
		expect(A.mountCount).to.equal(1);
		expect(A.updateCount).to.equal(0);
		expect(B.mountCount).to.equal(1);
		expect(B.updateCount).to.equal(0);
		expect(stepper.next().done).to.equal(false);
		expect(A.mountCount).to.equal(1);
		expect(A.updateCount).to.equal(0);
		expect(B.mountCount).to.equal(1);
		expect(B.updateCount).to.equal(1);
		expect(stepper.next().done).to.equal(false);
		expect(A.mountCount).to.equal(1);
		expect(A.updateCount).to.equal(1);
		expect(B.mountCount).to.equal(1);
		expect(B.updateCount).to.equal(1);
		expect(stepper.next().done).to.equal(true);
	});
});

class DummyComponent extends Component {
	mountCount = 0;
	updateCount = 0;

	didMount() {
		this.mountCount += 1;
	}

	update() {
		this.updateCount += 1;
	}
}

class PriorityComponent extends DummyComponent {
	public static executionOrder = -10;
}
