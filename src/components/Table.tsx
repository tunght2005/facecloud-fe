type Props = {
  columns: string[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (id: number) => void;
};

const columnLabels: Record<string, string> = {
  id: "ID",
  name: "Họ tên",
  email: "Email",
  password: "Mật khẩu",
  class: "Lớp",
  teacher: "Giáo viên",
  total: "Sĩ số",
};

export default function Table({ columns, data, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-pink-100">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-pink-100 bg-pink-50/80">
            {columns.map((col) => (
              <th
                key={col}
                className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-pink-600"
              >
                {columnLabels[col] || col}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-pink-600">
                Thao tác
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-pink-50">
          {data.map((row, i) => (
            <tr
              key={i}
              className="transition-colors duration-150 hover:bg-pink-50/40"
            >
              {columns.map((col) => (
                <td key={col} className="px-5 py-3.5 text-slate-700">
                  {col === "password" ? (
                    <span className="tracking-wider text-slate-400">••••••</span>
                  ) : (
                    row[col]
                  )}
                </td>
              ))}

              {(onEdit || onDelete) && (
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-pink-200 bg-white px-3 py-1.5 text-xs font-medium text-pink-600 transition-all duration-200 hover:bg-pink-50 hover:border-pink-300 hover:shadow-sm"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Sửa
                      </button>
                    )}

                    {onDelete && (
                      <button
                        onClick={() => onDelete(row.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-500 transition-all duration-200 hover:bg-rose-50 hover:border-rose-300 hover:shadow-sm"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Xoá
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                className="px-5 py-10 text-center text-slate-400"
              >
                Chưa có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}