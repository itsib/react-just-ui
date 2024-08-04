import { FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import './tooltip.css';
import { CodeSnippet } from '../../components/code-snippet/code-snippet.tsx';

const FISH = [
  '✔ Success',
  'Lorem ipsum dolor sit amet consectetur adipiscing elit sapien urna',
  'Lorem ipsum dolor sit amet consectetur adipiscing elit sapien urna, conubia accumsan lacinia nulla sollicitudin parturient vulputate montes, torquent ridiculus netus penatibus nullam facilisis morbi faucibus',
  'Lorem ipsum dolor sit amet consectetur adipiscing elit sapien urna, conubia accumsan lacinia nulla sollicitudin parturient vulputate montes, torquent ridiculus netus penatibus nullam facilisis morbi faucibus. Ipsum consectetur sodales nunc per lacinia eros pulvinar rhoncus taciti at posuere fusce, facilisi sem placerat ullamcorper bibendum euismod viverra elementum mollis ut nibh.',
]

export const Tooltip: FC = () => {
  useTranslation();

  const [position, setPosition] = useState<string>('top');
  const [width, setWidth] = useState<string>('md');
  const [text, seText] = useState<number>(0);

  return (
    <div className="tooltip-page">
      <h1><Trans i18nKey="tooltip"/></h1>
      <p><Trans i18nKey="tooltip_page_content"/></p>

      <fieldset className="preview">
        <legend><Trans i18nKey="preview"/></legend>

        <div className="actions position">
          <button className={`btn ${position === 'top' ? 'btn-primary' : 'btn-secondary'}`} type="button"
                  onClick={() => setPosition('top')}>
            <Trans i18nKey="position_value" values={{ value: 'top' }}/>
          </button>
          <button className={`btn ${position === 'bottom' ? 'btn-primary' : 'btn-secondary'}`} type="button"
                  onClick={() => setPosition('bottom')}>
            <Trans i18nKey="position_value" values={{ value: 'bottom' }}/>
          </button>
          <button className={`btn ${position === 'left' ? 'btn-primary' : 'btn-secondary'}`} type="button"
                  onClick={() => setPosition('left')}>
            <Trans i18nKey="position_value" values={{ value: 'left' }}/>
          </button>
          <button className={`btn ${position === 'right' ? 'btn-primary' : 'btn-secondary'}`} type="button"
                  onClick={() => setPosition('right')}>
            <Trans i18nKey="position_value" values={{ value: 'right' }}/>
          </button>
        </div>

        <div className="actions width">
          <button className={`btn ${width === 'xs' ? 'btn-primary' : 'btn-secondary'}`} type="button"
                  onClick={() => setWidth('xs')}>
            <Trans i18nKey="width_value" values={{ value: 'xs' }}/>
          </button>
          <button className={`btn ${width === 'sm' ? 'btn-primary' : 'btn-secondary'}`} type="button"
                  onClick={() => setWidth('sm')}>
            <Trans i18nKey="width_value" values={{ value: 'sm' }}/>
          </button>
          <button className={`btn ${width === 'md' ? 'btn-primary' : 'btn-secondary'}`} type="button"
                  onClick={() => setWidth('md')}>
            <Trans i18nKey="width_value" values={{ value: 'md' }}/>
          </button>
          <button className={`btn ${width === 'lg' ? 'btn-primary' : 'btn-secondary'}`} type="button"
                  onClick={() => setWidth('lg')}>
            <Trans i18nKey="width_value" values={{ value: 'lg' }}/>
          </button>
          <button className={`btn ${width === 'xl' ? 'btn-primary' : 'btn-secondary'}`} type="button"
                  onClick={() => setWidth('xl')}>
            <Trans i18nKey="width_value" values={{ value: 'xl' }}/>
          </button>
        </div>

        <div className="actions fish">
          <button className={`btn ${text === 0 ? 'btn-primary' : 'btn-secondary'}`} type="button"
                  onClick={() => seText(0)}>
            <Trans i18nKey="text_value" values={{ value: 0 }}/>
          </button>
          <button className={`btn ${text === 1 ? 'btn-primary' : 'btn-secondary'}`} type="button"
                  onClick={() => seText(1)}>
            <Trans i18nKey="text_value" values={{ value: 1 }}/>
          </button>
          <button className={`btn ${text === 2 ? 'btn-primary' : 'btn-secondary'}`} type="button"
                  onClick={() => seText(2)}>
            <Trans i18nKey="text_value" values={{ value: 2 }}/>
          </button>
          <button className={`btn ${text === 3 ? 'btn-primary' : 'btn-secondary'}`} type="button"
                  onClick={() => seText(3)}>
            <Trans i18nKey="text_value" values={{ value: 3 }}/>
          </button>
        </div>

        <div className="demo">
          <div>Hover me</div>
          <div aria-label={FISH[text]} data-position={position} data-width={width}>
            <svg width="24" height="24" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor"
                    d="M 7.9999999,0 C 12.418399,0 16,3.5816013 16,7.9999997 16,12.418398 12.418399,16.000001 7.9999999,16.000001 3.5816015,16.000001 0,12.418398 0,7.9999997 0,3.5816013 3.5816015,0 7.9999999,0 m 0,1.6000009 a 6.3999999,6.3999999 0 1 0 0,12.7999971 6.3999999,6.3999999 0 0 0 0,-12.7999971 m 0,9.5999981 a 0.8000015,0.8000015 0 1 1 0,1.600003 0.8000015,0.8000015 0 0 1 0,-1.600003 m 0,-7.5999981 a 2.8999998,2.8999998 0 0 1 1.0783979,5.5919999 0.64000001,0.64000001 0 0 0 -0.2439851,0.160768 c -0.035136,0.04 -0.040811,0.091178 -0.04,0.144 l 0.00554,0.1031893 A 0.80000001,0.80000001 0 0 1 7.2055504,9.693526 l -0.00554,-0.093568 v -0.2 c 0,-0.9223978 0.744,-1.476002 1.2832021,-1.6928021 a 1.3008,1.3008 0 1 0 -1.7832,-1.2072 0.80000108,0.80000108 0 1 1 -1.6000021,0 2.8999998,2.8999998 0 0 1 2.8999832,-2.8999828"/>
            </svg>
          </div>
        </div>
      </fieldset>

      <fieldset className="example">
        <legend><Trans i18nKey="example"/></legend>

        <CodeSnippet>{`
<div aria-label="Tooltip Text" data-position="top" data-width="md">
  <svg width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M 8,0 ... -1.6,0 2.9,2.9 0 0 1 2.9,-2.9"/>
  </svg>
</div>
          `.trim()}</CodeSnippet>
      </fieldset>
    </div>
);
};
