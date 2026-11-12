import '@testing-library/jest-dom/vitest';

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

// @ts-expect-error - jsdom missing the browser API in tests
globalThis.IntersectionObserver = MockIntersectionObserver;
