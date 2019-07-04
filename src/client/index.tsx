import { Material } from '../common/engine/rendering/Material';
import { Matrix4 } from '../common/engine/math/Matrix4';
import {
	CameraOrthographic,
	CameraPerspective,
} from '../common/engine/rendering/Camera';
import { Vector3 } from '../common/engine/math/Vector3';
import { Quaterion } from '../common/engine/math/Quaterion';
import { Mesh, PointMesh } from '../common/engine/rendering/Mesh';
import { Texture } from '../common/engine/rendering/Texture';
import { Debug } from '../common/engine/Debug';
import { Color } from '../common/engine/math/Color';

// Source: http://learningwebgl.com/blog/?p=28

const canvasEl = document.getElementById('canvas')! as HTMLCanvasElement;
const width = canvasEl.width;
const height = canvasEl.height;

const gl = canvasEl.getContext('webgl', {
	alpha: false,
	antialias: false,
	depth: true,
	stencil: false,
})!;

const material = new Material(
	gl,
	`
		attribute vec3 vertPosition;
		attribute vec2 vertUV1;

		uniform mat4 projectionMatrix;
		uniform mat4 viewMatrix;
		uniform mat4 worldMatrix;

		varying vec2 fragUV;

		void main(void) {
			fragUV = vertUV1;
			gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4(vertPosition, 1.0);
		}
	`,
	`
		precision mediump float;

		varying vec2 fragUV;
		uniform sampler2D sampler;

		void main(void) {
			gl_FragColor = vec4(texture2D(sampler, fragUV).xyz, 0.25);
		}
	`
);
material.twoSided = true;

const mesh = new Mesh(gl, {
	vertices: new Float32Array([
		1.0,
		1.0,
		0.0,
		-1.0,
		1.0,
		0.0,
		1.0,
		-1.0,
		0.0,
		-1.0,
		-1.0,
		0.0,
	]),
	indices: new Uint16Array([0, 1, 2, 2, 1, 3]),
	uvs: [new Float32Array([1, 0, 0, 0, 1, 1, 0, 1])],
	colors: [new Float32Array([1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1])],
});

const tex = new Texture(
	gl,
	document.getElementById('uvdebug')! as HTMLImageElement,
	gl.CLAMP_TO_EDGE,
	gl.LINEAR
);

const position = new Vector3(0, 0, 0);
const rotation = new Quaterion();
const view = new Matrix4();
const world = new Matrix4();
const camera = new CameraPerspective(40, width / height, 0.1, 100.0, 2);
const cameraPos = new Vector3(0, 0, -10);
// const camera = new CameraOrthographic(-250, 250, -250, 250, 0.1, 100, 1);

material.setUniform('worldMatrix', world.elements);
material.setUniform('viewMatrix', view.elements);
material.setUniform('projectionMatrix', camera.projectionMatrix.elements);
material.setUniform('sampler', tex);

Debug.setRenderingContext(gl);

let frameId = 0;
(window as any).step = function step() {
	++frameId;

	gl.viewport(0, 0, width, height);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.depthFunc(gl.LESS);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

	// Enable transparency
	gl.disable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);

	for (let i = 10; --i >= 0; ) {
		rotation.z = Math.sin(Math.max(0, frameId - i * 10) / 20);
		position.x = Math.sin(Math.max(0, frameId - i * 10) / 20);
		position.y = Math.cos(Math.max(0, frameId - i * 10) / 20);
		world.compose(
			position,
			rotation,
			Vector3.One
		);

		cameraPos.z = Math.sin(frameId / 10) - 20;
		view.compose(
			cameraPos,
			Quaterion.Identity,
			Vector3.One
		);
		// Use material set attribute & uniform
		material.bind();
		material.setUniform('worldMatrix', world.elements);
		material.setUniform('viewMatrix', view.elements);
		mesh.bind();
		mesh.draw();

		// Debug.drawPrimitivePoints(
		// 	[0 + Math.random(), -1 + Math.random() * 2, -1 + Math.random() * 2],
		// 	2,
		// 	{ ttl: 0.0, color: [Math.random(), Math.random(), Math.random(), 1] }
		// );
		// Debug.drawPrimitiveLine(
		// 	[
		// 		-1 + Math.random() * 1,
		// 		-1 + Math.random() * 2,
		// 		-1 + Math.random() * 2,
		// 		-1 + Math.random() * 1,
		// 		-1 + Math.random() * 2,
		// 		-1 + Math.random() * 2,
		// 	],
		// 	{
		// 		ttl: 0.0,
		// 		color: [Math.random(), Math.random(), Math.random(), 1],
		// 	}
		// );
	}

	Debug.draw(view, camera.projectionMatrix);
	Debug.update();
};
