import { describe, it, expect } from 'vitest';
import { MinPriorityQueue } from '../utils/priorityQueue';

describe('MinPriorityQueue', () => {
  it('should initialize empty', () => {
    const pq = new MinPriorityQueue<string>();
    expect(pq.isEmpty()).toBe(true);
    expect(pq.size()).toBe(0);
    expect(pq.peek()).toBeUndefined();
  });

  it('should pop elements in ascending order of priority', () => {
    const pq = new MinPriorityQueue<string>();
    pq.push('C', 10);
    pq.push('A', 2);
    pq.push('D', 15);
    pq.push('B', 5);

    expect(pq.size()).toBe(4);
    expect(pq.peek()?.element).toBe('A');

    expect(pq.pop()?.element).toBe('A');
    expect(pq.pop()?.element).toBe('B');
    expect(pq.pop()?.element).toBe('C');
    expect(pq.pop()?.element).toBe('D');
    expect(pq.isEmpty()).toBe(true);
  });

  it('should handle elements with equal priority', () => {
    const pq = new MinPriorityQueue<string>();
    pq.push('X', 5);
    pq.push('Y', 5);
    expect(pq.size()).toBe(2);
    const first = pq.pop();
    const second = pq.pop();
    expect(first?.priority).toBe(5);
    expect(second?.priority).toBe(5);
  });
});
