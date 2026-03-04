import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useTodayStats(machineId: string) {
  return useSWR(`/api/machines/${machineId}/today`, fetcher, {
    refreshInterval: 30000,
  });
}

export function useAggregates(machineId: string, days = 7) {
  return useSWR(`/api/machines/${machineId}/aggregates?days=${days}`, fetcher, {
    refreshInterval: 60000,
  });
}

export function useTelemetry(machineId: string, bucket = '1m') {
  const from = new Date(Date.now() - 3600 * 1000).toISOString();
  const to = new Date().toISOString();
  return useSWR(
    `/api/machines/${machineId}/telemetry?from=${from}&to=${to}&bucket=${bucket}`,
    fetcher,
    { refreshInterval: 30000 }
  );
}
