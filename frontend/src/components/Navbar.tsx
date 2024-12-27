import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4 text-white">
        <li>
          <Link href="/admin">Admin</Link>
        </li>
        <li>
          <Link href="/employee">Employee</Link>
        </li>
      </ul>
    </nav>
  );
}
