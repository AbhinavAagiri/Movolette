import { useId } from 'react';
import type { CSSProperties } from 'react';
import type { ControlDef, ParamValue, SelectOption } from '../lib/motion/types';

export function formatValue(value: number, step = 1, unit?: string): string {
  let display: string;
  if (step < 1) {
    const decimals = step >= 0.1 ? 1 : step >= 0.05 ? 2 : 3;
    display = value.toFixed(decimals).replace(/\.?0+$/, '');
    if (display === '' || display === '-0') display = '0';
  } else {
    display = String(Math.round(value));
  }
  return unit ? `${display}${display.match(/[a-z%]$/i) ? ' ' : ' '}${unit}` : display;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  note?: string;
  onChange: (value: number) => void;
}

export function Slider({ label, value, min, max, step, unit, note, onChange }: SliderProps) {
  const id = useId();
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className="control">
      <div className="control__head">
        <label className="control__label" htmlFor={id}>
          {label}
        </label>
        <span className="control__value">{formatValue(value, step, unit)}</span>
      </div>
      <input
        id={id}
        className="slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ '--fill': `${percent}%` } as CSSProperties}
      />
      {note ? <p className="control__note">{note}</p> : null}
    </div>
  );
}

export function Segmented({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="control">
      <span className="control__label">{label}</span>
      <div className="segmented" role="group" aria-label={label}>
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              className={`segmented__item${active ? ' is-active' : ''}`}
              aria-pressed={active}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SelectControl({
  label,
  value,
  options,
  onChange,
  note,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  note?: string;
}) {
  const id = useId();
  return (
    <div className="control">
      <div className="control__head">
        <label className="control__label" htmlFor={id}>
          {label}
        </label>
      </div>
      <div className="select-wrap">
        <select id={id} className="select" value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg className="select-wrap__caret" viewBox="0 0 12 8" width="10" height="7" aria-hidden="true">
          <path d="m1 1.5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </div>
      {note ? <p className="control__note">{note}</p> : null}
    </div>
  );
}

export function SwitchControl({
  label,
  value,
  onChange,
  note,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  note?: string;
}) {
  return (
    <div className="control control--switch">
      <div>
        <span className="control__label" id={`switch-${label.replace(/\s+/g, '-')}`}>
          {label}
        </span>
        {note ? <p className="control__note">{note}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-labelledby={`switch-${label.replace(/\s+/g, '-')}`}
        className="mini-switch"
        onClick={() => onChange(!value)}
      >
        <span className="mini-switch__knob" aria-hidden="true" />
      </button>
    </div>
  );
}

export function TextControl({
  label,
  value,
  onChange,
  maxLength,
  multiline = false,
  note,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  multiline?: boolean;
  note?: string;
}) {
  const id = useId();
  return (
    <div className="control">
      <div className="control__head">
        <label className="control__label" htmlFor={id}>
          {label}
        </label>
        {maxLength ? <span className="control__value control__value--muted">{value.length}/{maxLength}</span> : null}
      </div>
      {multiline ? (
        <textarea
          id={id}
          className="text-input text-input--area"
          value={value}
          maxLength={maxLength}
          rows={3}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={id}
          className="text-input"
          value={value}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {note ? <p className="control__note">{note}</p> : null}
    </div>
  );
}

export function ControlRenderer({
  control,
  value,
  onChange,
}: {
  control: ControlDef;
  value: ParamValue | undefined;
  onChange: (value: ParamValue) => void;
}) {
  if (control.type === 'range') {
    return (
      <Slider
        label={control.label}
        value={typeof value === 'number' ? value : 0}
        min={control.min ?? 0}
        max={control.max ?? 100}
        step={control.step ?? 1}
        unit={control.unit}
        note={control.note}
        onChange={onChange}
      />
    );
  }
  if (control.type === 'segmented') {
    return (
      <Segmented
        label={control.label}
        value={String(value ?? control.options?.[0]?.value ?? '')}
        options={control.options ?? []}
        onChange={onChange}
      />
    );
  }
  if (control.type === 'select') {
    return (
      <SelectControl
        label={control.label}
        value={String(value ?? control.options?.[0]?.value ?? '')}
        options={control.options ?? []}
        onChange={onChange}
        note={control.note}
      />
    );
  }
  if (control.type === 'switch') {
    return (
      <SwitchControl
        label={control.label}
        value={value === true}
        onChange={onChange}
        note={control.note}
      />
    );
  }
  return (
    <TextControl
      label={control.label}
      value={typeof value === 'string' ? value : ''}
      onChange={onChange}
      maxLength={control.maxLength}
      multiline={control.type === 'textarea'}
      note={control.note}
    />
  );
}
