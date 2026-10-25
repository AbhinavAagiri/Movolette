import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { bezierCss, bezierLabel, EASINGS, getEasing } from '../lib/motion/easing';
import type { EasingValue } from '../lib/motion/types';

const W = 240;
const H = 200;
const PAD = 20;
const Y_MIN = -0.4;
const Y_MAX = 1.4;

function px(x: number): number {
  return PAD + x * (W - PAD * 2);
}

function py(y: number): number {
  return PAD + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * (H - PAD * 2);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function EasingEditor({
  value,
  onChange,
  compact = false,
}: {
  value: EasingValue;
  onChange: (easing: EasingValue) => void;
  compact?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<0 | 1 | null>(null);
  const [x1, y1, x2, y2] = value.bezier;

  const updatePoint = (index: 0 | 1, rawX: number, rawY: number) => {
    const nextX = round(clamp(rawX, 0, 1));
    const nextY = round(clamp(rawY, -0.4, 1.4));
    const bezier: [number, number, number, number] = index === 0 ? [nextX, nextY, x2, y2] : [x1, y1, nextX, nextY];
    onChange({ id: 'custom', bezier });
  };

  useEffect(() => {
    if (dragging === null) return;
    const onMove = (event: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const xPix = ((event.clientX - rect.left) / rect.width) * W;
      const yPix = ((event.clientY - rect.top) / rect.height) * H;
      const x = (xPix - PAD) / (W - PAD * 2);
      const y = Y_MAX - ((yPix - PAD) / (H - PAD * 2)) * (Y_MAX - Y_MIN);
      updatePoint(dragging, x, y);
    };
    const onUp = () => setDragging(null);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, x1, y1, x2, y2]);

  const startDrag = (index: 0 | 1) => (event: ReactPointerEvent<SVGCircleElement>) => {
    event.preventDefault();
    setDragging(index);
  };

  const onKeyDown = (index: 0 | 1) => (event: ReactKeyboardEvent<SVGCircleElement>) => {
    const amount = event.shiftKey ? 0.1 : 0.02;
    const pointX = index === 0 ? x1 : x2;
    const pointY = index === 0 ? y1 : y2;
    let nextX = pointX;
    let nextY = pointY;
    if (event.key === 'ArrowLeft') nextX -= amount;
    else if (event.key === 'ArrowRight') nextX += amount;
    else if (event.key === 'ArrowUp') nextY += amount;
    else if (event.key === 'ArrowDown') nextY -= amount;
    else return;
    event.preventDefault();
    updatePoint(index, nextX, nextY);
  };

  const selected = EASINGS.some((easing) => easing.id === value.id && easing.id !== 'custom')
    ? value.id
    : 'custom';

  const updateNumeric = (index: number, raw: string) => {
    const numeric = Number(raw);
    if (!Number.isFinite(numeric)) return;
    const next = [...value.bezier] as [number, number, number, number];
    next[index] = round(numeric);
    onChange({ id: 'custom', bezier: next });
  };

  const curve = `M ${px(0)} ${py(0)} C ${px(x1)} ${py(y1)}, ${px(x2)} ${py(y2)}, ${px(1)} ${py(1)}`;

  return (
    <div className={`easing${compact ? ' easing--compact' : ''}`}>
      <div className="control__head">
        <span className="control__label">Easing</span>
        <span className="control__value">{bezierLabel(value.bezier)}</span>
      </div>

      <div className="select-wrap">
        <select
          className="select"
          aria-label="Easing preset"
          value={selected}
          onChange={(event) => {
            const id = event.target.value;
            const found = EASINGS.find((easing) => easing.id === id);
            if (!found) return;
            if (id === 'custom') {
              onChange({ id: 'custom', bezier: [...value.bezier] });
            } else {
              onChange({ id: found.id, bezier: [...found.bezier] });
            }
          }}
        >
          {EASINGS.map((easing) => (
            <option key={easing.id} value={easing.id}>
              {easing.label}
              {easing.id === 'custom' ? '' : ` — ${bezierLabel(easing.bezier)}`}
            </option>
          ))}
        </select>
        <svg className="select-wrap__caret" viewBox="0 0 12 8" width="10" height="7" aria-hidden="true">
          <path d="m1 1.5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </div>

      <div className="easing__plot-wrap">
        <p className="easing__caption mono">{getEasing(selected).note === 'Your curve' ? 'CUSTOM CURVE' : getEasing(selected).note?.toUpperCase()}</p>
        <svg
          ref={svgRef}
          className="easing__plot"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Easing curve, cubic-bezier ${bezierLabel(value.bezier)}`}
        >
          <rect x={PAD} y={PAD} width={W - PAD * 2} height={H - PAD * 2} className="easing__frame" />
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <g key={tick}>
              <line x1={px(tick)} y1={py(0)} x2={px(tick)} y2={py(1)} className="easing__grid" />
              <line x1={px(0)} y1={py(tick)} x2={px(1)} y2={py(tick)} className="easing__grid" />
            </g>
          ))}
          <line x1={px(0)} y1={py(0)} x2={px(1)} y2={py(1)} className="easing__diagonal" />
          <line x1={px(0)} y1={py(0)} x2={px(x1)} y2={py(y1)} className="easing__handle-line" />
          <line x1={px(1)} y1={py(1)} x2={px(x2)} y2={py(y2)} className="easing__handle-line" />
          <path d={curve} className="easing__curve" />
          <circle
            cx={px(x1)}
            cy={py(y1)}
            r="7"
            className="easing__handle"
            tabIndex={0}
            role="slider"
            aria-label="First control point"
            aria-valuemin={-1}
            aria-valuemax={1}
            aria-valuenow={x1}
            aria-valuetext={`x ${x1}, y ${y1}`}
            onPointerDown={startDrag(0)}
            onKeyDown={onKeyDown(0)}
          />
          <circle
            cx={px(x2)}
            cy={py(y2)}
            r="7"
            className="easing__handle easing__handle--two"
            tabIndex={0}
            role="slider"
            aria-label="Second control point"
            aria-valuemin={-1}
            aria-valuemax={1}
            aria-valuenow={x2}
            aria-valuetext={`x ${x2}, y ${y2}`}
            onPointerDown={startDrag(1)}
            onKeyDown={onKeyDown(1)}
          />
        </svg>
        <div className="easing__sample" aria-hidden="true">
          <div
            key={`${value.bezier.join('-')}`}
            className="easing__sample-dot"
            style={{ animationTimingFunction: bezierCss(value.bezier) }}
          />
        </div>
      </div>

      <div className="easing__numbers">
        {(['x1', 'y1', 'x2', 'y2'] as const).map((label, index) => (
          <label className="easing__number" key={label}>
            <span>{label}</span>
            <input
              type="number"
              step="0.01"
              value={value.bezier[index]}
              onChange={(event) => updateNumeric(index, event.target.value)}
              aria-label={`Cubic-bezier ${label}`}
            />
          </label>
        ))}
      </div>
      <p className="easing__css mono">cubic-bezier({bezierLabel(value.bezier)})</p>
    </div>
  );
}
