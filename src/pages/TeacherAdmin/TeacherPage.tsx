import Table from "../../components/Table";

type Props = {
  teachers: any[];
  goToAdd: () => void;
  onEdit: (teacher: any) => void;
  onDelete: (id: number) => void;
};

export default function TeacherPage({
  teachers,
  goToAdd,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Giáo viên</h2>
          <p className="mt-1 text-sm text-slate-400">Thêm, sửa, xoá thông tin giáo viên trong hệ thống</p>
        </div>

        <button
          onClick={goToAdd}
          className="inline-flex items-center gap-2 rounded-2xl bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-pink-400 hover:shadow-lg hover:shadow-pink-200/50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Thêm Giáo viên
        </button>
      </div>

      <div className="rounded-3xl border border-pink-100 bg-pink-50/40 p-4">
        <p className="text-sm text-slate-500">
          Tổng cộng: <span className="font-semibold text-pink-600">{teachers.length}</span> giáo viên
        </p>
      </div>

      <Table
        columns={["id", "name", "email", "password", "class"]}
        data={teachers}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}