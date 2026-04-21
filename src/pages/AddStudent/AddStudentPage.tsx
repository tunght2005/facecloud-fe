import { useState } from "react";

type Props = {
  goBack: () => void;
  onAdd: (student: any) => void;
};

export default function AddStudentPage({ goBack, onAdd }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !password || !className) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    onAdd({
      name,
      email,
      password,
      class: className,
    });

    goBack();
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Thêm Học sinh mới</h2>
        <p className="mt-1 text-sm text-slate-400">Nhập thông tin học sinh để thêm vào hệ thống</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Họ và tên</label>
          <input
            placeholder="Nguyễn Văn A"
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            placeholder="student@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
          <input
            type="password"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Lớp</label>
          <input
            placeholder="CTK42"
            onChange={(e) => setClassName(e.target.value)}
            className="w-full rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
          <p className="text-sm text-rose-600">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="flex-1 rounded-2xl bg-pink-500 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-pink-400 hover:shadow-lg hover:shadow-pink-200/50"
        >
          Thêm Học sinh
        </button>
        <button
          onClick={goBack}
          className="flex-1 rounded-2xl border border-pink-200 bg-white py-3 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-pink-50 hover:border-pink-300"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}