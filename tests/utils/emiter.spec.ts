import { describe, it, expect, vi } from 'vitest';
import { Emitter } from '../../src/utils/emitter';

describe('utils/emitter.ts', () => {
  it('should sub and call', () => {
    const emitter = new Emitter(3);
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const callback3 = vi.fn();

    emitter.sub('test-1', callback1);
    emitter.sub('test-1', callback2);
    emitter.sub('test-2', callback3);
    emitter.emit('test-1', 'test-message')

    expect(emitter.getCount()).toStrictEqual(3);
    expect(callback1).toHaveBeenCalledExactlyOnceWith('test-message');
    expect(callback2).toHaveBeenCalledExactlyOnceWith('test-message');
    expect(callback3).not.toHaveBeenCalled();

    callback1.mockClear();
    callback2.mockClear();
    callback2.mockClear();

    emitter.emit('test-2', 'test-event')
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
    expect(callback3).toHaveBeenCalledExactlyOnceWith('test-event');
  });

  it('should trow if limit', () => {
    expect(() => {
      const emitter = new Emitter(2);
      emitter.sub('test-1', () => {});
      emitter.sub('test-1', () => {});
      emitter.sub('test-1', () => {});
    }).toThrowError('LIMIT_CB');
  });

  it('should unsubscribe', () => {
    const emitter = new Emitter();
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const callback3 = vi.fn();

    emitter.sub('test', callback1);
    const unsubscribe = emitter.sub('test', callback2);
    emitter.sub('test', callback3);

    unsubscribe();

    emitter.emit('test', 'test-message');

    expect(emitter.getCount()).toStrictEqual(2);
    expect(callback1).toHaveBeenCalledExactlyOnceWith('test-message');
    expect(callback2).not.toHaveBeenCalled();
    expect(callback3).toHaveBeenCalledExactlyOnceWith('test-message');
  });

  it('should remove listeners', () => {
    const emitter = new Emitter();
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const callback3 = vi.fn();

    emitter.sub('test-1', callback1);
    emitter.sub('test-1', callback2);
    emitter.sub('test-2', callback3);

    expect(emitter.getCount()).toStrictEqual(3);

    emitter.remove('test-1');

    expect(emitter.getCount()).toStrictEqual(1);

    emitter.emit('test-1', 'test-message')

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
    expect(callback3).not.toHaveBeenCalled();
  });

  it('should call once', () => {
    const emitter = new Emitter();
    const callback = vi.fn();
    emitter.sub('event-test', callback, { once: true });

    emitter.emit('event-test', 1);
    emitter.emit('event-test', 2);
    emitter.emit('event-test', 3);

    expect(callback).toHaveBeenCalledExactlyOnceWith(1);
  });

  it('should call imminently', async () => {
    const emitter = new Emitter();
    const callback = vi.fn();
    emitter.emit('event-test', 1);

    emitter.sub('event-test', callback, { init: true });

    return await new Promise<void>(resolve => {
      setTimeout(() => {
        expect(callback).toHaveBeenCalledExactlyOnceWith(1);
        resolve();
      }, 2)
    });
  });
});