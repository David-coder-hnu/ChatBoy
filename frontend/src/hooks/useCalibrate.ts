import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CalibrationCorrection, CalibrationResult } from '@/types'

async function submitCorrection(data: CalibrationCorrection): Promise<CalibrationResult> {
  const { data: result } = await api.post('/distillation/calibrate', data)
  return result
}

export function useCalibrate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitCorrection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clone-profile'] })
      queryClient.invalidateQueries({ queryKey: ['clone-stats'] })
    },
  })
}
