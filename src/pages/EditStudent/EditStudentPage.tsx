import { useState } from "react";

type Props = {
  student: any;
  onUpdate: (student: any) => void;
  goBack: () => void;
};

export default function EditStudentPage({
  student,
  onUpdate,
  goBack,
}: Props) {
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [password, setPassword] = useState(student.password);
  const [className, setClassName] = useState(student.class);

  const handleSubmit = () => {
    onUpdate({
      ...student,
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
        <h2 className="text-2xl font-bold text-slate-800">Sửa Học sinh</h2>
        <p className="mt-1 text-sm text-slate-400">Cập nhật thông tin học sinh #{student.id}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Họ và tên</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Lớp</label>
          <input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="flex-1 rounded-2xl bg-pink-500 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-pink-400 hover:shadow-lg hover:shadow-pink-200/50"
        >
          Lưu thay đổi
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