(() => {
	'use strict';

	const PX_PER_SEC = 25;
	const MASTER_SEQUENCE_DURATION = 60;
	const SECOND_MAJOR_STEP = 5;
	const SECOND_MINOR_STEP = 1;

    const TRACKS = [
		{ label: 'Video Track 1', kind: 'video' },
		{ label: 'Audio Track 1', kind: 'audio' },
	];

    const defaultTransformRecipe = {
		rotate: 0,
		framing: 'contain',
		speed: 1
	};

	let trackSequence = [
		{ id: 'video-track-1', type: 'video', clips: [] },
		{ id: 'audio-track-1', type: 'audio', clips: [] },
	];

	const CLIP_EDGE_BUFFER_PX = 15;
	const MEDIA_TIME_EPSILON = 0.03;

	const mediaRegistry = new Map();
	const clipTransformState = new Map();

	const state = {
		playheadTime: 0,
		isPlaying: false,
		timelineSpeed: 1,
		isDragging: false,
		activePointerId: null,
		interactionMode: null,
		activeTrackIndex: -1,
		activeClipId: null,
		activeTransformClipId: null,
		dragOffsetSeconds: 0,
		trimStartSeconds: 0,
		trimEndSeconds: 0,
		needsRender: true,
		contentWidth: 0,
		contentHeight: 0,
		dpr: 1,
		lastTickAt: 0,
	};

	let masterCanvas;
	let masterContext;
	let timelineCanvas;
	let timelineContext;
	let timelineWrap;
	let statusChip;
	let transportToggleButton;
	let mediaInput;
	let hiddenMediaBin;
	let resizeObserver;
	let rafId = 0;

function clamp(value, min, max) {
		return Math.min(max, Math.max(min, value));
	}

	// --- ADD THESE MISSING UTILITIES ---
	function normalizeRotation(rotation) {
		const normalized = ((rotation % 360) + 360) % 360;
		if (normalized === 90 || normalized === 180 || normalized === 270) {
			return normalized;
		}
		return 0;
	}

	function cloneDefaultTransformRecipe() {
		return { ...defaultTransformRecipe };
	}

	function secondsToPixels(seconds) {
		return seconds * PX_PER_SEC;
	}

	function pixelsToSeconds(pixels) {
		return pixels / PX_PER_SEC;
	}

	function formatTimestamp(totalSeconds) {
		const safeSeconds = Math.max(0, totalSeconds);
		const minutes = Math.floor(safeSeconds / 60);
		const seconds = Math.floor(safeSeconds % 60);
		const frames = Math.floor((safeSeconds % 1) * 30);
		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(frames).padStart(2, '0')}`;
	}

	function setStatus(msg) {
		if (statusChip) statusChip.textContent = msg;
	}

	function getClipTransformRecipe(clip) {
		if (!clip) {
			return cloneDefaultTransformRecipe();
		}

		if (!clipTransformState.has(clip.id)) {
			clipTransformState.set(clip.id, cloneDefaultTransformRecipe());
		}

		return clipTransformState.get(clip.id);
	}

	function setClipTransformRecipe(clip, nextRecipe) {
		if (!clip) {
			return cloneDefaultTransformRecipe();
		}

		const currentRecipe = getClipTransformRecipe(clip);
		const mergedRecipe = {
			...currentRecipe,
			...nextRecipe,
			rotate: normalizeRotation(nextRecipe.rotate ?? currentRecipe.rotate),
			brightness: clamp(nextRecipe.brightness ?? currentRecipe.brightness, -0.5, 0.5),
			contrast: clamp(nextRecipe.contrast ?? currentRecipe.contrast, 0.5, 1.5),
			saturation: clamp(nextRecipe.saturation ?? currentRecipe.saturation, 0, 2),
			framing: nextRecipe.framing === 'cover' ? 'cover' : 'contain',
		};

		clipTransformState.set(clip.id, mergedRecipe);
		state.activeTransformClipId = clip.id;
		return mergedRecipe;
	}

	function getEditableClip() {
		let selectedClip = null;

		if (state.activeTransformClipId) {
			for (const track of trackSequence) {
				selectedClip = track.clips.find((clip) => clip.id === state.activeTransformClipId) || null;
				if (selectedClip) {
					return selectedClip;
				}
			}
		}

		const activeVideoLayer = getActiveClipsAtTime(state.playheadTime).find((layer) => getMediaAssetForClip(layer.clip)?.type === 'video');
		if (activeVideoLayer) {
			state.activeTransformClipId = activeVideoLayer.clip.id;
			return activeVideoLayer.clip;
		}

		for (const track of trackSequence) {
			selectedClip = track.clips.find((clip) => getMediaAssetForClip(clip)?.type === 'video' || clip.fileBlobUrl) || null;
			if (selectedClip) {
				state.activeTransformClipId = selectedClip.id;
				return selectedClip;
			}
		}

		return null;
	}

	function setEditingClipFromTimeline(clipId) {
		state.activeTransformClipId = clipId;
		refreshTransformPanel();
	}

    function refreshTransformPanel() {
		const clip = getEditableClip();
		if (!clip) return;
		const recipe = getClipTransformRecipe(clip) || cloneDefaultTransformRecipe();

		const rotDisp = document.getElementById('rotationDisplay');
		if (rotDisp) rotDisp.textContent = `${recipe.rotate || 0}°`;
		
		const speedSelect = document.getElementById('timelineSpeed');
		if (speedSelect) speedSelect.value = String(recipe.speed || 1);
	}

	function getActiveVideoClip() {
		const activeLayers = getActiveClipsAtTime(state.playheadTime);
		for (const layer of activeLayers) {
			const asset = getMediaAssetForClip(layer.clip);
			if (asset && asset.type === 'video') {
				return { ...layer, asset };
			}
		}

		for (const track of trackSequence) {
			for (let clipIndex = 0; clipIndex < track.clips.length; clipIndex += 1) {
				const clip = track.clips[clipIndex];
				const asset = getMediaAssetForClip(clip);
				if (asset && asset.type === 'video') {
					return { trackIndex: trackSequence.indexOf(track), clipIndex, track, clip, asset };
				}
			}
		}

		return null;
	}

	function applyPlaybackRateToMediaNodes(selectedSpeed) {
		for (const asset of mediaRegistry.values()) {
			asset.element.playbackRate = selectedSpeed;
		}
	}

	function formatFrameTimestamp(totalSeconds) {
		const safeSeconds = Math.max(0, Math.floor(totalSeconds));
		const minutes = Math.floor(safeSeconds / 60);
		const seconds = safeSeconds % 60;
		return `${String(minutes).padStart(2, '0')}m${String(seconds).padStart(2, '0')}s`;
	}

	function drawVideoWithRecipe(ctx, canvas, videoElement, clip) {
		const recipe = getClipTransformRecipe(clip);
		const rotation = normalizeRotation(recipe.rotate);
		const sourceWidth = videoElement.videoWidth || videoElement.width || canvas.width;
		const sourceHeight = videoElement.videoHeight || videoElement.height || canvas.height;
		const swapped = rotation === 90 || rotation === 270;
		const fitWidth = swapped ? sourceHeight : sourceWidth;
		const fitHeight = swapped ? sourceWidth : sourceHeight;
		const scale = recipe.framing === 'cover'
			? Math.max(canvas.width / fitWidth, canvas.height / fitHeight)
			: Math.min(canvas.width / fitWidth, canvas.height / fitHeight);
		const drawWidth = fitWidth * scale;
		const drawHeight = fitHeight * scale;

		ctx.save();
		ctx.filter = `brightness(${1 + recipe.brightness}) contrast(${recipe.contrast}) saturate(${recipe.saturation})`;
		ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
		ctx.rotate((rotation * Math.PI) / 180);
		ctx.drawImage(videoElement, -drawWidth * 0.5, -drawHeight * 0.5, drawWidth, drawHeight);
		ctx.restore();
	}

	function grabCurrentFrame() {
		const activeVideoLayer = getActiveVideoClip();
		if (!activeVideoLayer) {
			return;
		}

		const activeVideo = activeVideoLayer.asset.element;
		if (activeVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
			return;
		}

		const offscreenCanvas = document.createElement('canvas');
		offscreenCanvas.width = activeVideo.videoWidth || activeVideoLayer.asset.element.width || 1;
		offscreenCanvas.height = activeVideo.videoHeight || activeVideoLayer.asset.element.height || 1;
		const offscreenCtx = offscreenCanvas.getContext('2d', { alpha: false });
		if (!offscreenCtx) {
			return;
		}

		paintVideoFrame(offscreenCtx, offscreenCanvas, activeVideo, activeVideoLayer.clip);

		offscreenCanvas.toBlob((blob) => {
			if (!blob) {
				return;
			}

			const downloadUrl = URL.createObjectURL(blob);
			const anchor = document.createElement('a');
			anchor.href = downloadUrl;
			anchor.download = `frame-${formatFrameTimestamp(state.playheadTime)}.png`;
			anchor.style.display = 'none';
			document.body.appendChild(anchor);
			anchor.click();
			anchor.remove();
			URL.revokeObjectURL(downloadUrl);
		}, 'image/png');
	}

	function requestCanvasRefresh() {
		state.needsRender = true;
		scheduleRender();
	}

    function syncTransportButton() {
		if (transportToggleButton) {
			transportToggleButton.textContent = state.isPlaying ? 'Pause' : 'Play';
			transportToggleButton.setAttribute('aria-pressed', String(state.isPlaying));
		}
		const hoverPlayPauseBtn = document.getElementById('hoverPlayPauseBtn');
		if (hoverPlayPauseBtn) {
			hoverPlayPauseBtn.textContent = state.isPlaying ? 'Pause' : 'Play';
		}
	}

	function makeAssetId(file, index) {
		const stamp = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${index}`;
		return `${file.type.startsWith('video/') ? 'video' : 'audio'}-${stamp}`;
	}

	function ensureHiddenMediaBin() {
		if (hiddenMediaBin) {
			return hiddenMediaBin;
		}

		hiddenMediaBin = document.createElement('div');
		hiddenMediaBin.hidden = true;
		hiddenMediaBin.setAttribute('aria-hidden', 'true');
		hiddenMediaBin.style.position = 'absolute';
		hiddenMediaBin.style.left = '-99999px';
		hiddenMediaBin.style.width = '1px';
		hiddenMediaBin.style.height = '1px';
		hiddenMediaBin.style.overflow = 'hidden';
		document.body.appendChild(hiddenMediaBin);
		return hiddenMediaBin;
	}

	function registerMediaElement(assetId, element, file, blobUrl, assetType) {
		const asset = {
			id: assetId,
			file,
			blobUrl,
			element,
			type: file.type.startsWith('video/') ? 'video' : 'audio',
		};
        asset.type=assetType;

		mediaRegistry.set(assetId, asset);
		return asset;
	}

    function createMediaElementForFile(file, assetId, blobUrl) {
		const isVideo = file.type.startsWith('video/');
		const element = document.createElement(isVideo ? 'video' : 'audio');
		element.preload = 'auto';
		element.playsInline = true;
		element.controls = false;
		element.src = blobUrl;
		element.dataset.assetId = assetId;
		if (isVideo) {
			element.muted = true;
		}
		
		// CRITICAL FIX: Force the browser to decode the first frame and trigger a repaint
		element.addEventListener('loadedmetadata', () => {
			if (isVideo) element.currentTime = 0.01; 
			requestCanvasRefresh();
		});
		element.addEventListener('seeked', requestCanvasRefresh);
		
		ensureHiddenMediaBin().appendChild(element);
		return element;
	}

	function getTrackByType(type) {
		return trackSequence.find((track) => track.type === type) || null;
	}

    function getOrCreateClipSlot(type) {
		const track = getTrackByType(type);
		if (!track) return null;

		const clip = track.clips.find((item) => !item.fileBlobUrl) || null;
		if (clip) return { track, clip };

		// NEW FIX: All incoming assets default to the absolute start of the timeline
		const nextClip = {
			id: `${type}-clip-${track.clips.length + 1}`,
			name: `${type === 'video' ? 'Video' : 'Audio'} clip ${track.clips.length + 1}`,
			startTime: 0, 
			duration: 6,
			sourceOffset: 0,
			fileBlobUrl: '',
		};
		track.clips.push(nextClip);
		return { track, clip: nextClip };
	}

	function bindAssetToClip(asset, slot) {
		if (!slot) {
			return;
		}

		const { clip } = slot;
		if (clip.fileBlobUrl && clip.fileBlobUrl !== asset.blobUrl) {
			URL.revokeObjectURL(clip.fileBlobUrl);
		}

		clip.name = asset.file.name.replace(/\.[^.]+$/, '') || clip.name;
		clip.fileBlobUrl = asset.blobUrl;
		clip.assetId = asset.id;
		clip.duration = clip.duration > 0 ? clip.duration : 6;
		getClipTransformRecipe(clip);
	}


    function loadMediaFiles(files) {
		const fileList = Array.from(files || []);
		fileList.forEach((file, index) => {
			const isVideo = file.type.startsWith('video/');
			const isAudio = file.type.startsWith('audio/');
			if (!isVideo && !isAudio) return; // Strict block

			const assetType = isVideo ? 'video' : 'audio';
			const assetId = makeAssetId(file, index);
			const blobUrl = URL.createObjectURL(file);
			const element = createMediaElementForFile(file, assetId, blobUrl);
			const asset = registerMediaElement(assetId, element, file, blobUrl, assetType);
			bindAssetToClip(asset, getOrCreateClipSlot(assetType));
		});

		state.needsRender = true;
		scheduleRender();
	}

	function getMediaAssetForClip(clip) {
		if (!clip) {
			return null;
		}

		if (clip.assetId && mediaRegistry.has(clip.assetId)) {
			return mediaRegistry.get(clip.assetId);
		}

		if (clip.fileBlobUrl) {
			for (const asset of mediaRegistry.values()) {
				if (asset.blobUrl === clip.fileBlobUrl) {
					return asset;
				}
			}
		}

		return null;
	}

	function getActiveClipsAtTime(playheadTime) {
		const activeClips = [];
		for (let trackIndex = 0; trackIndex < trackSequence.length; trackIndex += 1) {
			const track = trackSequence[trackIndex];
			for (let clipIndex = 0; clipIndex < track.clips.length; clipIndex += 1) {
				const clip = track.clips[clipIndex];
				if (playheadTime >= clip.startTime && playheadTime <= clip.startTime + clip.duration) {
					activeClips.push({ trackIndex, clipIndex, track, clip });
				}
			}
		}
		return activeClips;
	}

    function syncMediaElements(forceSeek = false) {
		const activeClips = getActiveClipsAtTime(state.playheadTime);
		const activeAssetIds = new Set();

		for (const layer of activeClips) {
			const asset = getMediaAssetForClip(layer.clip);
			if (!asset) continue;

			activeAssetIds.add(asset.id);
			const mediaElement = asset.element;
			const recipe = getClipTransformRecipe(layer.clip) || cloneDefaultTransformRecipe();
			const clipSpeed = recipe.speed || 1;
			
			const targetTime = clamp((state.playheadTime - layer.clip.startTime) * clipSpeed + (layer.clip.sourceOffset || 0), 0, Number.isFinite(mediaElement.duration) ? mediaElement.duration : MASTER_SEQUENCE_DURATION);
			const canSeek = Number.isFinite(targetTime) && !Number.isNaN(targetTime);
			
			if (state.isExporting) {
				if (canSeek) { try { mediaElement.currentTime = targetTime; } catch {} }
				if (!mediaElement.paused) mediaElement.pause();
				
			} else if (state.isPlaying) {
				const combinedSpeed = state.timelineSpeed * clipSpeed;
				
				// LAG FIX: Dynamic drift tolerance based on speed.
				// At 2x speed, allows 1.5 seconds of leniency to prevent JS from fighting the hardware decoder.
				const driftTolerance = (0.5 * combinedSpeed) + 0.5; 
				
				if (canSeek && (forceSeek || Math.abs(mediaElement.currentTime - targetTime) > driftTolerance)) {
					try { mediaElement.currentTime = targetTime; } catch {}
				}
				
				if (mediaElement.playbackRate !== combinedSpeed) {
					mediaElement.playbackRate = combinedSpeed;
				}

				if (mediaElement.paused) {
					const playPromise = mediaElement.play();
					if (playPromise) playPromise.catch(() => {});
				}
			} else {
				// SCRUBBING
				if (canSeek && (forceSeek || Math.abs(mediaElement.currentTime - targetTime) > MEDIA_TIME_EPSILON)) {
					try { mediaElement.currentTime = targetTime; } catch {}
				}
				if (!mediaElement.paused) mediaElement.pause();
			}
		}

		for (const asset of mediaRegistry.values()) {
			if (!activeAssetIds.has(asset.id) && !asset.element.paused) {
				asset.element.pause();
			}
		}
	}

function getProjectDuration() {
		let maxEnd = 0;
		for (const track of trackSequence) {
			for (const clip of track.clips) {
				maxEnd = Math.max(maxEnd, clip.startTime + clip.duration);
			}
		}
		// Fallback to 1 second minimum if empty, otherwise max boundary
		return maxEnd > 0 ? maxEnd : 1; 
	}

	function advancePlayhead(now) {
		if (!state.isPlaying) {
			state.lastTickAt = now;
			return;
		}

		if (state.lastTickAt === 0) {
			state.lastTickAt = now;
			return;
		}

		const deltaSeconds = ((now - state.lastTickAt) / 1000) * state.timelineSpeed;
		state.lastTickAt = now;
		
        const frameStep = state.isExporting ? (1 / 30) : deltaSeconds;
		const targetDuration = state.isExporting ? getProjectDuration() : MASTER_SEQUENCE_DURATION;
		const nextTime = clamp(state.playheadTime + frameStep, 0, targetDuration);
		
		if (nextTime !== state.playheadTime) {
			state.playheadTime = nextTime;
			setStatus(`${state.isExporting ? 'Exporting' : 'Playing'}... ${formatTimestamp(state.playheadTime)}`);
			state.needsRender = true;
		}

		if (state.playheadTime >= targetDuration) {
			state.isPlaying = false;
			pauseAllMedia();
			syncTransportButton();
			if (state.onPlaybackEnd) {
				state.onPlaybackEnd(); // Gracefully stops the exporter immediately!
			} else {
				setStatus(`Ended at ${formatTimestamp(state.playheadTime)}`);
			}
		}
	}

	function pauseAllMedia() {
		for (const asset of mediaRegistry.values()) {
			if (!asset.element.paused) {
				asset.element.pause();
			}
		}
	}

	function toggleTransport() {
		state.isPlaying = !state.isPlaying;
		state.lastTickAt = performance.now();
		syncTransportButton();
		if (state.isPlaying) {
			syncMediaElements(true);
			setStatus(`Playing from ${formatTimestamp(state.playheadTime)}`);
		} else {
			pauseAllMedia();
			setStatus(`Paused at ${formatTimestamp(state.playheadTime)}`);
		}
		state.needsRender = true;
		scheduleRender();
	}


    function paintVideoFrame(ctx, canvas, videoElement, clip) {
		const recipe = getClipTransformRecipe(clip) || cloneDefaultTransformRecipe();
		const rotation = normalizeRotation(recipe.rotate);
		
		ctx.save();
		ctx.globalAlpha = clip.opacity ?? 1;
		
		const targetWidth = canvas.width;
		const targetHeight = canvas.height;
		
		ctx.translate(targetWidth * 0.5, targetHeight * 0.5);
		ctx.rotate((rotation * Math.PI) / 180);
		
		// Direct draw without the broken filter pipeline
		ctx.drawImage(videoElement, -targetWidth * 0.5, -targetHeight * 0.5, targetWidth, targetHeight);
		
		ctx.restore();
	}

	function drawActiveVideoLayer(ctx, canvas, layer) {
		paintVideoFrame(ctx, canvas, layer.asset.element, layer.clip);
	}
	function drawMasterFrame() {
		if (!masterCanvas || !masterContext) {
			return;
		}

		const canvas = masterCanvas;
		const ctx = masterContext;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const activeClips = getActiveClipsAtTime(state.playheadTime);
		const activeVideoLayers = [];
		for (const layer of activeClips) {
			const asset = getMediaAssetForClip(layer.clip);
			if (asset && asset.type === 'video') {
				activeVideoLayers.push({ ...layer, asset });
			}
		}

		if (activeVideoLayers.length === 0) {
			const background = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
			background.addColorStop(0, 'rgba(10, 14, 19, 1)');
			background.addColorStop(1, 'rgba(18, 23, 30, 1)');
			ctx.fillStyle = background;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'rgba(238, 243, 248, 0.82)';
			ctx.font = '28px var(--font-display)';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText('No active video layer at this timestamp', canvas.width * 0.5, canvas.height * 0.5);
			return;
		}

		for (const layer of activeVideoLayers) {
			const activeVideoElement = layer.asset.element;
			if (activeVideoElement.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
				continue;
			}

			drawActiveVideoLayer(ctx, canvas, layer);
		}
	}

	function getLaneGeometry(width, height) {
		const rulerHeight = 34;
		const laneTop = rulerHeight;
		const laneHeight = Math.max((height - laneTop) / TRACKS.length, 1);
		return { rulerHeight, laneTop, laneHeight };
	}

	function getTrackLaneIndexFromPointer(event) {
		const rect = timelineCanvas.getBoundingClientRect();
		const pointerY = event.clientY - rect.top;
		const { laneTop, laneHeight } = getLaneGeometry(rect.width, rect.height);
		const relativeY = pointerY - laneTop;
		if (relativeY < 0) {
			return -1;
		}

		const laneIndex = Math.floor(relativeY / laneHeight);
		return laneIndex >= 0 && laneIndex < TRACKS.length ? laneIndex : -1;
	}

	function getClipRect(trackIndex, clip) {
		const { laneTop, laneHeight } = getLaneGeometry(state.contentWidth, state.contentHeight || timelineCanvas.getBoundingClientRect().height);
		const top = laneTop + trackIndex * laneHeight + 14;
		const height = Math.max(laneHeight - 28, 28);
		const left = secondsToPixels(clip.startTime);
		const width = Math.max(secondsToPixels(clip.duration), 18);
		return { left, top, width, height };
	}

	function getClipHitTarget(event) {
		const rect = timelineCanvas.getBoundingClientRect();
		const pointerX = event.clientX - rect.left;
		const pointerY = event.clientY - rect.top;
		const trackIndex = getTrackLaneIndexFromPointer(event);

		if (trackIndex === -1) {
			return null;
		}

		const track = trackSequence[trackIndex];
		if (!track) {
			return null;
		}

		for (let clipIndex = track.clips.length - 1; clipIndex >= 0; clipIndex -= 1) {
			const clip = track.clips[clipIndex];
			const bounds = getClipRect(trackIndex, clip);
			const withinX = pointerX >= bounds.left && pointerX <= bounds.left + bounds.width;
			const withinY = pointerY >= bounds.top && pointerY <= bounds.top + bounds.height;

			if (!withinX || !withinY) {
				continue;
			}

			const isActive = clip.id === state.activeClipId;
			if (isActive) {
				const delX = bounds.left + bounds.width - 14;
				const delY = bounds.top + 14;
				const dist = Math.hypot(pointerX - delX, pointerY - delY);
				if (dist <= 10) {
					return { trackIndex, clip, clipIndex, mode: 'delete', bounds };
				}
			}

			const localX = pointerX - bounds.left;
			if (localX <= CLIP_EDGE_BUFFER_PX) {
				return { trackIndex, clip, clipIndex, mode: 'trim-start', bounds };
			}

			if (bounds.width - localX <= CLIP_EDGE_BUFFER_PX) {
				return { trackIndex, clip, clipIndex, mode: 'trim-end', bounds };
			}

			return { trackIndex, clip, clipIndex, mode: 'move', bounds };
		}

		return null;
	}

	function setActiveClip(trackIndex, clipId, mode, event) {
		state.activeTrackIndex = trackIndex;
		state.activeClipId = clipId;
		state.interactionMode = mode;
		state.activePointerId = event.pointerId;
		state.isDragging = true;
	}

	function clearActiveClip() {
		state.isDragging = false;
		state.activePointerId = null;
		state.interactionMode = null;
		state.activeTrackIndex = -1;
		state.activeClipId = null;
		state.dragOffsetSeconds = 0;
		state.trimStartSeconds = 0;
		state.trimEndSeconds = 0;
	}

	function updateClipInteraction(event) {
		if (!state.isDragging || event.pointerId !== state.activePointerId) {
			return;
		}

		const rect = timelineCanvas.getBoundingClientRect();
		const pointerX = clamp(event.clientX - rect.left, 0, rect.width);
		const pointerSeconds = pixelsToSeconds(pointerX);
		const activeTrack = trackSequence[state.activeTrackIndex];
		if (!activeTrack) {
			return;
		}

		const clip = activeTrack.clips.find((item) => item.id === state.activeClipId);
		if (!clip) {
			return;
		}

		if (state.interactionMode === 'move') {
			const nextStart = clamp(pointerSeconds - state.dragOffsetSeconds, 0, MASTER_SEQUENCE_DURATION - clip.duration);
			clip.startTime = nextStart;
			state.playheadTime = clamp(nextStart, 0, MASTER_SEQUENCE_DURATION);
			setStatus(`Moving ${clip.name} ${formatTimestamp(clip.startTime)}`);
		}else if (state.interactionMode === 'trim-start') {
			const minStart = clip.startTime - (clip.sourceOffset || 0);
			const maxStart = clip.startTime + clip.duration - 0.1;
			const nextStart = clamp(pointerSeconds, minStart, maxStart);
			
			const delta = nextStart - clip.startTime; // Calculate shaved time
			
			clip.startTime = nextStart;
			clip.duration = Math.max(0.1, clip.duration - delta);
			clip.sourceOffset = Math.max(0, (clip.sourceOffset || 0) + delta);
			
			// LIVE PREVIEW: Set playhead to the trim edge
			state.playheadTime = clip.startTime;
			syncMediaElements(true);
			
			setStatus(`Trimming start ${clip.name}`);
		}else if (state.interactionMode === 'trim-end') {
			const asset = getMediaAssetForClip(clip);
			
			// Safely extract actual video duration, fallback to master sequence if missing
			let mediaDuration = MASTER_SEQUENCE_DURATION;
			if (asset && asset.element && !isNaN(asset.element.duration) && asset.element.duration > 0 && asset.element.duration !== Infinity) {
				mediaDuration = asset.element.duration;
			}

			// Clamp the absolute maximum end point
			const maxPossibleEnd = clip.startTime + (mediaDuration - (clip.sourceOffset || 0));
			const nextEnd = clamp(pointerSeconds, clip.startTime + 0.1, maxPossibleEnd);
			
			clip.duration = Math.max(0.1, nextEnd - clip.startTime);

			// LIVE PREVIEW: Set playhead to the trim edge
			state.playheadTime = clip.startTime + clip.duration - 0.1;
			syncMediaElements(true);

			setStatus(`Trimming end ${clip.name}`);
		}

		state.needsRender = true;
		scheduleRender();
	}

	function scheduleRender() {
		if (rafId !== 0) {
			return;
		}

		rafId = window.requestAnimationFrame(renderFrame);
	}

    function resizeCanvasToContainer() {
		if (!timelineCanvas || !timelineWrap) {
			return;
		}

		const wrapRect = timelineWrap.getBoundingClientRect();
		const dpr = window.devicePixelRatio || 1;
		const cssWidth = Math.max(1, Math.ceil(wrapRect.width));
		const cssHeight = Math.max(1, Math.ceil(wrapRect.height)); // Derive securely from the wrapper
		const contentWidth = Math.max(cssWidth, Math.ceil(secondsToPixels(MASTER_SEQUENCE_DURATION)));
		const contentHeight = cssHeight;

		state.dpr = dpr;
		state.contentWidth = contentWidth;
		state.contentHeight = contentHeight;

		timelineCanvas.style.width = `${contentWidth}px`;
		timelineCanvas.style.height = `100%`;

		if (timelineCanvas.width !== Math.round(contentWidth * dpr)) {
			timelineCanvas.width = Math.round(contentWidth * dpr);
		}

		if (timelineCanvas.height !== Math.round(contentHeight * dpr)) {
			timelineCanvas.height = Math.round(contentHeight * dpr);
		}

		state.needsRender = true;
		scheduleRender();
	}

	function getPointerSeconds(event) {
		const rect = timelineCanvas.getBoundingClientRect();
		const localX = clamp(event.clientX - rect.left, 0, rect.width);
		return clamp(pixelsToSeconds(localX), 0, MASTER_SEQUENCE_DURATION);
	}

	function updatePlayheadFromPointer(event) {
		const nextTime = getPointerSeconds(event);
		if (nextTime !== state.playheadTime) {
			state.playheadTime = nextTime;
			setStatus(`Playhead ${formatTimestamp(nextTime)}`);
			syncMediaElements(true);
			requestCanvasRefresh();
		}
	}

	function handlePointerDown(event) {
		if (event.button !== 0 && event.pointerType === 'mouse') {
			return;
		}

		const clipHit = getClipHitTarget(event);
		if (clipHit) {
            if (clipHit.mode === 'delete') {
				trackSequence[clipHit.trackIndex].clips.splice(clipHit.clipIndex, 1);
				clearActiveClip();
				syncMediaElements(true);
				requestCanvasRefresh();
				return;
			}
			setActiveClip(clipHit.trackIndex, clipHit.clip.id, clipHit.mode, event);
			state.dragOffsetSeconds = clipHit.mode === 'move' ? pixelsToSeconds((event.clientX - timelineCanvas.getBoundingClientRect().left) - clipHit.bounds.left) : 0;
			state.trimStartSeconds = clipHit.clip.startTime;
			state.trimEndSeconds = clipHit.clip.startTime + clipHit.clip.duration;
			timelineCanvas.setPointerCapture(event.pointerId);
			setStatus(`${clipHit.mode === 'move' ? 'Moving' : 'Trimming'} ${clipHit.clip.name}`);
			setEditingClipFromTimeline(clipHit.clip.id);
			syncMediaElements(true);
			requestCanvasRefresh();
			return;
		}

		state.isDragging = true;
		state.activePointerId = event.pointerId;
		state.interactionMode = 'scrub';
		timelineCanvas.setPointerCapture(event.pointerId);
		updatePlayheadFromPointer(event);
		setStatus(`Scrubbing ${formatTimestamp(state.playheadTime)}`);
	}

    function handlePointerMove(event) {
		if (!state.isDragging) {
			const clipHit = getClipHitTarget(event);
			if (clipHit) {
				timelineCanvas.style.cursor = (clipHit.mode === 'trim-start' || clipHit.mode === 'trim-end') ? 'ew-resize' : 'grab';
			} else {
				timelineCanvas.style.cursor = 'default';
			}
		}

		if (state.interactionMode === 'scrub') {
			if (!state.isDragging || event.pointerId !== state.activePointerId) return;
			updatePlayheadFromPointer(event);
			return;
		}

		if (!state.isDragging || event.pointerId !== state.activePointerId) return;
		updateClipInteraction(event);
	}

	function endPointerDrag(event) {
		if (event.pointerId !== state.activePointerId && state.interactionMode !== 'scrub') {
			return;
		}

		if (timelineCanvas.hasPointerCapture(event.pointerId)) {
			timelineCanvas.releasePointerCapture(event.pointerId);
		}

		const wasScrubbing = state.interactionMode === 'scrub';
		clearActiveClip();
		if (wasScrubbing) {
			setStatus(`Ready at ${formatTimestamp(state.playheadTime)}`);
		} else {
			setStatus(`Ready with clip selection`);
		}
		state.needsRender = true;
		scheduleRender();
	}

    function applyTransformPanelChange(mutator) {
		const clip = getEditableClip();
		if (!clip) return;

		// 1. Mutate the state
		const nextRecipe = mutator(getClipTransformRecipe(clip));
		setClipTransformRecipe(clip, nextRecipe);
		
		// 2. UI Refresh
		refreshTransformPanel();
		
		// 3. FORCE REAL-TIME RENDER:
		state.needsRender = true;
		requestCanvasRefresh();
	}

    function bindTransformControls() {
		const btnRotate = document.querySelector('.rotation-step');
		if (btnRotate) {
			btnRotate.addEventListener('click', () => {
				applyTransformPanelChange((r) => ({ ...r, rotate: (r.rotate + 90) % 360 }));
			});
		}

		const speedSelect = document.getElementById('timelineSpeed');
		if (speedSelect) {
			speedSelect.addEventListener('change', () => {
				const clip = getEditableClip();
				if (!clip) return;

				const recipe = getClipTransformRecipe(clip);
				const oldSpeed = recipe.speed || 1;
				const newSpeed = Number(speedSelect.value) || 1;
				
				clip.duration = clip.duration * (oldSpeed / newSpeed);
				applyTransformPanelChange((r) => ({ ...r, speed: newSpeed }));
			});
		}
	}

	function bindCaptureFrameButton() {
		const captureButton = document.getElementById('grabFrameBtn');
		captureButton?.addEventListener('click', () => {
			grabCurrentFrame();
		});
	}

	function drawClip(trackIndex, clip) {
		const context = timelineContext;
		const bounds = getClipRect(trackIndex, clip);
		const isActive = clip.id === state.activeClipId;
		const isDragging = isActive && state.isDragging;

		context.save();
		context.fillStyle = layerColorForClip(clip);
		context.strokeStyle = isActive ? '#7cc0ff' : 'rgba(255, 255, 255, 0.14)';
		context.lineWidth = isActive ? 2 : 1;
		context.beginPath();
		context.roundRect(bounds.left, bounds.top, bounds.width, bounds.height, 10);
		context.fill();
		context.stroke();

		context.fillStyle = '#eef3f8';
		context.font = `12px ${getComputedStyle(document.body).fontFamily}`;
		context.textAlign = 'left';
		context.textBaseline = 'top';
		context.fillText(clip.name, bounds.left + 12, bounds.top + 12);

		context.fillStyle = 'rgba(142, 154, 171, 0.9)';
		context.font = `10px ${getComputedStyle(document.body).fontFamily}`;
		context.fillText(`${formatTimestamp(clip.startTime)} - ${formatTimestamp(clip.startTime + clip.duration)}`, bounds.left + 12, bounds.top + 30);

		context.strokeStyle = isDragging ? '#53a8ff' : 'rgba(255, 255, 255, 0.12)';
		context.lineWidth = 1;
		context.beginPath();
		context.moveTo(bounds.left + CLIP_EDGE_BUFFER_PX, bounds.top + 4);
		context.lineTo(bounds.left + CLIP_EDGE_BUFFER_PX, bounds.top + bounds.height - 4);
		context.moveTo(bounds.left + bounds.width - CLIP_EDGE_BUFFER_PX, bounds.top + 4);
		context.lineTo(bounds.left + bounds.width - CLIP_EDGE_BUFFER_PX, bounds.top + bounds.height - 4);
		context.stroke();
		context.restore();
        context.stroke();

		if (isActive) {
			const delX = bounds.left + bounds.width - 14;
			const delY = bounds.top + 14;
			context.fillStyle = 'rgba(255, 60, 60, 0.9)';
			context.beginPath();
			context.arc(delX, delY, 8, 0, Math.PI * 2);
			context.fill();
			context.fillStyle = '#fff';
			context.font = 'bold 10px sans-serif';
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.fillText('×', delX, delY + 1);
		}

		context.restore();
	}

	function layerColorForClip(clip) {
		if (clip.fileBlobUrl) {
			return clip.assetId && mediaRegistry.has(clip.assetId) && mediaRegistry.get(clip.assetId).type === 'video'
				? 'rgba(83, 168, 255, 0.22)'
				: 'rgba(67, 209, 158, 0.22)';
		}

		return clip.assetId && mediaRegistry.has(clip.assetId) && mediaRegistry.get(clip.assetId).type === 'video'
			? 'rgba(83, 168, 255, 0.22)'
			: 'rgba(83, 168, 255, 0.18)';
	}

	function drawBackground(width, height) {
		const context = timelineContext;
		context.clearRect(0, 0, width, height);

		const gradient = context.createLinearGradient(0, 0, 0, height);
		gradient.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
		gradient.addColorStop(1, 'rgba(255, 255, 255, 0.01)');
		context.fillStyle = gradient;
		context.fillRect(0, 0, width, height);
	}

	function drawTrackLanes(width, height) {
		const context = timelineContext;
		const rulerHeight = 34;
		const laneTop = rulerHeight;
		const laneHeight = Math.max((height - laneTop) / TRACKS.length, 1);

		for (let index = 0; index < TRACKS.length; index += 1) {
			const lane = TRACKS[index];
			const top = laneTop + index * laneHeight;

			context.fillStyle = index % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'rgba(255, 255, 255, 0.03)';
			context.fillRect(0, top, width, laneHeight);

			context.strokeStyle = index === 0 ? 'rgba(161, 174, 194, 0.18)' : 'rgba(161, 174, 194, 0.12)';
			context.lineWidth = 1;
			context.beginPath();
			context.moveTo(0, top + 0.5);
			context.lineTo(width, top + 0.5);
			context.stroke();

			context.fillStyle = '#eef3f8';
			context.font = `12px ${getComputedStyle(document.body).fontFamily}`;
			context.textAlign = 'left';
			context.textBaseline = 'middle';
			context.fillText(lane.label, 14, top + laneHeight * 0.5);

			context.fillStyle = lane.kind === 'video' ? 'rgba(83, 168, 255, 0.12)' : 'rgba(67, 209, 158, 0.12)';
			context.fillRect(width - 120, top + 10, 104, 18);

			context.fillStyle = lane.kind === 'video' ? '#7cc0ff' : '#43d19e';
			context.font = `10px ${getComputedStyle(document.body).fontFamily}`;
			context.textAlign = 'center';
			context.fillText(lane.kind.toUpperCase(), width - 68, top + laneHeight * 0.5);
		}

		context.strokeStyle = 'rgba(161, 174, 194, 0.18)';
		context.lineWidth = 1;
		context.beginPath();
		context.moveTo(0, laneTop + TRACKS.length * laneHeight + 0.5);
		context.lineTo(width, laneTop + TRACKS.length * laneHeight + 0.5);
		context.stroke();

		for (let trackIndex = 0; trackIndex < Math.min(trackSequence.length, TRACKS.length); trackIndex += 1) {
			const track = trackSequence[trackIndex];
			for (const clip of track.clips) {
				drawClip(trackIndex, clip);
			}
		}
	}

	function drawRuler(width) {
		const context = timelineContext;
		const rulerHeight = 34;
		const majorTickHeight = 18;
		const minorTickHeight = 10;
		const labelBaseline = 22;

		context.fillStyle = 'rgba(17, 21, 26, 0.92)';
		context.fillRect(0, 0, width, rulerHeight);

		context.strokeStyle = 'rgba(161, 174, 194, 0.22)';
		context.lineWidth = 1;
		context.beginPath();
		context.moveTo(0, rulerHeight + 0.5);
		context.lineTo(width, rulerHeight + 0.5);
		context.stroke();

		context.font = `11px ${getComputedStyle(document.body).fontFamily}`;
		context.textAlign = 'center';
		context.textBaseline = 'alphabetic';

		for (let second = 0; second <= MASTER_SEQUENCE_DURATION; second += SECOND_MINOR_STEP) {
			const x = Math.round(secondsToPixels(second)) + 0.5;
			const isMajor = second % SECOND_MAJOR_STEP === 0;
			const isMinute = second % 60 === 0;

			context.strokeStyle = isMinute ? 'rgba(124, 192, 255, 0.9)' : isMajor ? 'rgba(161, 174, 194, 0.9)' : 'rgba(161, 174, 194, 0.45)';
			context.beginPath();
			context.moveTo(x, rulerHeight);
			context.lineTo(x, rulerHeight - (isMajor ? majorTickHeight : minorTickHeight));
			context.stroke();

			if (isMajor) {
				context.fillStyle = isMinute ? '#7cc0ff' : '#8e9aab';
				context.fillText(formatTimestamp(second), x, labelBaseline);
			}
		}
	}

	function drawPlayhead(width, height) {
		const context = timelineContext;
		const x = Math.round(secondsToPixels(state.playheadTime)) + 0.5;
		const rulerHeight = 34;

		context.save();
		context.shadowColor = 'rgba(83, 168, 255, 0.55)';
		context.shadowBlur = 14;
		context.strokeStyle = '#53a8ff';
		context.lineWidth = 3;
		context.beginPath();
		context.moveTo(x, rulerHeight);
		context.lineTo(x, height);
		context.stroke();
		context.restore();

		context.fillStyle = '#53a8ff';
		context.beginPath();
		context.moveTo(x - 7, rulerHeight);
		context.lineTo(x + 7, rulerHeight);
		context.lineTo(x, rulerHeight - 11);
		context.closePath();
		context.fill();

		context.fillStyle = 'rgba(8, 12, 17, 0.95)';
		context.fillRect(x + 8, 6, 52, 18);
		context.strokeStyle = 'rgba(255, 255, 255, 0.18)';
		context.lineWidth = 1;
		context.strokeRect(x + 8 + 0.5, 6 + 0.5, 52, 18);
		context.fillStyle = '#eef3f8';
		context.font = `10px ${getComputedStyle(document.body).fontFamily}`;
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText(formatTimestamp(state.playheadTime), x + 34, 15);
	}

	function renderFrame() {
		rafId = 0;

		if (!timelineCanvas || !timelineContext) {
			return;
		}

		if (!state.needsRender && !state.isDragging) {
			return;
		}

		const width = timelineCanvas.width;
		const height = timelineCanvas.height;
		if (width === 0 || height === 0) {
			return;
		}

		advancePlayhead(performance.now());
		syncMediaElements(false);
		drawMasterFrame();

		timelineContext.setTransform(1, 0, 0, 1, 0, 0);
		timelineContext.scale(state.dpr, state.dpr);
		const cssWidth = width / state.dpr;
		const cssHeight = height / state.dpr;
		drawBackground(cssWidth, cssHeight);
		drawRuler(cssWidth);
		drawTrackLanes(cssWidth, cssHeight);
		drawPlayhead(cssWidth, cssHeight);

        const progress = document.getElementById('hoverTimelineProgress');
		const timeDisplay = document.getElementById('hoverTimeDisplay');
		if (progress && timeDisplay) {
			const targetDuration = state.isExporting ? getProjectDuration() : MASTER_SEQUENCE_DURATION;
			const pct = clamp((state.playheadTime / targetDuration) * 100, 0, 100);
			progress.style.width = `${pct}%`;
			timeDisplay.textContent = formatTimestamp(state.playheadTime);
		}

		state.needsRender = false;
		if (state.isPlaying || state.isDragging) {
			state.needsRender = true;
			scheduleRender();
		}
	}

	function bootstrap() {
		masterCanvas = document.getElementById('masterCanvas');
		masterContext = masterCanvas ? masterCanvas.getContext('2d', { alpha: false }) : null;

        if (masterCanvas) {
			masterCanvas.style.cursor = 'pointer';
			masterCanvas.addEventListener('click', () => {
				if (!state.isExporting) toggleTransport();
			});

            const hoverPlayPauseBtn = document.getElementById('hoverPlayPauseBtn');
		if (hoverPlayPauseBtn) {
			hoverPlayPauseBtn.addEventListener('click', (e) => {
				e.stopPropagation(); // Stops the canvas click-to-play from double firing
				if (!state.isExporting) toggleTransport();
			});
		}

		const hoverTimelineTrack = document.getElementById('hoverTimelineTrack');
		if (hoverTimelineTrack) {
			// Prevent canvas play/pause when dragging the transport bar
			hoverTimelineTrack.addEventListener('click', (e) => e.stopPropagation());
			hoverTimelineTrack.addEventListener('pointerdown', (e) => {
				e.stopPropagation(); 
				const rect = hoverTimelineTrack.getBoundingClientRect();
				const pct = clamp((e.clientX - rect.left) / rect.width, 0, 1);
				
				// Snap the absolute playhead to the click location
				state.playheadTime = pct * MASTER_SEQUENCE_DURATION;
				syncMediaElements(true);
				requestCanvasRefresh();
			});
		}
		}

		// NEW: Spacebar global playback control
		window.addEventListener('keydown', (e) => {
			if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'TEXTAREA') {
				e.preventDefault();
				if (!state.isExporting) toggleTransport();
			}
		});

		timelineCanvas = document.getElementById('timelineCanvas');
		timelineWrap = document.querySelector('.timeline-canvas-wrap');
		statusChip = document.querySelector('.status-chip');
        transportToggleButton = document.getElementById('transportToggle');
		const canvasPlayPauseBtn = document.getElementById('canvasPlayPauseBtn');
		if (canvasPlayPauseBtn) {
			canvasPlayPauseBtn.addEventListener('click', toggleTransport);
		}
		mediaInput = document.getElementById('mediaAssets');
        const overlayMediaInput = document.getElementById('overlayMediaAssets');
		const exportSessionBtn = document.getElementById('exportSessionBtn');

		if (!timelineCanvas || !timelineWrap) {
			return;
		}

		if (transportToggleButton) {
			transportToggleButton.addEventListener('click', toggleTransport);
		}

        if (mediaInput) {
			mediaInput.addEventListener('change', handleFileUpload);
		}
		
		if (overlayMediaInput) {
			overlayMediaInput.addEventListener('change', handleFileUpload);
		}

        function handleFileUpload(event) {
			loadMediaFiles(event.target.files);
			event.target.value = '';
			const overlay = document.getElementById('previewOverlay');
			if (overlay) overlay.style.display = 'none'; // Hide overlay once media is loaded
			
			// FIX: Reveal the hover transport bar only after media is loaded
			const transportBar = document.getElementById('hoverTransportBar');
			if (transportBar) transportBar.style.display = 'flex';
		}

        let globalAudioCtx = null;
		let exportDest = null;
		let mediaRecorder = null;
		let exportChunks = [];

        if (exportSessionBtn) {
			exportSessionBtn.addEventListener('click', () => {
				if (state.isExporting || !masterCanvas) return;
				
				setStatus('Preparing video export...');
				state.isExporting = true;
				pauseAllMedia();
				state.playheadTime = 0;
				syncMediaElements(true);
				
				exportChunks = [];
				const stream = masterCanvas.captureStream(30);
				
				try {
					if (!globalAudioCtx) {
						globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
					}
					if (globalAudioCtx.state === 'suspended') {
						globalAudioCtx.resume();
					}
					exportDest = globalAudioCtx.createMediaStreamDestination();
					
					for (const asset of mediaRegistry.values()) {
						if (!asset.audioSource) {
							asset.audioSource = globalAudioCtx.createMediaElementSource(asset.element);
							asset.audioSource.connect(globalAudioCtx.destination); 
						}
						asset.audioSource.connect(exportDest); 
					}
					
					exportDest.stream.getAudioTracks().forEach(track => stream.addTrack(track));
				} catch (e) {
					console.warn('Audio capture bypassed:', e);
				}

				// Check browser support and prefer mp4 if available
				const supportedTypes = ['video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
				let mimeType = 'video/webm'; 
				for (let type of supportedTypes) {
					if (MediaRecorder.isTypeSupported(type)) {
						mimeType = type;
						break;
					}
				}
				
				mediaRecorder = new MediaRecorder(stream, { mimeType });
				
				mediaRecorder.ondataavailable = e => {
					if (e.data.size > 0) exportChunks.push(e.data);
				};
				
				mediaRecorder.onstop = () => {
					const blob = new Blob(exportChunks, { type: mimeType });
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					
					// Use appropriate extension based on what the browser actually negotiated
					const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
					a.download = `canvas-studio-export.${ext}`;
					
					document.body.appendChild(a);
					a.click();
					a.remove();
					URL.revokeObjectURL(url);
					
					setStatus('Export complete!');
					state.isExporting = false;
					state.isPlaying = false;
					syncTransportButton();
				};
				
				mediaRecorder.start(100); // Record in 100ms chunks safely
				state.isPlaying = true;
				state.lastTickAt = performance.now();
				syncTransportButton();
				syncMediaElements(true);
				scheduleRender();
				
				state.onPlaybackEnd = () => {
					mediaRecorder.stop();
					state.onPlaybackEnd = null;
				};
			});
		}

		bindTransformControls();
		bindCaptureFrameButton();

		timelineContext = timelineCanvas.getContext('2d', { alpha: true });
		if (!timelineContext) {
			return;
		}

		syncTransportButton();

		window.canvasMultitrackSequencer = {
			PX_PER_SEC,
			MASTER_SEQUENCE_DURATION,
			mediaRegistry,
			get trackSequence() {
				return trackSequence;
			},
			get isPlaying() {
				return state.isPlaying;
			},
			get playheadTime() {
				return state.playheadTime;
			},
			setPlayheadTime(seconds) {
				state.playheadTime = clamp(seconds, 0, MASTER_SEQUENCE_DURATION);
				syncMediaElements(true);
				state.needsRender = true;
				scheduleRender();
				return state.playheadTime;
			},
			toggleTransport,
			setTrackSequence(nextSequence) {
				if (Array.isArray(nextSequence)) {
					trackSequence = nextSequence;
					state.needsRender = true;
					scheduleRender();
				}
			},
			secondsToPixels,
			pixelsToSeconds,
		};

		applyPlaybackRateToMediaNodes(state.timelineSpeed);

		timelineCanvas.style.touchAction = 'none';
		timelineCanvas.style.userSelect = 'none';

		timelineCanvas.addEventListener('pointerdown', handlePointerDown);
		timelineCanvas.addEventListener('pointermove', handlePointerMove);
		timelineCanvas.addEventListener('pointerup', endPointerDrag);
		timelineCanvas.addEventListener('pointercancel', endPointerDrag);
		timelineCanvas.addEventListener('lostpointercapture', endPointerDrag);

		resizeObserver = new ResizeObserver(() => {
			resizeCanvasToContainer();
		});
		resizeObserver.observe(timelineWrap);

		window.addEventListener('resize', resizeCanvasToContainer, { passive: true });
		setStatus(`Ready at ${formatTimestamp(state.playheadTime)}`);
		resizeCanvasToContainer();
		syncMediaElements(true);
		scheduleRender();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
	} else {
		bootstrap();
	}
})();
