"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PanZoomView = {
  /** コンテンツ左上の、コンテナ内での位置 (px) */
  x: number;
  y: number;
  /** コンテンツ 1px あたりの表示倍率 */
  scale: number;
};

type Size = { w: number; h: number };

/** 拡大の上限 (コンテナを覆う倍率に対する倍数) */
const MAX_ZOOM = 4;

/**
 * 固定サイズのコンテンツ (地図画像など) を、コンテナ内でドラッグ移動・ピンチ拡大する。
 *
 * - 1 本指 / マウスドラッグ: 移動
 * - 2 本指: ピンチで拡大縮小 (指の中点を基準)
 * - ホイール: 拡大縮小 (PC 向け)
 *
 * 縮小は「全体がコンテナに収まる倍率」まで、拡大は「コンテナを覆う倍率 x MAX_ZOOM」まで。
 * 初期表示はコンテナを覆う倍率で中央。ページ全体の拡大と競合しないよう、
 * コンテナには touch-action: none を付けること。
 */
export function usePanZoom(content: Size) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<Size | null>(null);
  const [view, setView] = useState<PanZoomView | null>(null);

  const minScale = container
    ? Math.min(container.w / content.w, container.h / content.h)
    : 1;
  const coverScale = container
    ? Math.max(container.w / content.w, container.h / content.h)
    : 1;
  const maxScale = coverScale * MAX_ZOOM;

  /** はみ出す軸は端が見えないように、収まる軸は中央に寄せる */
  const clamp = useCallback(
    (v: PanZoomView): PanZoomView => {
      if (!container) return v;
      const scale = Math.min(maxScale, Math.max(minScale, v.scale));
      const sw = content.w * scale;
      const sh = content.h * scale;
      const x =
        sw <= container.w
          ? (container.w - sw) / 2
          : Math.min(0, Math.max(container.w - sw, v.x));
      const y =
        sh <= container.h
          ? (container.h - sh) / 2
          : Math.min(0, Math.max(container.h - sh, v.y));
      return { x, y, scale };
    },
    [container, content.w, content.h, minScale, maxScale],
  );

  // コンテナのサイズを監視 (初回は覆う倍率で中央表示)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainer({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // コンテナサイズが変わったら、表示を範囲内に収め直す (レンダー中の state 調整)
  const [prevContainer, setPrevContainer] = useState(container);
  if (container !== prevContainer) {
    setPrevContainer(container);
    if (container) {
      const cover = Math.max(container.w / content.w, container.h / content.h);
      setView((v) =>
        clamp(
          v ?? {
            scale: cover,
            x: (container.w - content.w * cover) / 2,
            y: (container.h - content.h * cover) / 2,
          },
        ),
      );
    }
  }

  /** コンテナ内の点 (px, py) を固定したまま倍率を変える */
  const zoomAt = useCallback(
    (nextScale: number, px: number, py: number) => {
      setView((v) => {
        if (!v) return v;
        const s = Math.min(maxScale, Math.max(minScale, nextScale));
        return clamp({
          scale: s,
          x: px - ((px - v.x) * s) / v.scale,
          y: py - ((py - v.y) * s) / v.scale,
        });
      });
    },
    [clamp, minScale, maxScale],
  );

  /** 中央を基準に拡大縮小 (ボタン用) */
  const zoomBy = useCallback(
    (factor: number) => {
      if (!container || !view) return;
      zoomAt(view.scale * factor, container.w / 2, container.h / 2);
    },
    [container, view, zoomAt],
  );

  /** コンテンツ上の点 (cx, cy) をコンテナ中央に持ってくる */
  const centerOn = useCallback(
    (cx: number, cy: number) => {
      if (!container) return;
      setView((v) =>
        v
          ? clamp({
              ...v,
              x: container.w / 2 - cx * v.scale,
              y: container.h / 2 - cy * v.scale,
            })
          : v,
      );
    },
    [container, clamp],
  );

  // ポインター操作 (ドラッグ / ピンチ)
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);

  const localPoint = (e: React.PointerEvent) => {
    const r = containerRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // ピン等のボタンのタップはそのまま通す
    if ((e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, localPoint(e));
    pinch.current = null;
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const prev = pointers.current.get(e.pointerId);
      if (!prev) return;
      const p = localPoint(e);
      pointers.current.set(e.pointerId, p);
      const pts = [...pointers.current.values()];

      if (pts.length === 1) {
        setView((v) =>
          v ? clamp({ ...v, x: v.x + p.x - prev.x, y: v.y + p.y - prev.y }) : v,
        );
        return;
      }

      const [a, b] = pts;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (!pinch.current) {
        pinch.current = { dist, scale: view?.scale ?? 1 };
        return;
      }
      zoomAt(
        (pinch.current.scale * dist) / pinch.current.dist,
        (a.x + b.x) / 2,
        (a.y + b.y) / 2,
      );
    },
    [clamp, view?.scale, zoomAt],
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    pinch.current = null;
  }, []);

  // ホイールで拡大縮小 (preventDefault のため passive: false で登録)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      setView((v) => {
        if (!v) return v;
        const s = Math.min(
          maxScale,
          Math.max(minScale, v.scale * Math.exp(-e.deltaY * 0.002)),
        );
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        return clamp({
          scale: s,
          x: px - ((px - v.x) * s) / v.scale,
          y: py - ((py - v.y) * s) / v.scale,
        });
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [clamp, minScale, maxScale]);

  return {
    containerRef,
    view,
    canZoomIn: view !== null && view.scale < maxScale - 1e-6,
    canZoomOut: view !== null && view.scale > minScale + 1e-6,
    zoomBy,
    centerOn,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}
