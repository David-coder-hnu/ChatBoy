import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface DailyBrief {
  brief: string | null
  activity_count: number
  message: string
}

async function fetchDailyBrief(): Promise<DailyBrief> {
  const { data } = await api.get('/clones/me/daily-brief')
  return data
}

export function useDailyBrief() {
  return useQuery<DailyBrief>({
    queryKey: ['daily-brief'],
    queryFn: fetchDailyBrief,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  })
}
