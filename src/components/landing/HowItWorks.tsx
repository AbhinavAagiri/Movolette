import { Reveal } from '../Reveal';

const STEPS = [
  {
    number: '01',
    title: 'Choose',
    body: 'Start with a component, a section, or one of the animation presets. Every one is a working example you can pull apart.',
    aside: 'BUTTONS · TEXT · TOASTS · HEROES',
  },
  {
    number: '02',
    title: 'Customize',
    body: 'Tune timing, distance, easing, and sequence order. The preview updates as you move a slider, so the decision is never abstract.',
    aside: 'DURATION · CURVE · STAGGER',
  },
  {
    number: '03',
    title: 'Export',
    body: 'Copy the generated HTML, CSS, and JavaScript, or download the stylesheet. What you saw in the studio is what you ship.',
    aside: 'CSS · HTML · JS',
  },
];

export function HowItWorks() {
  return (
    <section className="how" id="how" aria-labelledby="how-title">
      <div className="container">
        <div className="how__head">
          <Reveal>
            <p className="label">The process</p>
            <h2 className="h2" id="how-title">
              From a hunch
              <br />
              to an interaction.
            </h2>
          </Reveal>
          <Reveal as="p" className="how__intro" delay={90}>
            No timeline rabbit holes. No exports that need reinterpreting. Three steps, and the motion is
            ready for a real interface.
          </Reveal>
        </div>
        <ol className="how__steps">
          {STEPS.map((step, index) => (
            <Reveal
              as="li"
              className="how-step"
              key={step.number}
              delay={index * 90}
              shift="sm"
            >
              <div className="how-step__top">
                <span className="how-step__number mono">{step.number}</span>
                <span className="how-step__aside mono">{step.aside}</span>
              </div>
              <h3 className="h3 how-step__title">{step.title}</h3>
              <p className="how-step__body">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
