import { useState } from 'react';
import { HERO_EASING_OPTIONS, HERO_STEP_LABELS, HERO_TEMPLATES, heroDuration, stepStarts } from '../../lib/motion/heroes';
import { bezierCss, getEasing } from '../../lib/motion/easing';
import { Slider, SelectControl, TextControl } from '../controls';
import type { HeroContent, HeroState, HeroStepId, HeroTemplateId } from '../../lib/motion/types';

type HeroTab = 'content' | 'sequence';

const LIMITS: Record<keyof HeroContent, number> = {
  brand: 32,
  headline: 130,
  body: 320,
  primary: 34,
  secondary: 34,
  note: 64,
  cardTitle: 40,
  cardMetric: 18,
  cardMeta: 100,
  itemOne: 48,
  itemTwo: 48,
  itemThree: 48,
};

const FIELD_LABELS: Record<keyof HeroContent, string> = {
  brand: 'Brand name',
  headline: 'Headline',
  body: 'Description',
  primary: 'Primary button',
  secondary: 'Secondary button',
  note: 'Small label',
  cardTitle: 'Card title',
  cardMetric: 'Card metric',
  cardMeta: 'Card note',
  itemOne: 'Card one',
  itemTwo: 'Card two',
  itemThree: 'Card three',
};

interface HeroComposerProps {
  template: HeroTemplateId;
  hero: HeroState;
  onChange: (hero: HeroState) => void;
  onTemplateChange: (template: HeroTemplateId) => void;
  onReplay: () => void;
}

