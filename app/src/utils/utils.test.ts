import { renderHook } from '@testing-library/react-hooks';
import { useUtils } from './utils';

describe('useUtils', () => {
  it('should format currency correctly', () => {
    const { result } = renderHook(() => useUtils());
    expect(result.current.formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format numbers correctly', () => {
    const { result } = renderHook(() => useUtils());
    expect(result.current.formatNumber(1234567)).toBe('1,234,567');
  });

  it('should format date correctly', () => {
    const { result } = renderHook(() => useUtils());
    const testDate = new Date('2024-01-01');
    expect(result.current.formatDate(testDate)).toBe('January 1, 2024');
  });

  it('should calculate percentage correctly', () => {
    const { result } = renderHook(() => useUtils());
    expect(result.current.calculatePercentage(25, 100)).toBe(25);
  });

  it('should truncate text correctly', () => {
    const { result } = renderHook(() => useUtils());
    expect(result.current.truncateText('Hello World', 5)).toBe('Hello...');
  });
});