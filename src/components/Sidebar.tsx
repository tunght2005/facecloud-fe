type Props = {
  setPage: (page: string) => void;
  role: string;
};

export default function Sidebar({ setPage, role }: Props) {
  return (
    <div className="w-60 h-screen bg-gradient-to-b from-pink-500 via-pink-200 to-white flex flex-col shadow-lg">
      
      <div className="p-4 text-xl font-bold border-b border-gray-300 text-black">
        Admin
      </div>

      <div className="flex flex-col mt-2 text-black">
        {/* 👑 admin thấy hết */}
        {role === "admin" && (
          <>
            <button
              onClick={() => setPage("teacher")}
              className="p-3 hover:bg-pink-300 text-left transition"
            >
              Teacher
            </button>

            <button
              onClick={() => setPage("class")}
              className="p-3 hover:bg-pink-300 text-left transition"
            >
              Class
            </button>
          </>
        )}

        {/* 👨‍🏫 teacher thấy student và class */}
        {(role === "admin" || role === "teacher") && (
          <>
            <button
              onClick={() => setPage("student")}
              className="p-3 hover:bg-pink-300 text-left transition"
            >
              Student
            </button>

          </>
        )}
      </div>
    </div>
  );
}