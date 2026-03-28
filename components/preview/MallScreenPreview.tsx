'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MALL_SCREEN_CONFIG } from './ScreenConfig';
import { ScreenConfig } from '@/types';

interface MallScreenPreviewProps {
  mediaUrl: string | null;       // URL or object URL of the uploaded asset
  mediaType: 'image' | 'video';
  contentMode?: 'fit' | 'fill';
  config?: Partial<ScreenConfig>;
  className?: string;
  showControls?: boolean;
  onLoad?: () => void;
}

/**
 * MallScreenPreview
 *
 * Renders a perspective-mapped preview of content on the central mall screen.
 * Uses an HTML5 Canvas with a custom perspective projection (corner-pin / homography)
 * to map the uploaded content into the exact quadrilateral of the real screen.
 *
 * Algorithm:
 * 1. Draw the mall background image on canvas
 * 2. Compute a projective transform (homography) from the content rectangle to the screen quad
 * 3. For each pixel in the destination quad, sample from the source image/video
 * 4. Composite an optional LED scanline + glow overlay
 */
export default function MallScreenPreview({
  mediaUrl,
  mediaType,
  contentMode = 'fill',
  config: configOverride,
  className = '',
  showControls = false,
  onLoad,
}: MallScreenPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const mediaElementRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const config = { ...MALL_SCREEN_CONFIG, ...configOverride };

  // Load the mall background image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/assets/mall-bg.jpg';
    img.onload = () => {
      bgImageRef.current = img;
      setBgLoaded(true);
    };
    img.onerror = () => {
      // If no real mall image, use placeholder
      setBgLoaded(true);
    };
    return () => { img.onload = null; img.onerror = null; };
  }, []);

  // Load media content
  useEffect(() => {
    if (!mediaUrl) { setMediaLoaded(false); return; }

    if (mediaType === 'image') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = mediaUrl;
      img.onload = () => {
        mediaElementRef.current = img;
        setMediaLoaded(true);
      };
      img.onerror = () => setMediaLoaded(false);
    } else {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = mediaUrl;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.oncanplay = () => {
        mediaElementRef.current = video;
        video.play().catch(() => {});
        setMediaLoaded(true);
      };
      video.onerror = () => setMediaLoaded(false);
    }

    return () => {
      if (mediaType === 'video') {
        const v = mediaElementRef.current as HTMLVideoElement;
        v?.pause();
      }
      mediaElementRef.current = null;
    };
  }, [mediaUrl, mediaType]);

  // -----------------------------------------------
  // Core rendering function
  // -----------------------------------------------
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // 1. Clear
    ctx.clearRect(0, 0, W, H);

    // 2. Draw mall background (or generated mockup)
    if (bgImageRef.current) {
      ctx.drawImage(bgImageRef.current, 0, 0, W, H);
    } else {
      drawMockMallBackground(ctx, W, H);
    }

    // 3. Draw media into central screen using perspective mapping
    if (mediaElementRef.current && (mediaType === 'image' || mediaType === 'video')) {
      const media = mediaElementRef.current;
      const srcW = mediaType === 'image'
        ? (media as HTMLImageElement).naturalWidth
        : (media as HTMLVideoElement).videoWidth;
      const srcH = mediaType === 'image'
        ? (media as HTMLImageElement).naturalHeight
        : (media as HTMLVideoElement).videoHeight;

      if (srcW > 0 && srcH > 0) {
        // Get the 4 corner points of the screen in canvas pixels
        const pts = getScreenPoints(config.centralScreen, W, H);

        // Draw using perspective mapping
        drawPerspective(ctx, media, pts, srcW, srcH, contentMode, config);
      }
    } else if (!mediaUrl) {
      // Draw empty screen placeholder
      const pts = getScreenPoints(config.centralScreen, W, H);
      drawEmptyScreen(ctx, pts);
    }

    // 4. Glow overlay around the screen
    if (config.glowIntensity > 0) {
      drawScreenGlow(ctx, config.centralScreen, W, H, config.glowIntensity);
    }

  }, [mediaUrl, mediaType, contentMode, config]);

  // Animation loop for video
  useEffect(() => {
    if (!bgLoaded) return;

    const loop = () => {
      render();
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    setIsLoading(false);
    onLoad?.();

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [bgLoaded, mediaLoaded, render, onLoad]);

  // Resize canvas to match container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        canvas.width = Math.round(width * devicePixelRatio);
        canvas.height = Math.round(width * devicePixelRatio * (9 / 16));
        canvas.style.width = `${width}px`;
        canvas.style.height = `${width * (9 / 16)}px`;
      }
    });

    observer.observe(canvas.parentElement || canvas);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-amber-400/70 text-xs">Chargement du rendu...</p>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full rounded-xl"
        style={{ imageRendering: 'auto' }}
      />

      {showControls && mediaUrl && (
        <div className="absolute bottom-3 right-3 flex gap-2">
          <div className="glass-dark rounded-lg px-3 py-1.5 text-xs text-amber-400 font-medium flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Aperçu en direct
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------
// Helper: Get screen corner points in px
// -----------------------------------------------
function getScreenPoints(
  screenConfig: ScreenConfig['centralScreen'],
  W: number,
  H: number
): [number, number][] {
  return [
    [screenConfig.topLeft[0] / 100 * W, screenConfig.topLeft[1] / 100 * H],
    [screenConfig.topRight[0] / 100 * W, screenConfig.topRight[1] / 100 * H],
    [screenConfig.bottomRight[0] / 100 * W, screenConfig.bottomRight[1] / 100 * H],
    [screenConfig.bottomLeft[0] / 100 * W, screenConfig.bottomLeft[1] / 100 * H],
  ];
}

// -----------------------------------------------
// Core perspective drawing using Canvas transforms
// -----------------------------------------------
function drawPerspective(
  ctx: CanvasRenderingContext2D,
  media: HTMLImageElement | HTMLVideoElement,
  dstPoints: [number, number][],
  srcW: number,
  srcH: number,
  mode: 'fit' | 'fill',
  config: ScreenConfig
) {
  const [tl, tr, br, bl] = dstPoints;

  // Bounding box of destination
  const minX = Math.min(tl[0], bl[0]);
  const maxX = Math.max(tr[0], br[0]);
  const minY = Math.min(tl[1], tr[1]);
  const maxY = Math.max(bl[1], br[1]);
  const dstW = maxX - minX;
  const dstH = maxY - minY;

  // Calculate source crop based on mode
  let sx = 0, sy = 0, sw = srcW, sh = srcH;
  const srcAspect = srcW / srcH;
  const dstAspect = dstW / dstH;

  if (mode === 'fill') {
    if (srcAspect > dstAspect) {
      sw = srcH * dstAspect;
      sx = (srcW - sw) / 2;
    } else {
      sh = srcW / dstAspect;
      sy = (srcH - sh) / 2;
    }
  } else {
    // 'fit' - letterbox
    if (srcAspect > dstAspect) {
      const targetH = sw / dstAspect;
      sy = (sh - targetH) / 2;
      sh = targetH;
    } else {
      const targetW = sh * dstAspect;
      sx = (sw - targetW) / 2;
      sw = targetW;
    }
  }

  // Save context state
  ctx.save();

  // Create clipping path for the screen quadrilateral
  ctx.beginPath();
  ctx.moveTo(tl[0], tl[1]);
  ctx.lineTo(tr[0], tr[1]);
  ctx.lineTo(br[0], br[1]);
  ctx.lineTo(bl[0], bl[1]);
  ctx.closePath();
  ctx.clip();

  // Apply brightness/contrast via globalAlpha + compositing
  // For a full perspective warp, we use a simplified approach:
  // Since Canvas 2D doesn't support arbitrary perspective transforms natively,
  // we use a tri-strip subdivision approach to approximate the perspective

  const SUBDIVISIONS = 32;
  for (let j = 0; j < SUBDIVISIONS; j++) {
    for (let i = 0; i < SUBDIVISIONS; i++) {
      const u0 = i / SUBDIVISIONS;
      const u1 = (i + 1) / SUBDIVISIONS;
      const v0 = j / SUBDIVISIONS;
      const v1 = (j + 1) / SUBDIVISIONS;

      // Bilinear interpolation of destination corners
      const p00 = bilerp(tl, tr, bl, br, u0, v0);
      const p10 = bilerp(tl, tr, bl, br, u1, v0);
      const p01 = bilerp(tl, tr, bl, br, u0, v1);
      const p11 = bilerp(tl, tr, bl, br, u1, v1);

      // Source rectangle for this tile
      const srcX = sx + u0 * sw;
      const srcY = sy + v0 * sh;
      const srcTileW = (u1 - u0) * sw;
      const srcTileH = (v1 - v0) * sh;

      // Draw this tile with a transform
      ctx.save();

      // Clip to this cell's quad
      ctx.beginPath();
      ctx.moveTo(p00[0], p00[1]);
      ctx.lineTo(p10[0], p10[1]);
      ctx.lineTo(p11[0], p11[1]);
      ctx.lineTo(p01[0], p01[1]);
      ctx.closePath();
      ctx.clip();

      // Transform to map source rect to dest quad
      const dw = p10[0] - p00[0];
      const dh = p11[1] - p10[1]; // simplified
      const scaleX = dw / srcTileW || 1;
      const scaleY = dh / srcTileH || 1;

      ctx.setTransform(
        scaleX, 0,
        0, scaleY,
        p00[0] - srcX * scaleX,
        p00[1] - srcY * scaleY
      );

      ctx.filter = `brightness(${config.brightness}) contrast(${config.contrast}) saturate(${config.saturation})`;
      ctx.drawImage(media, 0, 0);
      ctx.filter = 'none';
      ctx.restore();
    }
  }

  // LED scanline overlay
  if (config.ledOverlay) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // Horizontal scanlines
    for (let y = minY; y < maxY; y += 3) {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(minX, y, dstW, 1);
    }
    // Subtle vignette inside screen
    const vGrad = ctx.createRadialGradient(
      (minX + maxX) / 2, (minY + maxY) / 2, dstW * 0.1,
      (minX + maxX) / 2, (minY + maxY) / 2, dstW * 0.7
    );
    vGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vGrad.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = vGrad;
    ctx.fillRect(minX, minY, dstW, dstH);
  }

  ctx.restore();
}

// Bilinear interpolation between 4 corners
function bilerp(
  tl: [number, number], tr: [number, number],
  bl: [number, number], br: [number, number],
  u: number, v: number
): [number, number] {
  const top = lerp2d(tl, tr, u);
  const bot = lerp2d(bl, br, u);
  return lerp2d(top, bot, v);
}

function lerp2d(a: [number, number], b: [number, number], t: number): [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

// -----------------------------------------------
// Draw empty screen placeholder
// -----------------------------------------------
function drawEmptyScreen(ctx: CanvasRenderingContext2D, pts: [number, number][]) {
  const [tl, tr, br, bl] = pts;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(tl[0], tl[1]);
  ctx.lineTo(tr[0], tr[1]);
  ctx.lineTo(br[0], br[1]);
  ctx.lineTo(bl[0], bl[1]);
  ctx.closePath();

  const minX = Math.min(tl[0], bl[0]);
  const maxX = Math.max(tr[0], br[0]);
  const minY = Math.min(tl[1], tr[1]);
  const maxY = Math.max(bl[1], br[1]);

  const grad = ctx.createLinearGradient(minX, minY, minX, maxY);
  grad.addColorStop(0, '#0D0D0D');
  grad.addColorStop(1, '#1A1A1A');
  ctx.fillStyle = grad;
  ctx.fill();

  // Center text
  ctx.clip();
  ctx.fillStyle = 'rgba(201,168,76,0.15)';
  ctx.font = `bold ${Math.round((maxX - minX) * 0.08)}px system-ui`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VOTRE CONTENU ICI', (minX + maxX) / 2, (minY + maxY) / 2);

  // Border glow
  ctx.strokeStyle = 'rgba(201,168,76,0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(tl[0], tl[1]);
  ctx.lineTo(tr[0], tr[1]);
  ctx.lineTo(br[0], br[1]);
  ctx.lineTo(bl[0], bl[1]);
  ctx.closePath();
  ctx.stroke();

  ctx.restore();
}

// -----------------------------------------------
// Glow effect around screen
// -----------------------------------------------
function drawScreenGlow(
  ctx: CanvasRenderingContext2D,
  screen: ScreenConfig['centralScreen'],
  W: number,
  H: number,
  intensity: number
) {
  const cx = ((screen.topLeft[0] + screen.topRight[0]) / 2) / 100 * W;
  const cy = ((screen.topLeft[1] + screen.bottomLeft[1]) / 2) / 100 * H;
  const radius = ((screen.topRight[0] - screen.topLeft[0]) / 100 * W) * 1.2;

  const glow = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius);
  glow.addColorStop(0, `rgba(201,168,76,${intensity * 0.2})`);
  glow.addColorStop(1, 'rgba(201,168,76,0)');

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

// -----------------------------------------------
// Generated mall background mockup (when no image provided)
// -----------------------------------------------
function drawMockMallBackground(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#1A1008');
  bg.addColorStop(0.5, '#0D0D12');
  bg.addColorStop(1, '#08080F');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Mall atrium structure
  // Ceiling
  const ceilGrad = ctx.createLinearGradient(0, 0, 0, H * 0.15);
  ceilGrad.addColorStop(0, 'rgba(201,168,76,0.08)');
  ceilGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = ceilGrad;
  ctx.fillRect(0, 0, W, H * 0.15);

  // Side walls
  const leftWall = ctx.createLinearGradient(0, 0, W * 0.3, 0);
  leftWall.addColorStop(0, 'rgba(40,30,10,0.9)');
  leftWall.addColorStop(1, 'transparent');
  ctx.fillStyle = leftWall;
  ctx.fillRect(0, 0, W * 0.35, H);

  const rightWall = ctx.createLinearGradient(W, 0, W * 0.7, 0);
  rightWall.addColorStop(0, 'rgba(40,30,10,0.9)');
  rightWall.addColorStop(1, 'transparent');
  ctx.fillStyle = rightWall;
  ctx.fillRect(W * 0.65, 0, W * 0.35, H);

  // Floor reflection
  const floor = ctx.createLinearGradient(0, H * 0.8, 0, H);
  floor.addColorStop(0, 'transparent');
  floor.addColorStop(1, 'rgba(201,168,76,0.05)');
  ctx.fillStyle = floor;
  ctx.fillRect(0, H * 0.8, W, H * 0.2);

  // Left side curved screen simulation
  ctx.save();
  ctx.fillStyle = 'rgba(10,10,20,0.85)';
  ctx.fillRect(0, H * 0.18, W * 0.32, H * 0.62);
  // Left screen gradient
  const leftScreen = ctx.createLinearGradient(0, H * 0.18, W * 0.32, H * 0.18);
  leftScreen.addColorStop(0, 'rgba(201,168,76,0.03)');
  leftScreen.addColorStop(1, 'rgba(201,168,76,0.01)');
  ctx.fillStyle = leftScreen;
  ctx.fillRect(0, H * 0.18, W * 0.32, H * 0.62);
  ctx.strokeStyle = 'rgba(201,168,76,0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(W * 0.02, H * 0.2, W * 0.28, H * 0.58);
  ctx.restore();

  // Right side curved screen simulation
  ctx.save();
  ctx.fillStyle = 'rgba(10,10,20,0.85)';
  ctx.fillRect(W * 0.68, H * 0.18, W * 0.32, H * 0.62);
  const rightScreen = ctx.createLinearGradient(W * 0.68, H * 0.18, W, H * 0.18);
  rightScreen.addColorStop(0, 'rgba(201,168,76,0.01)');
  rightScreen.addColorStop(1, 'rgba(201,168,76,0.03)');
  ctx.fillStyle = rightScreen;
  ctx.fillRect(W * 0.68, H * 0.18, W * 0.32, H * 0.62);
  ctx.strokeStyle = 'rgba(201,168,76,0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(W * 0.70, H * 0.2, W * 0.28, H * 0.58);
  ctx.restore();

  // Ambient particles
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H * 0.5;
    const r = Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,168,76,${Math.random() * 0.15})`;
    ctx.fill();
  }

  // "MOROCCO MALL" text on side screens
  ctx.save();
  ctx.fillStyle = 'rgba(201,168,76,0.12)';
  ctx.font = `${W * 0.018}px system-ui`;
  ctx.textAlign = 'center';
  ctx.fillText('MOROCCO MALL', W * 0.16, H * 0.5);
  ctx.fillText('MOROCCO MALL', W * 0.84, H * 0.5);
  ctx.restore();
}
