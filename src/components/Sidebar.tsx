type Props = {
  setPage: (page: string) => void;
  role: string;
  currentPage?: string;
};

const navItems = [
  { key: "student", label: "Học sinh", icon: "👨‍🎓", roles: ["admin", "teacher"] },
  { key: "teacher", label: "Giáo viên", icon: "👨‍🏫", roles: ["admin"] },
  { key: "class", label: "Lớp học", icon: "🏫", roles: ["admin"] },
];

export default function Sidebar({ setPage, role, currentPage }: Props) {
  return (
    <aside className="flex w-64 flex-col border-r border-pink-100 bg-white shadow-xl shadow-pink-100/30">
      {/* Logo / Brand */}
      <div className="border-b border-pink-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-lg text-white shadow-md shadow-pink-200/50">
            ☁
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">FaceCloud</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-pink-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Quản lý
        </p>
        {navItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const isActive = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-pink-50 text-pink-700 shadow-sm shadow-pink-100 border border-pink-200"
                    : "text-slate-600 hover:bg-pink-50/60 hover:text-pink-600 border border-transparent"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="border-t border-pink-100 px-6 py-4">
        <div className="rounded-2xl bg-pink-50 p-3">
          <p className="text-xs font-medium text-pink-600">
            {role === "admin" ? "👑 Quản trị viên" : "👨‍🏫 Giáo viên"}
          </p>
          <p className="mt-1 text-xs text-slate-400">Đang đăng nhập</p>
        </div>
      </div>
    </aside>
  );
}