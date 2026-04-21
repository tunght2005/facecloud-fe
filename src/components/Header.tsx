// components/Header.tsx

type Props = {
  onLogout: () => void;
};

export default function Header({ onLogout }: Props) {
  return (
    <header className="sticky top-0 z-10 border-b border-pink-100 bg-white/80 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-sm text-slate-400">Quản lý hệ thống FaceCloud School</p>
        </div>

        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-2xl border border-pink-200 bg-white px-5 py-2.5 text-sm font-semibold text-pink-600 transition-all duration-200 hover:bg-pink-50 hover:border-pink-300 hover:shadow-md hover:shadow-pink-100/50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Đăng xuất
        </button>
      </div>
    </header>
  );
}