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

  const handleSubmit = () => {
    if (!name || !email || !password || !className) {
      alert("Nhập đầy đủ!");
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
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Thêm Student</h2>

      <input placeholder="Tên" onChange={(e) => setName(e.target.value)} className="w-full mb-3 p-2 border" />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full mb-3 p-2 border" />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full mb-3 p-2 border" />
      <input placeholder="Class" onChange={(e) => setClassName(e.target.value)} className="w-full mb-3 p-2 border" />

      <button onClick={handleSubmit} className="bg-pink-500 text-white px-4 py-2 rounded">
        Thêm
      </button>
      <button onClick={goBack} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">
        Hủy
      </button>
    </div>
  );
}