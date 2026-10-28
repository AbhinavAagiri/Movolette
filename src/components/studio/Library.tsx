import { memo, useMemo, useState } from 'react';
import { FAMILIES, presetsByFamily } from '../../lib/motion/presets';
import type { Preset } from '../../lib/motion/types';
import type { SavedDocument } from '../../lib/storage';
import { FamilyGlyph } from './FamilyGlyph';

const PLANNED = [
  'Tabs',
  'Accordions',
  'Carousels',
  'Feature grids',
  'Statistics',
  'Pricing',
  'Testimonials',
  'FAQ',
  'Call-to-action',
];

function relativeTime(timestamp: number): string {
  const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function matches(preset: Preset, query: string): boolean {
  if (!query) return true;
  const family = FAMILIES.find((item) => item.id === preset.family);
  const haystack = `${preset.name} ${preset.blurb} ${family?.label ?? ''} ${family?.short ?? ''}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

interface LibraryProps {
  activeId: string;
  onSelect: (presetId: string) => void;
  saves: SavedDocument[];
  onLoadSave: (doc: SavedDocument) => void;
  onDeleteSave: (presetId: string) => void;
}

/*
 * The library holds every preset heading. Its props only change when the
 * selected preset or the saved list changes, so it can skip the renders that
 * a slider drag would otherwise cause.
 */
export const Library = memo(function Library({
  activeId,
  onSelect,
  saves,
  onLoadSave,
  onDeleteSave,
}: LibraryProps) {
  const [query, setQuery] = useState('');
  const groups = useMemo(
    () =>
      FAMILIES.map((family) => ({
        family,
        presets: presetsByFamily(family.id).filter((preset) => matches(preset, query)),
      })).filter((group) => group.presets.length > 0),
    [query],
  );
  const count = groups.reduce((total, group) => total + group.presets.length, 0);

  return (
    <div className="library">
      <div className="library__head">
        <div className="panel-label">
          <span className="label">Preset library</span>
          <span className="mono">{count}</span>
        </div>
        <div className="search">
          <svg className="search__icon" viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="4.4" stroke="currentColor" strokeWidth="1.3" />
            <path d="m10.4 10.4 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            className="search__input"
            type="search"
            placeholder="Search presets"
            aria-label="Search animation presets"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query ? (
            <button type="button" className="search__clear" onClick={() => setQuery('')} aria-label="Clear search">
              ×
            </button>
          ) : null}
        </div>
      </div>

      {saves.length > 0 ? (
        <details className="saved">
          <summary className="saved__summary">
            <span className="label">Saved in this browser</span>
            <span className="saved__count mono">{saves.length}</span>
          </summary>
          <ul className="saved__list">
            {saves.map((save) => (
              <li key={save.presetId}>
                <button type="button" className="saved__load" onClick={() => onLoadSave(save)}>
                  <span className="saved__name">{save.name}</span>
                  <span className="saved__time mono">{relativeTime(save.savedAt)}</span>
                </button>
                <button
                  type="button"
                  className="saved__delete"
                  aria-label={`Delete local save for ${save.name}`}
                  onClick={() => onDeleteSave(save.presetId)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      <div className="library__scroll">
        {groups.map((group) => (
          <section className="library-group" key={group.family.id} aria-labelledby={`lib-${group.family.id}`}>
            <div className="library-group__head" id={`lib-${group.family.id}`}>
              <span className="library-group__glyph">
                <FamilyGlyph family={group.family.id} />
              </span>
              <span className="label library-group__title">{group.family.label}</span>
              <span className="mono library-group__count">{group.presets.length}</span>
            </div>
            <ul>
              {group.presets.map((preset) => {
                const active = preset.id === activeId;
                return (
                  <li key={preset.id}>
                    <button
                      type="button"
                      className={`library-item${active ? ' is-active' : ''}`}
                      onClick={() => onSelect(preset.id)}
                      aria-current={active ? 'true' : undefined}
                    >
                      <span className="library-item__glyph" aria-hidden="true">
                        <FamilyGlyph family={preset.family} />
                      </span>
                      <span className="library-item__text">
                        <span className="library-item__name">{preset.name}</span>
                        <span className="library-item__blurb">{preset.blurb}</span>
                      </span>
                      {preset.family === 'heroes' ? <span className="library-item__tag mono">SEQ</span> : null}
                      {active ? <span className="library-item__active" aria-hidden="true" /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        {groups.length === 0 ? (
          <div className="library-empty">
            <p className="h3">Nothing matches &ldquo;{query}&rdquo;.</p>
            <p>Try a component name, a family, or a word like &ldquo;toast&rdquo;.</p>
            <button type="button" className="text-link" onClick={() => setQuery('')}>
              Clear search
            </button>
          </div>
        ) : null}

        <section className="planned" aria-labelledby="planned-title">
          <div className="planned__head">
            <span className="label" id="planned-title">
              Planned
            </span>
            <span className="mono">NOT IN THIS RELEASE</span>
          </div>
          <p className="planned__copy">
            These components are on the studio&rsquo;s roadmap. They are not selectable yet, so nothing here
            pretends to work.
          </p>
          <ul className="planned__tags">
            {PLANNED.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <div className="library__footnote">
          <span className="mono">MOTION PRESETS / 2026</span>
          <button
            type="button"
            className="library__top"
            onClick={() => {
              const scroller = document.querySelector('.library__scroll');
              scroller?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Back to top
          </button>
        </div>
      </div>
    </div>
  );
});
