export interface PriorityQueueNode<T> {
  element: T;
  priority: number;
}

export class MinPriorityQueue<T> {
  private heap: PriorityQueueNode<T>[] = [];

  constructor() {}

  public size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public peek(): PriorityQueueNode<T> | undefined {
    return this.heap[0];
  }

  public push(element: T, priority: number): void {
    const node: PriorityQueueNode<T> = { element, priority };
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  public pop(): PriorityQueueNode<T> | undefined {
    if (this.isEmpty()) return undefined;
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0 && end !== undefined) {
      this.heap[0] = end;
      this.sinkDown(0);
    }
    return min;
  }

  public toArray(): PriorityQueueNode<T>[] {
    // Return sorted snapshot without mutating heap
    return [...this.heap].sort((a, b) => a.priority - b.priority);
  }

  private bubbleUp(index: number): void {
    const node = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (node.priority >= parent.priority) break;
      this.heap[index] = parent;
      index = parentIndex;
    }
    this.heap[index] = node;
  }

  private sinkDown(index: number): void {
    const length = this.heap.length;
    const node = this.heap[index];

    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let leftChild: PriorityQueueNode<T> | undefined;
      let rightChild: PriorityQueueNode<T> | undefined;
      let swap: number | null = null;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild.priority < node.priority) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && rightChild.priority < node.priority) ||
          (swap !== null && leftChild && rightChild.priority < leftChild.priority)
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      index = swap;
    }

    this.heap[index] = node;
  }
}
