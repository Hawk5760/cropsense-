'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface Vector2D {
  x: number;
  y: number;
}

interface Branch {
  position: Vector2D;
  stw: number; // strokeWidth
  gen: number; // generation
  alive: boolean;
  age: number;
  angle: number;
  speed: Vector2D;
  index: number;
  maxlife: number;
  proba1: number;
  proba2: number;
  proba3: number;
  proba4: number;
  deviation: number;
}

interface Tree {
  branches: Branch[];
  start: Vector2D;
  coeff: number;
  teinte: number; // base hue
  index: number;
  proba1: number;
  proba2: number;
  proba3: number;
  proba4: number;
}

export interface SimpleTreeProps {
  className?: string;
  showDefaultOverlay?: boolean;
  hintText?: string;
  baseHueRange?: [number, number];
  backgroundColor?: string;
  growthSpeed?: number;
  children?: React.ReactNode;
}

export function SimpleTree({
  className,
  showDefaultOverlay = true,
  hintText = 'Click to grow a new tree',
  baseHueRange = [20, 40],
  backgroundColor,
  growthSpeed = 1,
  children,
}: SimpleTreeProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const treeRef = useRef<Tree | null>(null);
  const hasStartedRef = useRef(false);

  const [hueMin, hueMax] = baseHueRange;

  // Balanced constants for elegant simplicity
  const maxlife = 18;

  const createVector = (x: number, y: number): Vector2D => ({ x, y });

  const random = (min?: number, max?: number): number => {
    if (min === undefined) return Math.random();
    if (max === undefined) return Math.random() * min;
    return min + Math.random() * (max - min);
  };

  const clearScheduledFrame = useCallback(() => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (animationRef.current !== undefined) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  }, []);

  const hsbToRgb = (h: number, s: number, b: number, a = 1): string => {
    h = (((h % 360) + 360) % 360) / 360;
    s = Math.max(0, Math.min(255, s)) / 255;
    b = Math.max(0, Math.min(255, b)) / 255;

    const c = b * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = b - c;

    let r = 0,
      g = 0,
      bl = 0;

    if (0 <= h && h < 1 / 6) {
      r = c;
      g = x;
      bl = 0;
    } else if (1 / 6 <= h && h < 2 / 6) {
      r = x;
      g = c;
      bl = 0;
    } else if (2 / 6 <= h && h < 3 / 6) {
      r = 0;
      g = c;
      bl = x;
    } else if (3 / 6 <= h && h < 4 / 6) {
      r = 0;
      g = x;
      bl = c;
    } else if (4 / 6 <= h && h < 5 / 6) {
      r = x;
      g = 0;
      bl = c;
    } else if (5 / 6 <= h && h < 1) {
      r = c;
      g = 0;
      bl = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    bl = Math.round((bl + m) * 255);

    return `rgba(${r}, ${g}, ${bl}, ${a})`;
  };

  const createTree = useCallback(
    (width: number, height: number): Tree => {
      const scale = Math.max(0.55, Math.min(1.05, height / 620));
      const x = width / 2;
      const y = height * 0.86;
      const start = createVector(x, y);

      const tree: Tree = {
        branches: [],
        start,
        coeff: Math.max(0.65, Math.min(1.15, start.y / Math.max(120, height - 80))),
        teinte: random(hueMin, hueMax),
        index: 0,
        proba1: random(0.76, 0.95),
        proba2: random(0.76, 0.95),
        proba3: random(0.45, 0.65),
        proba4: random(0.45, 0.65),
      };

      const trunk: Branch = {
        position: { ...start },
        stw: 22 * scale * Math.sqrt(start.y / Math.max(1, height)),
        gen: 1,
        alive: true,
        age: 0,
        angle: 0,
        speed: createVector(0, -3.1 * scale),
        index: 0,
        maxlife: maxlife * random(0.75, 1.15),
        proba1: tree.proba1,
        proba2: tree.proba2,
        proba3: tree.proba3,
        proba4: tree.proba4,
        deviation: random(0.5, 0.78),
      };

      tree.branches.push(trunk);
      return tree;
    },
    [hueMin, hueMax]
  );

  const createBranch = (
    start: Vector2D,
    stw: number,
    angle: number,
    gen: number,
    index: number,
    tree: Tree,
    speedY: number
  ): Branch => ({
    position: { ...start },
    stw,
    gen,
    alive: true,
    age: 0,
    angle,
    speed: createVector(0, speedY),
    index,
    maxlife: maxlife * random(0.5, 1.0),
    proba1: tree.proba1,
    proba2: tree.proba2,
    proba3: tree.proba3,
    proba4: tree.proba4,
    deviation: random(0.5, 0.8),
  });

  const growBranch = (branch: Branch, tree: Tree, speedY: number) => {
    if (!branch.alive) return;

    branch.age++;

    if (branch.age >= Math.floor(branch.maxlife / branch.gen) || random(1) < 0.025 * branch.gen) {
      branch.alive = false;

      if (branch.stw > 0.4 && branch.gen < 5) {
        const brs = tree.branches;
        const pos = createVector(branch.position.x, branch.position.y);

        if (random(1) < branch.proba1 / Math.pow(branch.gen, 0.9)) {
          brs.push(
            createBranch(
              pos,
              branch.stw * random(0.5, 0.75),
              branch.angle + random(0.6, 1.0) * branch.deviation,
              branch.gen + 0.2,
              branch.index,
              tree,
              speedY
            )
          );
        }

        if (random(1) < branch.proba2 / Math.pow(branch.gen, 0.9)) {
          brs.push(
            createBranch(
              pos,
              branch.stw * random(0.5, 0.75),
              branch.angle - random(0.6, 1.0) * branch.deviation,
              branch.gen + 0.2,
              branch.index,
              tree,
              speedY
            )
          );
        }

        if (branch.gen < 3 && random(1) < branch.proba3 / Math.pow(branch.gen, 1.1)) {
          brs.push(
            createBranch(
              pos,
              branch.stw * random(0.6, 0.8),
              branch.angle + random(0.3, 0.7) * branch.deviation,
              branch.gen + 0.15,
              branch.index,
              tree,
              speedY
            )
          );
        }

        if (branch.gen < 3 && random(1) < branch.proba4 / Math.pow(branch.gen, 1.1)) {
          brs.push(
            createBranch(
              pos,
              branch.stw * random(0.6, 0.8),
              branch.angle - random(0.3, 0.7) * branch.deviation,
              branch.gen + 0.15,
              branch.index,
              tree,
              speedY
            )
          );
        }
      }
    } else {
      branch.speed.x += random(-0.15, 0.15);
    }
  };

  const displayBranch = (branch: Branch, tree: Tree, ctx: CanvasRenderingContext2D) => {
    const c = tree.coeff;
    const st = tree.start;
    const x0 = branch.position.x;
    const y0 = branch.position.y;

    branch.position.x +=
      -branch.speed.x * Math.cos(branch.angle) + branch.speed.y * Math.sin(branch.angle);
    branch.position.y +=
      branch.speed.x * Math.sin(branch.angle) + branch.speed.y * Math.cos(branch.angle);

    // Subtle ground reflection shadow
    const shadowColor = hsbToRgb(tree.teinte + branch.age + 10 * branch.gen, 15, 15, 0.06);
    ctx.strokeStyle = shadowColor;
    const shadowWidth = branch.stw * 1.2 - (branch.age / branch.maxlife) * (branch.stw * 0.4);
    ctx.lineWidth = Math.max(0.5, shadowWidth);

    const dis = 0.008 * Math.pow(Math.abs(st.y - y0), 1.3);

    ctx.beginPath();
    ctx.moveTo(x0 + dis, 2 * st.y - y0 + dis);
    ctx.lineTo(branch.position.x + dis, 2 * st.y - branch.position.y + dis);
    ctx.stroke();

    // Light accent
    const lightHue = tree.teinte + branch.age + 18 * branch.gen;
    const lightColor = hsbToRgb(lightHue, 120 * c, 200 + 12 * branch.gen, (20 * c) / 100);
    ctx.strokeStyle = lightColor;
    const lightWidth = branch.stw * 0.8 - (branch.age / branch.maxlife) * (branch.stw * 0.3);
    ctx.lineWidth = Math.max(0.3, lightWidth);

    ctx.beginPath();
    ctx.moveTo(x0 + 0.12 * branch.stw, y0);
    ctx.lineTo(branch.position.x + 0.12 * branch.stw, branch.position.y);
    ctx.stroke();

    // Main branch with organic tones
    const mainHue = tree.teinte + branch.age + 15 * branch.gen;
    const mainSat = Math.min(180, 100 * c + 15 * branch.gen);
    const mainBright = Math.min(150, 70 + 12 * branch.gen);
    const mainColor = hsbToRgb(mainHue, mainSat, mainBright, (26 * c) / 100);
    ctx.strokeStyle = mainColor;
    const mainWidth = branch.stw - (branch.age / branch.maxlife) * (branch.stw * 0.4);
    ctx.lineWidth = Math.max(0.25, mainWidth);

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(branch.position.x, branch.position.y);
    ctx.stroke();

    // Subtle highlight for main trunk & primary boughs
    if (branch.gen < 2) {
      const highlightColor = hsbToRgb(mainHue + 8, mainSat * 0.5, mainBright + 30, (14 * c) / 100);
      ctx.strokeStyle = highlightColor;
      ctx.lineWidth = Math.max(0.1, mainWidth * 0.25);

      ctx.beginPath();
      ctx.moveTo(x0 - 0.08 * branch.stw, y0);
      ctx.lineTo(branch.position.x - 0.08 * branch.stw, branch.position.y);
      ctx.stroke();
    }
  };

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return false;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const cssWidth = container.clientWidth || window.innerWidth;
    const cssHeight = container.clientHeight || window.innerHeight;
    if (cssWidth <= 0 || cssHeight <= 0) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clean warm background
    ctx.fillStyle = backgroundColor ?? hsbToRgb(42, 12, 248);
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    // Subtle radial vignette
    const gradient = ctx.createRadialGradient(
      cssWidth / 2,
      cssHeight / 2,
      0,
      cssWidth / 2,
      cssHeight / 2,
      Math.max(cssWidth, cssHeight) * 0.85
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(45,58,46,0.035)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    treeRef.current = createTree(cssWidth, cssHeight);
    return true;
  }, [backgroundColor, createTree]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const tree = treeRef.current;
    if (!canvas || !container || !tree) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cssHeight = container.clientHeight || window.innerHeight;
    const scale = Math.max(0.55, Math.min(1.05, cssHeight / 620));
    const speedY = -3.1 * scale;
    const stepsPerFrame = Math.max(1, Math.round(growthSpeed));

    let hasAliveBranches = false;

    for (let step = 0; step < stepsPerFrame; step++) {
      let stepAlive = false;
      const currentCount = tree.branches.length;
      for (let i = 0; i < currentCount; i++) {
        const branch = tree.branches[i];
        if (branch.alive) {
          stepAlive = true;
          growBranch(branch, tree, speedY);
          displayBranch(branch, tree, ctx);
        }
      }
      hasAliveBranches = stepAlive;
      if (!stepAlive) break;
    }

    if (hasAliveBranches) {
      if (growthSpeed >= 2) {
        animationRef.current = requestAnimationFrame(draw);
      } else {
        timeoutRef.current = setTimeout(() => {
          animationRef.current = requestAnimationFrame(draw);
        }, 1000 / 90);
      }
    }
  }, [growthSpeed]);

  const regrow = useCallback(() => {
    clearScheduledFrame();
    if (setup()) {
      hasStartedRef.current = true;
      draw();
    }
  }, [clearScheduledFrame, setup, draw]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Start growing when visible in viewport (or immediately if IntersectionObserver unavailable)
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting) && !hasStartedRef.current) {
            regrow();
            observer?.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(container);
    } else {
      regrow();
    }

    let lastWidth = container.clientWidth;
    let lastHeight = container.clientHeight;
    let resizeDebounce: ReturnType<typeof setTimeout> | undefined;

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (Math.abs(w - lastWidth) < 24 && Math.abs(h - lastHeight) < 24) return;
      lastWidth = w;
      lastHeight = h;
      if (resizeDebounce) clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        if (hasStartedRef.current) {
          regrow();
        }
      }, 180);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', handleResize);
      if (resizeDebounce) clearTimeout(resizeDebounce);
      clearScheduledFrame();
    };
  }, [regrow, clearScheduledFrame]);

  return (
    <div
      ref={containerRef}
      data-testid="simple-growth-tree"
      className={cn('relative w-full h-screen overflow-hidden', className)}
    >
      <canvas
        ref={canvasRef}
        data-testid="simple-growth-tree-canvas"
        aria-label={hintText}
        className="absolute inset-0 block w-full h-full cursor-pointer"
        onClick={regrow}
      />

      {showDefaultOverlay && (
        <>
          <div className="pointer-events-none absolute bottom-6 right-6 text-xs text-black/30 font-light">
            {hintText}
          </div>
          <div className="pointer-events-none absolute top-6 left-6 text-black/30">
            <h1 className="text-2xl font-extralight tracking-wider">Simple Tree</h1>
            <p className="text-sm font-light mt-1 opacity-80">Elegant growth</p>
          </div>
        </>
      )}

      {children}
    </div>
  );
}
