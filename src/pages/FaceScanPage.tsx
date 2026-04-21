import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { User } from '../App'

type FaceScanPageProps = {
  user: User
}

type ScanResult = {
  status: string
  name?: string
  student_id?: string
  time?: string
}

export default function FaceScanPage({ user }: FaceScanPageProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [status, setStatus] = useState('Đang khởi động camera...')
  const [result, setResult] = useState<ScanResult | null>(null)
  const [streaming, setStreaming] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStreaming(true)
      setStatus('Đang quét...')
    } catch (error) {
      console.error(error)
      setStatus('Không thể mở camera')
    }
  }

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null
    stream?.getTracks().forEach((track) => track.stop())
  }

  const captureFrame = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return null

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg')
  }

  const handleScan = useCallback(async () => {
    if (!streaming) {
      setStatus('Camera chưa sẵn sàng')
      return
    }
    if (isScanning) return

    setIsScanning(true)
    setStatus('Đang nhận diện...')
    const image = captureFrame()
    if (!image) {
      setStatus('Không lấy được ảnh từ camera')
      setIsScanning(false)
      return
    }

    try {
      const res = await fetch('http://localhost:5000/attendance/face-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      })
      const data = await res.json()

      if (data.status === 'success') {
        setStatus('✅ Điểm danh thành công')
        setResult(data)
      } else if (data.status === 'already') {
        setStatus('⚠️ Bạn đã điểm danh rồi')
      } else {
        setStatus('❌ Không nhận diện được')
      }
    } catch (error) {
      console.error(error)
      setStatus('Lỗi server hoặc không kết nối được backend')
    } finally {
      setIsScanning(false)
    }
  }, [isScanning, streaming])

  useEffect(() => {
    if (!streaming) return
    const interval = setInterval(() => {
      void handleScan()
    }, 3000)
    return () => clearInterval(interval)
  }, [streaming, handleScan])

  return (
    <div className="min-h-screen bg-pink-50 p-6 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-xl shadow-pink-200/40 border border-pink-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-600">FaceScan</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">Điểm danh bằng khuôn mặt</h1>
              <p className="mt-2 text-slate-600">Chỉ dành cho học sinh đã được cấp tài khoản bởi admin.</p>
            </div>
            <Link to="/dashboard" className="inline-flex items-center justify-center rounded-2xl border border-pink-200 bg-pink-50 px-5 py-3 text-slate-900 transition hover:bg-pink-100">
              Quay lại dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-3xl bg-white p-6 shadow-lg shadow-pink-200/40 border border-pink-100">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-4 shadow-inner">
              <video ref={videoRef} className="h-[360px] w-full rounded-3xl object-cover" autoPlay muted playsInline />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/80 to-transparent" />
            </div>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-slate-700">{status}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleScan}
                  className="rounded-2xl bg-pink-600 px-5 py-3 text-white transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isScanning}
                >
                  {isScanning ? 'Đang quét...' : 'Quét ngay'}
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="rounded-2xl border border-pink-200 bg-white px-5 py-3 text-slate-900 transition hover:bg-pink-50"
                >
                  Quét lại
                </button>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="space-y-6 rounded-3xl bg-white p-6 shadow-lg shadow-pink-200/40 border border-pink-100">
            <div className="rounded-3xl border border-pink-100 bg-pink-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Tài khoản</h2>
              <p className="mt-2 text-slate-600">{user.name}</p>
              <p className="text-sm text-slate-500">{user.role === 'student' ? 'Học sinh' : 'Giảng viên'}</p>
            </div>
            <div className="rounded-3xl border border-pink-100 bg-pink-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Lưu ý</h2>
              <ul className="mt-3 space-y-2 text-slate-600">
                <li>• Camera phải bật và cho phép truy cập.</li>
                <li>• Không che mặt khi quét.</li>
                <li>• Hệ thống sẽ tự động gửi dữ liệu tới backend.</li>
              </ul>
            </div>
            {result && (
              <div className="rounded-3xl border border-pink-200 bg-pink-50 p-5 text-slate-900">
                <h2 className="text-lg font-semibold">Kết quả điểm danh</h2>
                <p className="mt-3">Tên: {result.name}</p>
                <p>MSSV: {result.student_id}</p>
                <p>Thời gian: {result.time}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
