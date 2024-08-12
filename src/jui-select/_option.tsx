import { SelectOption } from '../types';
import './_option.css';

export interface OptionProps extends SelectOption {
  id: string;
  active: boolean;
  onClick: (value: string) => void;
}

export function Option(props: OptionProps) {
  const { id, active, label, icon, value, onClick } = props;

  return (
    <button
      id={active ? `${id}-active` : undefined}
      type="button"
      className={`jui-option ${active ? 'active' : ''}`}
      value={value}
      onClick={() => onClick(value)}
    >
      {icon ? (
        <div className="icon">
          {typeof icon === 'string' ? <i className={icon} /> : <>{icon}</>}
        </div>
      ) : null}
      <div className="label">{label}</div>

      {active ? (
        <svg viewBox="0 0 16 16">
          <path d="M13.969 2.969L6.5 10.438l-4.469-4.47L.97 7.032l5.531 5.53 8.531-8.53z"/>
        </svg>
      ) : null}
    </button>
  );
}