type Props = {
  columns: string[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (id: number) => void;
};

export default function Table({ columns, data, onEdit, onDelete }: Props) {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} className="border p-2">{col}</th>
          ))}
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={col} className="border p-2">
                {col === "password" ? "******" : row[col]}
              </td>
            ))}

            <td className="border p-2 space-x-2">
              <button
                onClick={() => onEdit?.(row)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete?.(row.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}