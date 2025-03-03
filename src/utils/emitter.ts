export type EmitterCb<TData extends any | void = void> = (data: TData) => void;

export interface EmitterCbConfig {
  once?: boolean;
  init?: boolean;
}

export class Emitter {
  private _count = 0;

  private readonly _maxListeners?: number;

  private readonly _once = new Set<EmitterCb<any>>();

  private readonly _listeners = new Map<string, EmitterCb<any>[]>();

  private readonly _cache = new Map<string, any>();

  constructor(max?: number) {
    this._maxListeners = max;
  }

  sub<TData extends any | void = void>(event: string, callback: EmitterCb<TData>, config: EmitterCbConfig = {}): () => void {
    const { once = false, init = false } = config;
    if (init) {
      const data = this._cache.get(event);
      if (data) {
        setTimeout(() => callback(data), 0);

        if (once) {
          return () => undefined;
        }
      }
    }

    const callbacks = this._listeners.get(event);
    if (callbacks && this._maxListeners != null && callbacks.length >= this._maxListeners) {
      throw new Error('LIMIT_CB')
    }

    if (callbacks) {
      this._listeners.set(event, [...callbacks, callback]);
    } else {
      this._listeners.set(event, [callback]);
    }
    this._count += 1;

    if (once) {
      this._once.add(callback)
    }

    return this._getUnsub(event, callback);
  }

  emit<TData extends any | void = void>(event: string, data?: TData): void {
    this._cache.set(event, data);
    const listeners = this._listeners.get(event);
    if (!listeners) return;

    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener(data);

      if (this._once.has(listener)) {
        this._removeListener(event, listener);
      }
    }
  }

  remove(event?: string): void {
    if (event) {
      this._cache.delete(event);
      this._removeEvent(event);
      return;
    }
    this._cache.clear();
    for(const event of this._listeners.keys()) {
      this._removeEvent(event);
    }
  }

  getCount(event?: string) {
    if (event) {
      return this._listeners.get(event)?.length || 0;
    } else {
      return this._count;
    }
  }

  clearCache(): void {
    this._cache.clear();
  }

  private _getUnsub(event: string, callback: EmitterCb<any>): () => void {
    return () => {
      this._removeListener(event, callback);
    }
  }

  private _removeEvent(event: string): void {
    const listeners = this._listeners.get(event);
    if (!listeners) return;

    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      this._removeListener(event, listener);
    }
  }

  private _removeListener(event: string, callback: EmitterCb<any>): void {
    let callbacks = this._listeners.get(event);
    if (!callbacks) return;


    callbacks = callbacks.filter(_item => _item !== callback);
    this._count -= 1;

    if (this._once.has(callback)) {
      this._once.delete(callback);
    }

    if (callbacks.length === 0) {
      this._listeners.delete(event);
      this._cache.delete(event);
      if (this._listeners.size === 0) {
        this._cache.clear();
      }
    } else {
      this._listeners.set(event, callbacks);
    }

  }
}