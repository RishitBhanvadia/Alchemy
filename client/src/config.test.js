import { API_BASE_URL } from './config';

test('API_BASE_URL should be defined', () => {
  expect(API_BASE_URL).toBeDefined();
  expect(typeof API_BASE_URL).toBe('string');
});
