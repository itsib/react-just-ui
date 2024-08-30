import { CSSProperties, FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Checkbox } from 'react-just-ui/checkbox';
import { Image } from 'react-just-ui/image';
import { RadioButton } from 'react-just-ui/radio';
import './image.page.css';

const IMAGES_URLS = [
  '/images/robot.svg',
  'https://sample-videos.com/img/Sample-jpg-image-500kb.jpg',
  'https://some-site/img/fail.jpg',
];

export const ImagePage: FC = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [imageSrc, setImageSrc] = useState(0);

  const fallback = imageSrc <= 2 ? '/images/no-evil.svg' : null;

  return (
    <div className="image-page">
      <h1><Trans i18nKey="image" /></h1>
      <p><Trans i18nKey="image_page_content" /></p>

      <fieldset className="preview">
        <legend><Trans i18nKey="preview"/></legend>

        <div className="actions">
          <div>
            <RadioButton
              id="demo-image-url-0"
              label={t('image_page_src_url_0')}
              value={0}
              error={false}
              checked={imageSrc === 0}
              onChange={() => setImageSrc(0)}
            />

            <RadioButton
              id="demo-image-url-1"
              label={t('image_page_src_url_1')}
              value={1}
              error={false}
              checked={imageSrc === 1}
              onChange={() => setImageSrc(1)}
            />

            <RadioButton
              id="demo-image-url-2"
              label={t('image_page_src_url_2')}
              value={2}
              error={false}
              checked={imageSrc === 2}
              onChange={() => setImageSrc(2)}
            />

            <RadioButton
              id="demo-image-url-3"
              label={t('image_page_src_url_3')}
              value={3}
              error={false}
              checked={imageSrc === 3}
              onChange={() => setImageSrc(3)}
            />
          </div>

          <div>
            <Checkbox
              id="demo-active"
              label={t('image_enable_active_attribute')}
              value={active as any}
              onChange={event => setActive((event.target as any).checked)}
            />

            <Checkbox
              id="demo-loading"
              label={t('image_enable_loading_attribute')}
              value={loading as any}
              onChange={event => setLoading((event.target as any).checked)}
            />

            <Checkbox
              id="demo-disabled"
              label={t('image_enable_disabled_attribute')}
              value={disabled as any}
              onChange={event => setDisabled((event.target as any).checked)}
            />
          </div>
        </div>

        <div className="demo">
          <br/>
          <div style={{ '--jui-image-border-width': '4px' } as CSSProperties}>
            <Image
              src={IMAGES_URLS[imageSrc]}
              fallback={fallback}
              size={100}
              active={active}
              loading={loading}
              disabled={disabled}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};
