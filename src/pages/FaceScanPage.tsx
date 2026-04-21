import { useCallback, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import attendanceApi from '~/apis/attendance.api'
import faceApi from '~/apis/face.api'
import PATHS from '~/constants/paths'
import type { AttendanceSession } from '~/types'
import { FiCamera, FiCheckCircle, FiXCircle, FiRefreshCw, FiChevronLeft } from 'react-icons/fi'

export default function FaceScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [selectedSession, setSelectedSession] = useState<number | null>(null)
  const [scanResult, setScanResult] = useState<{ similarity: number; success: boolean } | null>(null)

  const { data: sessionsData } = useQuery({
    queryKey: ['open-sessions'],
    queryFn: () => attendanceApi.getSessionList({ status: 'open' })
  })
  const sessions = Array.isArray(sessionsData?.data?.sessions) ? sessionsData.data.sessions : []

  const scanMutation = useMutation({
    mutationFn: attendanceApi.scan,
    onSuccess: (data: any) => {
      const similarity = data?.data?.verification?.similarity || 0
      setScanResult({ similarity, success: true })
      toast.success(`Điểm danh thành công! Độ tương đồng: ${similarity.toFixed(2)}%`)
      stopCamera()
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Điểm danh thất bại'
      const similarity = error.response?.data?.similarity
      setScanResult({ similarity: similarity || 0, success: false })
      toast.error(msg)
    }
  })

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setStream(mediaStream)
      setScanResult(null)
    } catch {
      toast.error('Không thể truy cập camera')
    }
  }, [])

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop())
    setStream(null)
  }, [stream])

  const handleScan = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !selectedSession) {
      toast.error('Vui lòng chọn buổi điểm danh trước!')
      return
    }
    const canvas = canvasRef.current
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
    const base64 = canvas.toDataURL('image/jpeg')

    canvas.toBlob(async (blob) => {
      try {
        let capturedImageUrl: string | undefined
        if (blob) {
          const file = new File([blob], `captured-${Date.now()}.jpg`, { type: 'image/jpeg' })
          const uploadRes = await faceApi.uploadImage(file, 'captured')
          capturedImageUrl = uploadRes.data.image_url
        }

        scanMutation.mutate({
          imageBase64: base64,
          attendance_session_id: selectedSession,
          captured_image_url: capturedImageUrl
        })
      } catch (error) {
        console.error(error)
        toast.error('Upload ảnh điểm danh thất bại')
      }
    }, 'image/jpeg')
  }, [selectedSession, scanMutation])

  return (
    <div className='min-h-screen bg-pink-50 px-4 py-10'>
      <div className='mx-auto max-w-xl'>
        <Link
          to={PATHS.DASHBOARD}
          className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-500'
        >
          <FiChevronLeft /> Quay lại Dashboard
        </Link>

        <div className='rounded-3xl border border-pink-200 bg-white p-8 shadow-lg shadow-pink-100/50'>
          <h1 className='mb-2 text-2xl font-bold text-slate-900'>Điểm danh bằng khuôn mặt</h1>
          <p className='mb-6 text-sm text-slate-500'>Quét khuôn mặt để ghi nhận điểm danh tự động.</p>

          {/* Session selector */}
          <div className='mb-6'>
            <label className='mb-1.5 block text-sm font-medium text-slate-700'>Chọn buổi điểm danh</label>
            <select
              value={selectedSession || ''}
              onChange={(e) => setSelectedSession(Number(e.target.value))}
              className='w-full rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20'
            >
              <option value=''>-- Chọn buổi --</option>
              {sessions.map((s: AttendanceSession) => {
                const dateStr = s.session_date
                  ? new Date(s.session_date).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })
                  : ''
                const formatTime = (val: string | null | undefined) => {
                  if (!val) return ''
                  const d = new Date(val)
                  if (isNaN(d.getTime())) return val
                  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                }
                return (
                  <option key={s.attendance_session_id} value={s.attendance_session_id}>
                    {s.class_name || `Lớp ${s.class_id}`} — {dateStr || s.session_date} ({formatTime(s.start_time)} - {formatTime(s.end_time)})
                  </option>
                )
              })}
            </select>
            {sessions.length === 0 && (
              <p className='mt-2 text-xs text-slate-400'>Không có buổi điểm danh nào đang mở.</p>
            )}
          </div>

          {/* Camera */}
          <div className='overflow-hidden rounded-2xl border border-pink-200 bg-slate-900'>
            <video ref={videoRef} autoPlay playsInline muted className='aspect-video w-full object-cover' />
          </div>
          <canvas ref={canvasRef} className='hidden' />

          {scanResult && (
            <div
              className={`mt-6 rounded-2xl border p-4 ${scanResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  {scanResult.success ? (
                    <FiCheckCircle className='text-3xl text-green-500' />
                  ) : (
                    <FiXCircle className='text-3xl text-red-500' />
                  )}
                  <div>
                    <p className={`text-sm font-bold ${scanResult.success ? 'text-green-700' : 'text-red-700'}`}>
                      {scanResult.success ? 'Khớp khuôn mặt' : 'Không khớp / Lỗi'}
                    </p>
                    <p className='text-xs text-slate-500'>Độ tương đồng: {scanResult.similarity.toFixed(1)}%</p>
                  </div>
                </div>
                {!scanResult.success && !stream && (
                  <button
                    onClick={startCamera}
                    className='rounded-xl bg-pink-100 p-2 text-pink-600 transition hover:bg-pink-200'
                    title='Thử lại'
                  >
                    <FiRefreshCw />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className='mt-6 flex flex-wrap gap-3'>
            {!stream ? (
              <button
                onClick={startCamera}
                className='flex-1 flex items-center justify-center gap-2 rounded-2xl bg-pink-500 py-3 text-sm font-semibold text-white transition hover:bg-pink-400'
              >
                <FiCamera /> {scanResult ? 'Quét lại' : 'Mở Camera'}
              </button>
            ) : (
              <>
                <button
                  onClick={handleScan}
                  disabled={scanMutation.isPending || !selectedSession}
                  className='flex-1 flex items-center justify-center gap-2 rounded-2xl bg-pink-500 py-3 text-sm font-semibold text-white transition hover:bg-pink-400 disabled:opacity-60'
                >
                  {scanMutation.isPending ? <FiRefreshCw className='animate-spin' /> : <FiCamera />}
                  {scanMutation.isPending ? 'Đang quét...' : 'Xác nhận quét mặt'}
                </button>
                <button
                  onClick={stopCamera}
                  className='rounded-2xl border border-pink-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-pink-50'
                >
                  Huỷ
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
