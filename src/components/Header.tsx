// components/Header.tsx

type Props = {
  onLogout: () => void;
};

export default function Header({ onLogout }: Props) {
  return (
    <div className="flex justify-between items-center mb-6 bg-white rounded-lg overflow-hidden p-3 shadow-md">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <button
        onClick={onLogout}
        className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}