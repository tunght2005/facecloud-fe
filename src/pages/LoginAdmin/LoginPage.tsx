import { useState } from "react";

type Props = {
  onLogin: () => void;
};

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
  if (email === "admin@gmail.com" && password === "123456") {
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("role", "admin");
    onLogin();
  } else if (email === "teacher@gmail.com" && password === "123456") {
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("role", "teacher");
    onLogin();
  } else if (email === "student@gmail.com" && password === "123456") {
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("role", "student");
    onLogin();
  } else {
    alert("Sai tài khoản hoặc mật khẩu!");
  }
};

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-pink-500 via-pink-200 to-white">
      <div className="w-80 bg-pink-400 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-3 py-2 border rounded-lg bg-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-3 py-2 border rounded-lg bg-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
}