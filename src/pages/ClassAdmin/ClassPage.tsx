import Table from "../../components/Table";

export default function ClassPage() {
  const classes = [
    {
      id: 1,
      name: "CTK42",
      teacher: "Nguyen Van T",
      total: 40,
    },
    {
      id: 2,
      name: "CTK43",
      teacher: "Tran Van H",
      total: 35,
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Quản lý Lớp</h2>

      <button className="mb-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-red-600">
        + Thêm Lớp
      </button>

      <Table
        columns={["id", "name", "teacher", "total"]}
        data={classes}
      />
    </div>
  );
}