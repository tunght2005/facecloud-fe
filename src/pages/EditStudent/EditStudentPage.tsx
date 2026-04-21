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
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Sửa Student</h2>

      <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-3 p-2 border" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-3 p-2 border" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-3 p-2 border" />
      <input value={className} onChange={(e) => setClassName(e.target.value)} className="w-full mb-3 p-2 border" />

      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
        Lưu
      </button>

      <button onClick={goBack} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">
        Hủy
      </button>
    </div>
  );
}