export function HeroComposer({ template, hero, onChange, onTemplateChange, onReplay }: HeroComposerProps) {
  const [tab, setTab] = useState<HeroTab>('content');
  const [selectedId, setSelectedId] = useState<HeroStepId>(hero.steps[0]?.id ?? 'headline');
  const starts = stepStarts(hero.steps);
  const total = Math.max(1, heroDuration(hero.steps));
  const selectedIndex = Math.max(
    0,
    hero.steps.findIndex((step) => step.id === selectedId),
  );
  const selected = hero.steps[selectedIndex];

  const updateContent = <K extends keyof HeroContent>(key: K, value: HeroContent[K]) => {
    onChange({ ...hero, content: { ...hero.content, [key]: value } });
  };

  const updateStep = (id: HeroStepId, patch: Partial<(typeof hero.steps)[number]>) => {
    onChange({
      ...hero,
      steps: hero.steps.map((step) => (step.id === id ? { ...step, ...patch } : step)),
    });
  };

  const moveStep = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= hero.steps.length) return;
    const next = [...hero.steps];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    onChange({ ...hero, steps: next });
  };

  const showCardFields = template !== 'hero-gallery';
  const showGalleryFields = template === 'hero-gallery';

  return (
    <div className="composer">
      <div className="composer__intro">
        <p className="label">Hero composer</p>
        <p className="composer__blurb">
          A predefined hero, sequenced in four parts. Edit the copy, then shape the entrance.
        </p>
      </div>

      <div className="composer__templates">
        <span className="control__label">Template</span>
        <div className="segmented segmented--stacked" role="group" aria-label="Hero template">
          {HERO_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              className={`segmented__item${template === tpl.id ? ' is-active' : ''}`}
              aria-pressed={template === tpl.id}
              onClick={() => onTemplateChange(tpl.id)}
            >
              {tpl.id === 'hero-centered' ? 'Centered' : tpl.id === 'hero-split' ? 'Split' : 'Gallery'}
            </button>
          ))}
        </div>
      </div>

      <div className="inspector-tabs" role="tablist" aria-label="Hero composer sections">
        <button
          type="button"
          role="tab"
          id="hero-tab-content"
          aria-selected={tab === 'content'}
          aria-controls="hero-panel-content"
          className={`inspector-tab${tab === 'content' ? ' is-active' : ''}`}
          onClick={() => setTab('content')}
        >
          Content
        </button>
        <button
          type="button"
          role="tab"
          id="hero-tab-sequence"
          aria-selected={tab === 'sequence'}
          aria-controls="hero-panel-sequence"
          className={`inspector-tab${tab === 'sequence' ? ' is-active' : ''}`}
          onClick={() => setTab('sequence')}
        >
          Sequence
        </button>
      </div>

      {tab === 'content' ? (
        <div role="tabpanel" id="hero-panel-content" aria-labelledby="hero-tab-content" className="composer__panel">
          <TextControl
            label={FIELD_LABELS.brand}
            value={hero.content.brand}
            maxLength={LIMITS.brand}
            onChange={(value) => updateContent('brand', value)}
          />
          <TextControl
            label={FIELD_LABELS.note}
            value={hero.content.note}
            maxLength={LIMITS.note}
            onChange={(value) => updateContent('note', value)}
          />
          <TextControl
            label={FIELD_LABELS.headline}
            value={hero.content.headline}
            maxLength={LIMITS.headline}
            multiline
            onChange={(value) => updateContent('headline', value)}
          />
          <TextControl
            label={FIELD_LABELS.body}
            value={hero.content.body}
            maxLength={LIMITS.body}
            multiline
            onChange={(value) => updateContent('body', value)}
          />
          <TextControl
            label={FIELD_LABELS.primary}
            value={hero.content.primary}
            maxLength={LIMITS.primary}
            onChange={(value) => updateContent('primary', value)}
          />
          <TextControl
            label={FIELD_LABELS.secondary}
            value={hero.content.secondary}
            maxLength={LIMITS.secondary}
            onChange={(value) => updateContent('secondary', value)}
          />
          {showCardFields ? (
            <>
              <TextControl
                label={FIELD_LABELS.cardTitle}
                value={hero.content.cardTitle}
                maxLength={LIMITS.cardTitle}
                onChange={(value) => updateContent('cardTitle', value)}
              />
              <TextControl
                label={FIELD_LABELS.cardMetric}
                value={hero.content.cardMetric}
                maxLength={LIMITS.cardMetric}
                onChange={(value) => updateContent('cardMetric', value)}
              />
              <TextControl
                label={FIELD_LABELS.cardMeta}
                value={hero.content.cardMeta}
                maxLength={LIMITS.cardMeta}
                multiline
                onChange={(value) => updateContent('cardMeta', value)}
              />
            </>
          ) : null}
          {showGalleryFields ? (
            <>
              <TextControl
                label={FIELD_LABELS.itemOne}
                value={hero.content.itemOne}
                maxLength={LIMITS.itemOne}
                onChange={(value) => updateContent('itemOne', value)}
              />
              <TextControl
                label={FIELD_LABELS.itemTwo}
                value={hero.content.itemTwo}
                maxLength={LIMITS.itemTwo}
                onChange={(value) => updateContent('itemTwo', value)}
              />
              <TextControl
                label={FIELD_LABELS.itemThree}
                value={hero.content.itemThree}
                maxLength={LIMITS.itemThree}
                onChange={(value) => updateContent('itemThree', value)}
              />
            </>
          ) : null}
          <p className="control__note composer__note">
            Buttons are content for your hero. Wire them to your own pages in the exported code.
          </p>
        </div>
      ) : (
        <div role="tabpanel" id="hero-panel-sequence" aria-labelledby="hero-tab-sequence" className="composer__panel">
          <div className="sequence__head">
            <div>
              <span className="label">Entrance</span>
              <p className="sequence__total">
                {hero.steps.length} steps · {(heroDuration(hero.steps) / 1000).toFixed(1)}s total
              </p>
            </div>
            <button type="button" className="btn btn--ghost btn--sm" onClick={onReplay}>
              Replay
            </button>
          </div>

          <div className="sequence__timeline" aria-hidden="true">
            {hero.steps.map((step, index) => {
              const start = starts[index];
              const left = (start / total) * 100;
              const width = Math.max(7, (step.duration / total) * 100);
              return (
                <button
                  type="button"
                  key={step.id}
                  tabIndex={-1}
                  className={`sequence__seg sequence__seg--${step.id}${selected.id === step.id ? ' is-active' : ''}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  onClick={() => setSelectedId(step.id)}
                  aria-label={`Select ${HERO_STEP_LABELS[step.id]} step`}
                />
              );
            })}
          </div>
          <div className="sequence__ruler">
            <span className="mono">0s</span>
            <span className="mono">{(total / 2000).toFixed(1)}s</span>
            <span className="mono">{(total / 1000).toFixed(1)}s</span>
          </div>

          <ol className="sequence__list">
            {hero.steps.map((step, index) => (
              <li key={step.id}>
                <div className={`sequence-step${selected.id === step.id ? ' is-selected' : ''}`}>
                  <button
                    type="button"
                    className="sequence-step__select"
                    onClick={() => setSelectedId(step.id)}
                    aria-pressed={selected.id === step.id}
                  >
                    <span className="sequence-step__index mono">{String(index + 1).padStart(2, '0')}</span>
                    <span className="sequence-step__name">
                      <strong>{HERO_STEP_LABELS[step.id]}</strong>
                      <span className="mono">
                        {starts[index]}ms · {step.duration}ms
                      </span>
                    </span>
                  </button>
                  <div className="sequence-step__move">
                    <button
                      type="button"
                      onClick={() => moveStep(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${HERO_STEP_LABELS[step.id]} earlier`}
                    >
                      <svg viewBox="0 0 12 12" width="10" height="10" fill="none" aria-hidden="true">
                        <path d="m2.5 7.5 3.5-3 3.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStep(index, 1)}
                      disabled={index === hero.steps.length - 1}
                      aria-label={`Move ${HERO_STEP_LABELS[step.id]} later`}
                    >
                      <svg viewBox="0 0 12 12" width="10" height="10" fill="none" aria-hidden="true">
                        <path d="m2.5 4.5 3.5 3 3.5-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="composer__step-editor">
            <div className="composer__step-head">
              <span className="label">Editing {HERO_STEP_LABELS[selected.id]}</span>
              <span className="mono">STEP {String(selectedIndex + 1).padStart(2, '0')}</span>
            </div>
            <Slider
              label="Duration"
              value={selected.duration}
              min={100}
              max={3000}
              step={10}
              unit="ms"
              onChange={(value) => updateStep(selected.id, { duration: value })}
            />
            <Slider
              label="Offset"
              value={selected.gap}
              min={0}
              max={1600}
              step={10}
              unit="ms"
              note="Added to the previous step's start time."
              onChange={(value) => updateStep(selected.id, { gap: value })}
            />
            <Slider
              label="Rise"
              value={selected.distance}
              min={0}
              max={80}
              step={1}
              unit="px"
              onChange={(value) => updateStep(selected.id, { distance: value })}
            />
            <SelectControl
              label="Easing"
              value={selected.easing}
              options={HERO_EASING_OPTIONS}
              onChange={(value) => updateStep(selected.id, { easing: value })}
              note={`cubic-bezier(${getEasing(selected.easing).bezier.join(', ')})`}
            />
            <p className="sequence__ease mono">{bezierCss(getEasing(selected.easing).bezier)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
