export type DomainEvent = {
  eventType: string;
  timestamp: string;
  payload: Record<string, unknown>;
};

export type DomainEventListener<T extends DomainEvent = DomainEvent> = (event: T) => void | Promise<void>;

export class DomainEventDispatcher {
  private static listeners = new Map<string, Set<DomainEventListener>>();

  static subscribe<T extends DomainEvent>(eventType: string, listener: DomainEventListener<T>) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener as DomainEventListener);
  }

  static unsubscribe<T extends DomainEvent>(eventType: string, listener: DomainEventListener<T>) {
    const set = this.listeners.get(eventType);
    if (set) {
      set.delete(listener as DomainEventListener);
    }
  }

  static async dispatch(event: DomainEvent): Promise<void> {
    // Support wildcard subscriptions
    const wildcardListeners = this.listeners.get("*");
    if (wildcardListeners) {
      for (const listener of wildcardListeners) {
        try {
          await listener(event);
        } catch (err) {
          console.error("Error executing wildcard event listener:", err);
        }
      }
    }

    const set = this.listeners.get(event.eventType);
    if (!set) return;
    const promises = Array.from(set).map(async listener => {
      try {
        await listener(event);
      } catch (err) {
        console.error(`Error executing event listener for ${event.eventType}:`, err);
      }
    });
    await Promise.all(promises);
  }

  // Instance methods for constructor dependency injection support
  async dispatch(event: DomainEvent): Promise<void> {
    await DomainEventDispatcher.dispatch(event);
  }

  async dispatchEvent(event: DomainEvent): Promise<void> {
    await DomainEventDispatcher.dispatch(event);
  }
}
