/// <reference types="jest" />

const mockQuery = jest.fn();
const mockRelease = jest.fn();

class MockClient {
  query = mockQuery;
  release = mockRelease;
}

const mockConnect = jest.fn(() => Promise.resolve(new MockClient()));

const Pool = jest.fn(() => ({
  connect: mockConnect,
}));

// Add this line so that Pool.Client exists and is a constructor
(Pool as any).Client = MockClient;

export { Pool, mockQuery, mockConnect, mockRelease };
