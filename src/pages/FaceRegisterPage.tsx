import { useRef, useState, useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import faceApi from '~/apis/face.api'
import PATHS from '~/constants/paths'
import { FiCamera, FiUpload, FiCheck, FiRefreshCw, FiLock } from 'react-icons/fi'

export default function FaceRegisterPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [capturedFile, setCapturedFile] = useState<File | null>(null)
  const queryClient = useQueryClient()

  // Kiểm tra trạng thái profile hiện tại
  const { data: profileRes, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['face-profile-status'],
    queryFn: () => faceApi.getProfile(),
    retry: false
  })

  const hasProfile = (profileRes?.data as any)?.has_profile
  const canUpdate = (profileRes?.data as any)?.face_profile?.can_update_face

  const registerMutation = useMutation({
    mutationFn: faceApi.register,
    onSuccess: (data: any) => {
      const confidence = data?.data?.aws?.confidence
      toast.success(`Đăng ký khuôn mặt thành công! ${confidence ? `(Độ tin cậy: ${confidence.toFixed(2)}%)` : ''}`)
      setCapturedImage(null)
      queryClient.invalidateQueries({ queryKey: ['face-profile-status'] })
      queryClient.invalidateQueries({ queryKey: ['face-profile'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Đăng ký thất bại')
    }
  })

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setStream(mediaStream)
      setCapturedImage(null)
    } catch {
      toast.error('Không thể truy cập camera')
    }
  }, [])

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
    const base64 = canvas.toDataURL('image/jpeg')
    setCapturedImage(base64)
    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], `face-${Date.now()}.jpg`, { type: 'image/jpeg' })
      setCapturedFile(file)
    }, 'image/jpeg')

    // Stop camera
    stream?.getTracks().forEach((t) => t.stop())
    setStream(null)
  }, [stream])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setCapturedImage(String(reader.result || ''))
      setCapturedFile(file)
      stream?.getTracks().forEach((t) => t.stop())
      setStream(null)
    }
    reader.readAsDataURL(file)
  }

  const handleRegister = async () => {
    if (!capturedImage || !capturedFile) return

    try {
      const uploadRes = await faceApi.uploadImage(capturedFile, 'face')
      registerMutation.mutate({ imageBase64: capturedImage, face_image_url: uploadRes.data.image_url })
    } catch (error) {
      console.error(error)
      toast.error('Upload ảnh thất bại, vui lòng thử lại')
    }
  }

  if (isLoadingProfile) {
    return <div className='py-20 text-center text-slate-400'>Đang kiểm tra trạng thái...</div>
  }

  const isLocked = hasProfile && !canUpdate

  return (
    <div className='min-h-screen bg-pink-50 px-4 py-10'>
      <div className='mx-auto max-w-xl'>
        <Link
          to={PATHS.DASHBOARD}
          className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-500'
        >
          ← Quay lại Dashboard
        </Link>

        <div className='rounded-3xl border border-pink-200 bg-white p-8 shadow-lg shadow-pink-100/50'>
          <h1 className='mb-2 text-2xl font-bold text-slate-900'>Đăng ký khuôn mặt</h1>
          <p className='mb-6 text-sm text-slate-500'>Chụp ảnh khuôn mặt để đăng ký vào hệ thống nhận diện.</p>

          {isLocked ? (
            <div className='rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center'>
              <FiLock className='mx-auto mb-3 text-4xl text-amber-500' />
              <h3 className='text-lg font-bold text-amber-800'>Chức năng đã khoá</h3>
              <p className='mt-2 text-sm text-amber-700'>
                Bạn đã đăng ký khuôn mặt thành công. Để cập nhật lại ảnh mới, vui lòng liên hệ Giáo viên hoặc Admin để yêu cầu mở quyền cập nhật.
              </p>
              <Link
                to={PATHS.PROFILE}
                className='mt-4 inline-block text-sm font-bold text-pink-600 hover:underline'
              >
                Xem khuôn mặt hiện tại của bạn trong hồ sơ →
              </Link>
            </div>
          ) : (
            <>
              {hasProfile && canUpdate && (
                <div className='mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 border border-emerald-100'>
                  <FiCheck className='shrink-0' />
                  <span>Bạn đã được cấp quyền cập nhật lại khuôn mặt. Ảnh mới sẽ thay thế ảnh cũ.</span>
                </div>
              )}

              <div className='overflow-hidden rounded-2xl border border-pink-200 bg-slate-900'>
                {capturedImage ? (
                  <img src={capturedImage} alt='Captured' className='aspect-video w-full object-cover' />
                ) : (
                  <video ref={videoRef} autoPlay playsInline muted className='aspect-video w-full object-cover' />
                )}
              </div>
              <canvas ref={canvasRef} className='hidden' />

              <div className='mt-6 flex flex-wrap gap-3'>
                {!stream && !capturedImage && (
                  <>
                    <button
                      onClick={startCamera}
                      className='flex-1 flex items-center justify-center gap-2 rounded-2xl bg-pink-500 py-3 text-sm font-semibold text-white transition hover:bg-pink-400'
                    >
                      <FiCamera /> Mở Camera
                    </button>
                    <button
                      type='button'
                      onClick={() => fileInputRef.current?.click()}
                      className='flex-1 flex items-center justify-center gap-2 rounded-2xl border border-pink-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-pink-50'
                    >
                      <FiUpload /> Chọn ảnh từ máy
                    </button>
                    <input ref={fileInputRef} type='file' accept='image/*' onChange={handleFileChange} className='hidden' />
                  </>
                )}
                {stream && (
                  <button
                    onClick={capture}
                    className='flex-1 flex items-center justify-center gap-2 rounded-2xl bg-pink-500 py-3 text-sm font-semibold text-white transition hover:bg-pink-400'
                  >
                    <FiCamera /> Chụp ảnh
                  </button>
                )}
                {capturedImage && (
                  <>
                    <button
                      onClick={handleRegister}
                      disabled={registerMutation.isPending}
                      className='flex-1 flex items-center justify-center gap-2 rounded-2xl bg-pink-500 py-3 text-sm font-semibold text-white transition hover:bg-pink-400 disabled:opacity-60'
                    >
                      {registerMutation.isPending ? <FiRefreshCw className='animate-spin' /> : <FiCheck />}
                      {registerMutation.isPending ? 'Đang gửi...' : 'Xác nhận đăng ký'}
                    </button>
                    <button
                      onClick={startCamera}
                      className='rounded-2xl border border-pink-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-pink-50'
                    >
                      Chụp lại
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
