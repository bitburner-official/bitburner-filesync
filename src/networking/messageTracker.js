class MessageTracker {
    data = new Map()
    #maxLength = 200

    push(msg) {
        this.data.set(msg.id, msg);

        if (this.data.size > this.#maxLength) {
            const [firstKey] = this.data.keys();
            this.data.delete(firstKey);
        }
    }

    get(index) {
        return this.data.get(index);
    }
}

export const messageTracker = new MessageTracker();