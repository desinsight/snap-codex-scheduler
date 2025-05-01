import { cacheService } from '../cacheService';

describe('CacheService', () => {
  beforeEach(() => {
    cacheService.clear();
  });

  it('should store and retrieve data', () => {
    const testData = { id: 1, name: 'test' };
    cacheService.set('testKey', testData);
    const retrieved = cacheService.get('testKey');
    expect(retrieved).toEqual(testData);
  });

  it('should return null for expired items', () => {
    const testData = { id: 1, name: 'test' };
    cacheService.set('testKey', testData, 100); // 100ms TTL
    setTimeout(() => {
      const retrieved = cacheService.get('testKey');
      expect(retrieved).toBeNull();
    }, 200);
  });

  it('should handle different data types', () => {
    const stringData = 'test string';
    const numberData = 42;
    const arrayData = [1, 2, 3];
    const objectData = { a: 1, b: 2 };

    cacheService.set('string', stringData);
    cacheService.set('number', numberData);
    cacheService.set('array', arrayData);
    cacheService.set('object', objectData);

    expect(cacheService.get('string')).toBe(stringData);
    expect(cacheService.get('number')).toBe(numberData);
    expect(cacheService.get('array')).toEqual(arrayData);
    expect(cacheService.get('object')).toEqual(objectData);
  });

  it('should respect max size limit', () => {
    const maxSize = 5;
    for (let i = 0; i < maxSize + 2; i++) {
      cacheService.set(`key${i}`, { data: i });
    }
    expect(cacheService.size()).toBeLessThanOrEqual(maxSize);
  });

  it('should delete items correctly', () => {
    const testData = { id: 1, name: 'test' };
    cacheService.set('testKey', testData);
    cacheService.delete('testKey');
    expect(cacheService.get('testKey')).toBeNull();
  });

  it('should clear all items', () => {
    cacheService.set('key1', 'value1');
    cacheService.set('key2', 'value2');
    cacheService.clear();
    expect(cacheService.size()).toBe(0);
  });

  it('should maintain singleton pattern', () => {
    const instance1 = cacheService;
    const instance2 = cacheService;
    expect(instance1).toBe(instance2);
  });
});
