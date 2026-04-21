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
    <div>
      <h2 className="text-xl font-bold mb-4">Quản lý Teacher</h2>

      <button
        onClick={goToAdd}
        className="mb-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
      >
        + Thêm Teacher
      </button>

      <Table
        columns={["id", "name", "email", "password", "class"]}
        data={teachers}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}