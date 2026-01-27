<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

	// --- Props ---
	interface TerrainPoint {
		terrain: number;
		elevation: number;
		position: { x: number; y: number };
	}

	let { terrainData }: { terrainData: TerrainPoint[] } = $props();

	// --- Variables ---
	let container: HTMLDivElement;
	let renderer: THREE.WebGLRenderer;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let controls: OrbitControls;
	let animationId: number;

	// --- Configuration ---
	const GRID_WIDTH = 120;
	const GRID_HEIGHT = 120;
	const ELEVATION_SCALE = 1; // Increased to make the smooth hills visible
	const SMOOTHING_ITERATIONS = 3; // Higher = smoother, flatter hills

	// Color Palette
	const PALETTE: Record<number, THREE.Color> = {
		1: new THREE.Color(0x1e3a8a), // Blue-900 (deep navy blue)
		2: new THREE.Color(0x3b82f6), // Blue-500 (primary blue)
		3: new THREE.Color(0x10b981), // Emerald-500 (teal green)
		5: new THREE.Color(0x047857), // Emerald-700 (dark green)
		10: new THREE.Color(0xfcd34d), // Amber-300 (golden yellow)
		23: new THREE.Color(0x3b82f6), // Blue-500 (primary blue)
		27: new THREE.Color(0x4b5563), // Gray-600 (cool gray)
		88: new THREE.Color(0xf9fafb), // Gray-50 (near white)
		100: new THREE.Color(0x7f1d1d) // Red-900 (dark maroon)
	};
	const DEFAULT_COLOR = new THREE.Color(0xff00ff);

	onMount(() => {
		initThree();
		createSmoothedTerrain();
		animate();

		const resizeObserver = new ResizeObserver(() => {
			if (!container || !camera || !renderer) return;
			const width = container.clientWidth;
			const height = container.clientHeight;
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
		});
		resizeObserver.observe(container);

		return () => {
			cancelAnimationFrame(animationId);
			resizeObserver.disconnect();
			renderer.dispose();
			controls.dispose();
		};
	});

	function initThree() {
		const ZOOM_OUT_FACTOR = 1.6;
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x111111);

		const width = container.clientWidth;
		const height = container.clientHeight;

		// 1. Define the Map Center
		const centerX = GRID_WIDTH / 2;
		const centerZ = GRID_HEIGHT / 2;
		const center = new THREE.Vector3(centerX, 0, centerZ);

		// 2. Define your original preferred "Look" (Orientation)
		// This was your original setting: x:0, y:80, z:150
		const originalPos = new THREE.Vector3(0, 80, 150);

		// 3. Calculate new position based on Zoom Factor
		// This creates a vector from Center -> Camera, multiplies length, adds back to Center
		const direction = new THREE.Vector3().subVectors(originalPos, center);
		const newPos = new THREE.Vector3().addVectors(
			center,
			direction.multiplyScalar(ZOOM_OUT_FACTOR)
		);

		camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
		camera.position.copy(newPos);

		renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
		renderer.setSize(width, height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		container.appendChild(renderer.domElement);

		controls = new OrbitControls(camera, renderer.domElement);

		// 4. Ensure we orbit around the center of the map
		controls.target.copy(center);
		controls.update();

		controls.zoomSpeed = 0.5;

		// Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambientLight);
		const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
		dirLight.position.set(50, 100, 50);
		scene.add(dirLight);
	}
	// --- Laplacian Smoothing Algorithm ---
	// Averages a point's height with its neighbors to remove sharp steps
	function getSmoothedElevations(
		data: TerrainPoint[],
		width: number,
		height: number,
		iterations: number
	) {
		// 1. Extract raw elevations into a Float32Array
		let heights = new Float32Array(data.length);
		for (let i = 0; i < data.length; i++) heights[i] = data[i].elevation;

		// 2. Temporary buffer for calculations
		let newHeights = new Float32Array(data.length);

		// 3. Apply smoothing iterations
		for (let iter = 0; iter < iterations; iter++) {
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					const index = y * width + x;
					let sum = heights[index]; // Start with self
					let count = 1;

					// Check 4 neighbors (Up, Down, Left, Right)
					if (x > 0) {
						sum += heights[index - 1];
						count++;
					}
					if (x < width - 1) {
						sum += heights[index + 1];
						count++;
					}
					if (y > 0) {
						sum += heights[index - width];
						count++;
					}
					if (y < height - 1) {
						sum += heights[index + width];
						count++;
					}

					newHeights[index] = sum / count;
				}
			}
			// Swap buffers
			heights.set(newHeights);
		}
		return heights;
	}

	function createSmoothedTerrain() {
		if (!terrainData || terrainData.length === 0) return;

		// --- 1. Pre-calculate Smoothed Heights ---
		const smoothHeights = getSmoothedElevations(
			terrainData,
			GRID_WIDTH,
			GRID_HEIGHT,
			SMOOTHING_ITERATIONS
		);

		// --- 2. Generate Buffers ---
		const vertexCount = terrainData.length;
		const positions = new Float32Array(vertexCount * 3);
		const colors = new Float32Array(vertexCount * 3);

		for (let i = 0; i < vertexCount; i++) {
			const point = terrainData[i];
			const i3 = i * 3;

			// Use smoothed height
			positions[i3] = point.position.x;
			positions[i3 + 1] = smoothHeights[i] * ELEVATION_SCALE;
			positions[i3 + 2] = point.position.y;

			const c = PALETTE[point.terrain] || DEFAULT_COLOR;
			colors[i3] = c.r;
			colors[i3 + 1] = c.g;
			colors[i3 + 2] = c.b;
		}

		// --- 3. Generate Indices ---
		const indices: number[] = [];
		for (let y = 0; y < GRID_HEIGHT - 1; y++) {
			for (let x = 0; x < GRID_WIDTH - 1; x++) {
				const a = y * GRID_WIDTH + x;
				const b = y * GRID_WIDTH + (x + 1);
				const c = (y + 1) * GRID_WIDTH + x;
				const d = (y + 1) * GRID_WIDTH + (x + 1);
				indices.push(a, c, b);
				indices.push(b, c, d);
			}
		}

		// --- 4. Build Mesh ---
		const geometry = new THREE.BufferGeometry();
		geometry.setIndex(indices);
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

		// IMPORTANT: Compute vertex normals for smooth shading
		geometry.computeVertexNormals();

		const material = new THREE.MeshStandardMaterial({
			vertexColors: true,
			roughness: 1.0, // High roughness for terrain (less shiny)
			metalness: 0.0,
			flatShading: false, // DISABLED for smooth edges
			side: THREE.DoubleSide
		});

		const mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);
	}

	function animate() {
		animationId = requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera);
	}
</script>

<div bind:this={container} class="relative h-full w-full overflow-hidden rounded-lg bg-black">
	<div
		class="pointer-events-none absolute top-4 left-4 rounded bg-black/50 p-2 text-xs text-white/70"
	>
		Smoothing: {SMOOTHING_ITERATIONS} passes<br />
		Shading: Smooth (Vertex Normals)
	</div>
</div>

<style>
	div {
		display: block;
	}
</style>
