import { familyOf } from '../../lib/motion/presets';
import { ControlRenderer } from '../controls';
import { EasingEditor } from '../EasingEditor';
import { HeroComposer } from './HeroComposer';
import type { EasingValue, HeroState, HeroTemplateId, ParamValue, Preset, StudioDocument } from '../../lib/motion/types';

interface InspectorProps {
  doc: StudioDocument;
  preset: Preset;
  savedAt?: number;
  isDirty: boolean;
  onParamChange: (key: string, value: ParamValue) => void;
  onEasingChange: (easing: EasingValue) => void;
  onHeroChange: (hero: HeroState) => void;
  onTemplateChange: (template: HeroTemplateId) => void;
  onReplay: () => void;
  onSave: () => void;
  onReset: () => void;
  onClose?: () => void;
}

function formatSaved(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function Inspector({
  doc,
  preset,
  savedAt,
  isDirty,
  onParamChange,
  onEasingChange,
  onHeroChange,
  onTemplateChange,
  onReplay,
  onSave,
  onReset,
  onClose,
}: InspectorProps) {
  const family = familyOf(preset.family);
  const isHero = preset.family === 'heroes';
  const hero = doc.hero;
  const controls = preset.controls.filter((control) => !control.when || control.when(doc.params));

  return (
    <div className="inspector">
      <div className="inspector__head">
        <div className="panel-label">
          <span className="label">Animation settings</span>
          {onClose ? (
            <button type="button" className="inspector__close" onClick={onClose} aria-label="Close settings">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
                <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          ) : (
            <span className="mono">{isHero ? 'HERO' : `${controls.length} CONTROLS`}</span>
          )}
        </div>
      </div>

      <div className="inspector__scroll">
        <div className="inspector__title-block">
          <span className="label label--violet">{family.label}</span>
          <h2 className="inspector__title">{preset.name}</h2>
          <p className="inspector__blurb">{preset.blurb}</p>
        </div>

        {isHero && hero ? (
          <HeroComposer
            template={preset.id as HeroTemplateId}
            hero={hero}
            onChange={onHeroChange}
            onTemplateChange={onTemplateChange}
            onReplay={onReplay}
          />
        ) : (
          <>
            <div className="inspector__section">
              <div className="section-bar">
                <span className="label">Timing &amp; movement</span>
                <span className="mono">LIVE</span>
              </div>
              <div className="inspector__controls">
                {controls.map((control) => (
                  <ControlRenderer
                    key={control.key}
                    control={control}
                    value={doc.params[control.key]}
                    onChange={(value) => onParamChange(control.key, value)}
                  />
                ))}
              </div>
            </div>

            <div className="inspector__section">
              <div className="section-bar">
                <span className="label">Easing</span>
                <span className="mono">CUBIC BEZIER</span>
              </div>
              <EasingEditor value={doc.easing} onChange={onEasingChange} />
            </div>

            {preset.id === 'text-counter' ? (
              <div className="inspector__note">
                This counter is animated in JavaScript with the same curve. Export includes the easing solver.
              </div>
            ) : null}
          </>
        )}

        <div className="inspector__actions">
          <div className="save-state">
            <span className={`save-state__dot${isDirty ? ' is-dirty' : ''}`} aria-hidden="true" />
            <span>{isDirty ? 'Unsaved local changes' : savedAt ? `Saved locally at ${formatSaved(savedAt)}` : 'Not saved locally'}</span>
          </div>
          <button type="button" className="btn btn--ink btn--sm inspector__save" onClick={onSave}>
            Save this setup locally
          </button>
          <button type="button" className="btn btn--quiet btn--sm inspector__reset" onClick={onReset}>
            Reset to preset defaults
          </button>
          <p className="inspector__local-note">
            Saved only in this browser. To share, use the <strong>Share</strong> link in the top bar.
          </p>
        </div>
      </div>
    </div>
  );
}
