import type { Message } from "../interfaces.js";

class MessageTracker {
  data = new Map<number, Message>();
  #maxLength = 200;

  push(msg: Message) {
    if (typeof msg.id !== "number") return;

    this.data.set(msg.id, msg);

    if (this.data.size > this.#maxLength) {
      const [firstKey] = this.data.keys();
      this.data.delete(firstKey);
    }
  }

  get(index: number) {
    return this.data.get(index);
  }
}

export const messageTracker = new MessageTracker();
