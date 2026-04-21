import { useState } from "react";

type Props = {
  goBack: () => void;
  onAdd: (teacher: any) => void;
};

export default function AddTeacherPage({ goBack, onAdd }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !password || !className) {
      alert("Nhập đầy đủ thông tin!");
      return;
    }

    onAdd({
      name,
      email,
      password,
      class: className, // ✅ đổi từ subject → class
    });

    goBack();
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Thêm Teacher</h2>

      <input
        type="text"
        placeholder="Họ và tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Lớp (VD: CTK42)"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        >
          Thêm
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