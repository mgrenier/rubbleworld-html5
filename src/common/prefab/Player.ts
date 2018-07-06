import { Transform } from '../engine/behaviours/Transform';
import { Behaviour, Entity } from '../engine/Scene';
import { Gamepad } from '../engine/Gamepad';
import { Vector3 } from '../engine/math/Vector3';
import { Quaterion } from '../engine/math/Quaterion';

export function PlayerPrefab (
	position = new Vector3(),
	rotation = new Quaterion()
) {
	return new Entity([new Transform(position, Vector3.One, rotation), new PlayerBehaviour(), new PlayerGun()]);
}

export class PlayerBehaviour extends Behaviour {
	private transform: Transform | undefined;

	onStart() {
		this.transform = this.getBehaviour(Transform);
	}

	*onUpdate() {
		const input = new Vector3();
		
		if (Gamepad.gamepad[0].getButton('right')) {
			this.transform!.getRightVector(v0);
			input.add(v0.multiplyScalar(2));
		}
		if (Gamepad.gamepad[0].getButton('left')) {
			this.transform!.getRightVector(v0);
			input.add(v0.multiplyScalar(-2));
		}
		if (Gamepad.gamepad[0].getButton('up')) {
			this.transform!.getUpVector(v0);
			input.add(v0.multiplyScalar(2));
		}

		// Move transform using user input
		this.transform!.localPosition.add(input);

		// yield* this.runAnimation('run', 3);
	}

	*runAnimation(name: string, frames: number) {
		for (let i = 0; i < frames; ++i) {
			console.log(`run anim ${name}@${i}`);
			yield;
		}
	}
}

export class PlayerGun extends Behaviour {
	onUpdate() {
		if (Gamepad.gamepad[0].getButtonDown('fire')) {
			console.log('Fire !');
		}
	}
}

const v0 = new Vector3();