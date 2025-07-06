import { ThemePreference } from './types';

export class ThemeEventEmitter {
  private listeners = new Set<(theme: ThemePreference) => void>();

  addListener(callback: (theme: ThemePreference) => void) {
    this.listeners.add(callback);
    return {
      remove: () => {
        this.listeners.delete(callback);
      },
    };
  }

  emit(theme: ThemePreference) {
    this.listeners.forEach((callback) => callback(theme));
  }
}
