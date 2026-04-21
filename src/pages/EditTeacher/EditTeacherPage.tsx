import { useState, useEffect } from "react";

type Props = {
  teacher: any;
  onUpdate: (teacher: any) => void;
  goBack: () => void;
};

export default function EditTeacherPage({
  teacher,
  onUpdate,
  goBack,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("");

  // ✅ set dữ liệu khi teacher có
  useEffect(() => {
    if (teacher) {
      setName(teacher.name);
      setEmail(teacher.email);
      setPassword(teacher.password);
      setClassName(teacher.class);
    }
  }, [teacher]);

  // ✅ chặn trắng màn hình
  if (!teacher) {
    return <div className="text-center mt-10">Không có dữ liệu teacher</div>;
  }

  const handleSubmit = () => {
    onUpdate({
      ...teacher,
      name,
      email,
      password,
      class: className,
    });

    goBack();
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Sửa Teacher</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-500 text-white py-2 rounded"
        >
          Lưu
        </button>

        <button
          onClick={goBack}
          className="flex-1 bg-gray-300 py-2 rounded"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}