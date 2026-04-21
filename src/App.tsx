import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import LoginPage from "./pages/LoginAdmin";
import TeacherPage from "./pages/TeacherAdmin";
import StudentPage from "./pages/StudentAdmin";
import ClassPage from "./pages/ClassAdmin";

import AddStudentPage from "./pages/AddStudent";
import EditStudentPage from "./pages/EditStudent";

import AddTeacherPage from "./pages/AddTeacher";
import EditTeacherPage from "./pages/EditTeacher";

export default function App() {
  const [page, setPage] = useState("student");

  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("isLogin") === "true"
  );

  const [role, setRole] = useState(
    localStorage.getItem("role") || ""
  );

  // ===== STUDENT =====
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Nguyen Van A",
      email: "a@gmail.com",
      password: "123456",
      class: "CTK42",
    },
  ]);

  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const handleAddStudent = (student: any) => {
    setStudents((prev) => [...prev, { ...student, id: Date.now() }]);
  };

  const handleUpdateStudent = (updated: any) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  };

  const handleDeleteStudent = (id: number) => {
    if (!confirm("Xoá student?")) return;
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // ===== TEACHER =====
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Le Van C",
      email: "c@gmail.com",
      password: "123456",
      class: "CTK42",
    },
  ]);

  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  const handleAddTeacher = (teacher: any) => {
    setTeachers((prev) => [...prev, { ...teacher, id: Date.now() }]);
  };

  const handleUpdateTeacher = (updated: any) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  const handleDeleteTeacher = (id: number) => {
    if (!confirm("Xoá teacher?")) return;
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  // ===== AUTH =====
  const handleLogin = () => {
    const role = localStorage.getItem("role") || "";
    setIsLogin(true);
    setRole(role);

    if (role === "teacher") setPage("student");
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLogin(false);
    setRole("");
  };

  // ===== RENDER =====
  const renderPage = () => {
    if (role === "student") {
      return <h2 className="text-red-500">Không có quyền</h2>;
    }

    switch (page) {
      case "student":
        return (
          <StudentPage
            students={students}
            goToAdd={() => setPage("add-student")}
            onEdit={(s) => {
              setSelectedStudent(s);
              setPage("edit-student");
            }}
            onDelete={handleDeleteStudent}
          />
        );

      case "add-student":
        return (
          <AddStudentPage
            onAdd={handleAddStudent}
            goBack={() => setPage("student")}
          />
        );

      case "edit-student":
        return (
          <EditStudentPage
            student={selectedStudent}
            onUpdate={handleUpdateStudent}
            goBack={() => setPage("student")}
          />
        );

      case "teacher":
        return role === "admin" ? (
          <TeacherPage
            teachers={teachers}
            goToAdd={() => setPage("add-teacher")}
            onEdit={(t) => {
              setSelectedTeacher(t);
              setPage("edit-teacher");
            }}
            onDelete={handleDeleteTeacher}
          />
        ) : null;

      case "add-teacher":
        return (
          <AddTeacherPage
            onAdd={handleAddTeacher}
            goBack={() => setPage("teacher")}
          />
        );

      case "edit-teacher":
        return (
          <EditTeacherPage
            teacher={selectedTeacher}
            onUpdate={handleUpdateTeacher}
            goBack={() => setPage("teacher")}
          />
        );

      case "class":
        return role === "admin" ? <ClassPage /> : null;

      default:
        return null;
    }
  };

  if (!isLogin) return <LoginPage onLogin={handleLogin} />;

  if (role === "student") {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-pink-500 to-white">
        <h2 className="text-xl text-red-500">
          Bạn không có quyền vào Admin
        </h2>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar setPage={setPage} role={role} />

      <div className="flex-1 min-h-screen p-6 bg-gradient-to-b from-pink-600 via-pink-200 to-white">
        <Header onLogout={handleLogout} />

        <div className="bg-white p-6 rounded-xl shadow">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}