// ideally this wouldn't exist, but it's a quick workaround for Flow SyntaxError on the EventEmitter in Jest
class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  addListener(eventType, listener) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(listener);
    return {
      remove: () => {
        this.listeners.get(eventType).delete(listener);
      },
    };
  }

  emit(eventType, ...args) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      listeners.forEach((listener) => listener(...args));
    }
  }

  removeAllListeners(eventType) {
    if (eventType) {
      this.listeners.delete(eventType);
    } else {
      this.listeners.clear();
    }
  }
}

export default EventEmitter;
