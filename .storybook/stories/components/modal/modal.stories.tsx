import { Modal } from 'react-just-ui/modal';
import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    controls: {
      sort: 'alpha',
    },
  },
  argTypes: {
    isOpen: {
      type: 'boolean',
      control: { type: 'boolean' },
    },
  },
  args: {
    isOpen: false,
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof Modal>;

export const Basic: Story = {
  args: {},
  render: function Render() {
    const [args, setArgs] = useArgs<{ isOpen: boolean }>();

    return (
      <div>
        <Modal isOpen={args.isOpen} onDismiss={() => setArgs({ ...args, isOpen: false })}>
          <div className="modal" style={{ width: 500 }}>
            <div className="modal-header">
              <div className="title">
                <span>Modal Header</span>
              </div>
              <button type="button" className="btn btn-close" onClick={() => setArgs({ ...args, isOpen: false })} />
            </div>
            <div className="modal-content">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
              rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta
              sunt explicabo.<br />
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
              magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
              dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi
              tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};