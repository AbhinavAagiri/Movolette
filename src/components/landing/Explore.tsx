import { useMemo, useState } from 'react';
import { FAMILIES, PRESETS, defaultDocument, getPreset } from '../../lib/motion/presets';
import { getEasing } from '../../lib/motion/easing';
import { studioHash } from '../../lib/router';
import { PreviewFrame } from '../PreviewFrame';
import { Reveal } from '../Reveal';
import type { FamilyId, Preset } from '../../lib/motion/types';

type Filter = 'all' | FamilyId;

function presetMeta(preset: Preset): string {
  if (preset.family === 'heroes') return '4-step sequence';
  const duration = preset.controls.find((control) => control.key === 'duration');
  const value = duration ? preset.defaults[duration.key] : null;
  if (typeof value === 'number') return `${value} ms`;
  const wait = preset.controls.find((control) => control.key === 'wait');
  const waitValue = wait ? preset.defaults[wait.key] : null;
  if (typeof waitValue === 'number') return `${waitValue} ms`;
  return 'CSS + JS';
}

export function Explore() {
  const [filter, setFilter] = useState<Filter>('all');
  const [activeId, setActiveId] = useState('btn-lift');
  const [replayKey, setReplayKey] = useState(0);

  const filtered = useMemo(
    () => (filter === 'all' ? PRESETS : PRESETS.filter((preset) => preset.family === filter)),
    [filter],
  );
  const active = getPreset(activeId) ?? filtered[0] ?? PRESETS[0];
  const doc = useMemo(() => defaultDocument(active.id), [active.id]);
  const activeFamily = FAMILIES.find((family) => family.id === active.family);
  const easing = getEasing(active.easing);

  const chooseFilter = (next: Filter) => {
    setFilter(next);
    const first = next === 'all' ? PRESETS[0] : PRESETS.find((preset) => preset.family === next);
    if (first) {
      setActiveId(first.id);
      setReplayKey((value) => value + 1);
    }
  };

  return (
    <section className="explore" id="explore" aria-labelledby="explore-title">
      <div className="container">
        <div className="section-head">
          <Reveal>
            <p className="label">The library</p>
            <h2 className="h2 explore__title" id="explore-title">
              A little motion
              <br />
              goes a long way.
            </h2>
          </Reveal>
          <Reveal className="section-head__aside" delay={90}>
            <p>
              Every preset is a working animation, not a thumbnail. Hover an entry to watch it play, then
              open it in the studio to make it yours.
            </p>
            <a className="text-link" href={studioHash()}>
              Open the full library
            </a>
          </Reveal>
        </div>

        <Reveal
          className="explore__filters"
          role="group"
          aria-label="Filter presets by category"
          delay={120}
          shift="sm"
        >
          <button
            type="button"
            className={`filter filter--all${filter === 'all' ? ' is-active' : ''}`}
            aria-pressed={filter === 'all'}
            onClick={() => chooseFilter('all')}
          >
            All <span>{PRESETS.length}</span>
          </button>
          {FAMILIES.map((family) => {
            const count = PRESETS.filter((preset) => preset.family === family.id).length;
            return (
              <button
                key={family.id}
                type="button"
                className={`filter${filter === family.id ? ' is-active' : ''}`}
                aria-pressed={filter === family.id}
                onClick={() => chooseFilter(family.id)}
              >
                {family.label} <span>{count}</span>
              </button>
            );
          })}
        </Reveal>

        <div className="explore__grid">
          <div className="explore__index">
            <div className="explore__index-head">
              <span className="label">{filter === 'all' ? 'All presets' : FAMILIES.find((f) => f.id === filter)?.label}</span>
              <span className="mono">{filtered.length} animations</span>
            </div>
            <ul className="preset-list">
              {filtered.map((preset, index) => {
                const family = FAMILIES.find((entry) => entry.id === preset.family);
                const current = active.id === preset.id;
                return (
                  <Reveal
                    as="li"
                    key={preset.id}
                    delay={Math.min(index, 8) * 45}
                    shift="sm"
                  >
                    <button
                      type="button"
                      className={`preset-row${current ? ' is-active' : ''}`}
                      onMouseEnter={() => {
                        setActiveId(preset.id);
                        setReplayKey((value) => value + 1);
                      }}
                      onFocus={() => {
                        setActiveId(preset.id);
                        setReplayKey((value) => value + 1);
                      }}
                      onClick={() => {
                        window.location.hash = studioHash({ preset: preset.id });
                      }}
                      aria-label={`Open ${preset.name} in the studio`}
                    >
                      <span className="preset-row__dot" aria-hidden="true">
                        <span />
                      </span>
                      <span className="preset-row__name">
                        <strong>{preset.name}</strong>
                        <span>{family?.label ?? 'Preset'}</span>
                      </span>
                      <span className="preset-row__meta mono">{presetMeta(preset)}</span>
                      <span className="preset-row__arrow" aria-hidden="true">
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="none">
                          <path d="M3 11 11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </ul>
          </div>

          <Reveal className="explore__stage" delay={140} shift="sm">
            <div className="explore-stage">
              <div className="explore-stage__bar">
                <div className="explore-stage__id">
                  <span className="explore-stage__live" aria-hidden="true" />
                  <span className="mono">LIVE PREVIEW</span>
                </div>
                <span className="explore-stage__name mono">
                  {activeFamily?.short.toUpperCase()} / {active.name.toUpperCase()}
                </span>
                <button
                  type="button"
                  className="explore-stage__replay"
                  onClick={() => setReplayKey((value) => value + 1)}
                >
                  <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
                    <path
                      d="M8 3a5 5 0 1 1-4.9 4M8 3v4H4"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Replay
                </button>
              </div>
              <div className="explore-stage__canvas">
                <PreviewFrame
                  doc={doc}
                  replayKey={replayKey}
                  title={`${active.name} animation preview`}
                  demo
                  style={{ height: '100%' }}
                />
              </div>
              <div className="explore-stage__foot">
                <div className="explore-stage__copy">
                  <p className="explore-stage__title">{active.name}</p>
                  <p>{active.blurb}</p>
                </div>
                <div className="explore-stage__facts">
                  <span className="mono">{easing.label.toUpperCase()}</span>
                  <span className="mono">{presetMeta(active)}</span>
                </div>
                <a className="btn btn--sm" href={studioHash({ preset: active.id })}>
                  Open in Studio
                </a>
              </div>
            </div>
            <p className="explore__hint mono">
              HOVER TO PREVIEW · CLICK TO OPEN · {filtered.length} IN THIS SET
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
