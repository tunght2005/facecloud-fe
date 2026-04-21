import Table from "../../components/Table";

type Props = {
  students: any[];
  goToAdd: () => void;
  onEdit: (student: any) => void;
  onDelete: (id: number) => void;
};

export default function StudentPage({
  students,
  goToAdd,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Quản lý Student</h2>

      <button
        onClick={goToAdd}
        className="mb-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
      >
        + Thêm Student
      </button>

      <Table
        columns={["id", "name", "email", "password", "class"]}
        data={students}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}