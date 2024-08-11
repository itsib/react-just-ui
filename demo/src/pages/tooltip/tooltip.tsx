import { CSSProperties, FC, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { CodeExample } from '../../components/code-example/code-example.tsx';
import { useForm, useWatch } from 'react-hook-form';
import { JuiRadio, JuiTextarea, JuiCheckbox } from 'react-just-ui';
import './tooltip.css';

interface FormFields {
  position: string;
  width: string;
  text: string;
  custom: string;
  active: boolean;
}

const FISH: any = {
  short: '✔ Success',
  middle: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sapien urna',
  long: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sapien urna, conubia accumsan lacinia nulla sollicitudin parturient vulputate montes, torquent ridiculus netus penatibus nullam facilisis morbi faucibus',
}

export const Tooltip: FC = () => {
  const { t } = useTranslation();

  const { register, control } = useForm<FormFields>({
    defaultValues: {
      position: 'top',
      width: 'md',
      text: 'short',
      custom: '',
      active: false,
    }
  })

  const [text, custom, active, width, position] = useWatch({ control, name: ['text', 'custom', 'active', 'width', 'position'] });

  const tooltip = text === 'custom' ? custom : FISH[text];

  const source = useMemo(() => {
    let source = '<div\n';

    if (active) {
      source += `    className="active" \n`;
    }
    source += `    aria-label="${tooltip ?? ''}" \n`;
    source += `    data-position="${position}" \n`;
    source += `    data-width="${width}" \n`;
    source += `>\n`;
    source += `  <svg width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">\n`;
    source += `    <path fill="currentColor" d="M 8,0 ... -1.6,0 2.9,2.9 0 0 1 2.9,-2.9"/>\n`;
    source += `  </svg>\n`;
    source += `</div>\n`;

    return source;
  }, [tooltip, active, width, position]);

  return (
    <div className="tooltip-page">
      <h1><Trans i18nKey="tooltip"/></h1>
      <p><Trans i18nKey="tooltip_page_content"/></p>

      <fieldset className="preview">
        <legend><Trans i18nKey="preview"/></legend>

        <div className="options" style={{ '--jui-error-height': 'auto' } as CSSProperties}>
          <div className="actions">
            <JuiRadio
              id="position-top"
              label={t('position_value', { value: 'top' })}
              value="top"
              error={false}
              {...register('position', {})}
            />
            <JuiRadio
              id="position-bottom"
              label={t('position_value', { value: 'bottom' })}
              value="bottom"
              error={false}
              {...register('position', {})}
            />
            <JuiRadio
              id="position-left"
              label={t('position_value', { value: 'left' })}
              value="left"
              error={false}
              {...register('position', {})}
            />
            <JuiRadio
              id="position-right"
              label={t('position_value', { value: 'right' })}
              value="right"
              error={false}
              {...register('position', {})}
            />

            <JuiCheckbox
              id="active-class"
              label={t('add_active_class')}
              error={false}
              {...register('active')}
            />
          </div>

          <div className="actions">
            <JuiRadio
              id="width-xs"
              label={t('width_value', { value: 'xs' })}
              value="xs"
              error={false}
              {...register('width', {})}
            />
            <JuiRadio
              id="width-sm"
              label={t('width_value', { value: 'sm' })}
              value="sm"
              error={false}
              {...register('width', {})}
            />
            <JuiRadio
              id="width-md"
              label={t('width_value', { value: 'md' })}
              value="md"
              error={false}
              {...register('width', {})}
            />
            <JuiRadio
              id="width-lg"
              label={t('width_value', { value: 'lg' })}
              value="lg"
              error={false}
              {...register('width', {})}
            />
            <JuiRadio
              id="width-xl"
              label={t('width_value', { value: 'xl' })}
              value="xl"
              error={false}
              {...register('width', {})}
            />
          </div>

          <div className="actions">
            <JuiRadio
              id="text-short"
              label={t('text_value', { value: 'short' })}
              value="short"
              error={false}
              {...register('text', {})}
            />
            <JuiRadio
              id="text-middle"
              label={t('text_value', { value: 'middle' })}
              value="middle"
              error={false}
              {...register('text', {})}
            />
            <JuiRadio
              id="text-long"
              label={t('text_value', { value: 'long' })}
              value="long"
              error={false}
              {...register('text', {})}
            />
            <JuiRadio
              id="text-custom"
              label={t('custom')}
              value="custom"
              error={false}
              {...register('text', {})}
            />

            <JuiTextarea
              id="custom-field"
              error={false}
              {...register('custom', { disabled: text !== 'custom', deps: ['text'] })}
            />
          </div>
        </div>

        <div className="demo">
          <div>Hover me</div>
          <div
            className={active ? 'active' : ''}
            aria-label={tooltip}
            data-position={position}
            data-width={width}
          >
            <svg style={{ display: 'block' }} width="24" height="24" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor"
                    d="M 7.9999999,0 C 12.418399,0 16,3.5816013 16,7.9999997 16,12.418398 12.418399,16.000001 7.9999999,16.000001 3.5816015,16.000001 0,12.418398 0,7.9999997 0,3.5816013 3.5816015,0 7.9999999,0 m 0,1.6000009 a 6.3999999,6.3999999 0 1 0 0,12.7999971 6.3999999,6.3999999 0 0 0 0,-12.7999971 m 0,9.5999981 a 0.8000015,0.8000015 0 1 1 0,1.600003 0.8000015,0.8000015 0 0 1 0,-1.600003 m 0,-7.5999981 a 2.8999998,2.8999998 0 0 1 1.0783979,5.5919999 0.64000001,0.64000001 0 0 0 -0.2439851,0.160768 c -0.035136,0.04 -0.040811,0.091178 -0.04,0.144 l 0.00554,0.1031893 A 0.80000001,0.80000001 0 0 1 7.2055504,9.693526 l -0.00554,-0.093568 v -0.2 c 0,-0.9223978 0.744,-1.476002 1.2832021,-1.6928021 a 1.3008,1.3008 0 1 0 -1.7832,-1.2072 0.80000108,0.80000108 0 1 1 -1.6000021,0 2.8999998,2.8999998 0 0 1 2.8999832,-2.8999828"/>
            </svg>
          </div>
        </div>
      </fieldset>

      <CodeExample source={source} />
    </div>
  );
};
