/**
 * A class for creating Callable objects.
 *
 * @extends {Function}
 */
export class Callback extends Function {
  /** @private */
  _callbacks: Function[]

  /**
   * Creates a new Callback instance.
   *
   * @param {Function[]} [callbackList] - An initial list of callback functions
   * @returns {Callback} a new Callback instance
   */
  constructor(callbackList?: Function[]) {
    super()
    this._callbacks = callbackList ?? []
    return new Proxy(this, {
      apply: (target, thisArg, argArray) => target.__call__(...argArray)
    })
  }

  /**
   * Adds a function to the callback chain. The same function can be added
   * multiple times.
   *
   * @param {Function[]} callbacks - Callback function(s) (callback functions
   * can return another function, which will be considered a 'cleanup function')
   * @returns {Callback} this
   */
  add(...callbacks: Function[]) {
    this._callbacks.push(...callbacks)
    return this
  }
  /**
   * Removes all instances of a function from the callback chain. It is safe to
   * remove the currently executing function from the callback chain.
   *
   * @param {Function[]} callbacks - The callback function to be removed
   * @returns {Callback} this
   */
  remove(...callbacks: Function[]) {
    callbacks.forEach((callback) => {
      this._callbacks = this._callbacks.filter((entry) => entry !== callback)
    })
    return this
  }
  /**
   * Clears all functions from the callback chain.
   *
   * @returns {Callback} this
   */
  clear() {
    this._callbacks.length = 0
    return this
  }

  /**
   * Calls this Callback instance with the given context and arguments.
   *
   * @param {any} thisArg - The context passed to the callback functions
   * @param {any[]} args - The arguments passed to the callback functions
   * @returns {Callback|null} A cleanup Callback instance that contains all of
   * the 'cleanup functions' returned by each callback function arranged in
   * reversed order, or null if all callback functions do not return a
   * 'cleanup function'. This cleanup Callback can only be called once, after
   * which it will be cleared.
   */
  call(thisArg: any, ...args: any[]): Callback | null {
    const cleanupList = []
    for (let i = 0; i < this._callbacks.length; ++i) {
      const entry = this._callbacks[i]
      const cleanup = entry?.call?.(thisArg, ...args)
      if (typeof cleanup === 'function') {
        cleanupList.push(cleanup)
      }
    }
    if (cleanupList.length > 0) {
      const cleanupChain = new Callback(cleanupList.reverse())
      return cleanupChain.add(() => {
        cleanupChain.clear()
      })
    }
    return null
  }

  /** @private */
  __call__(...args: any[]) {
    return this.call(undefined, ...args)
  }
}
