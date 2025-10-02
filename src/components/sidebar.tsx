import React from "react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r bg-white dark:bg-gray-950 lg:flex">
      <nav className="flex-1 space-y-2 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
        >
          Chat
        </Link>
        <Link
          href="/documents"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
        >
          Documents
        </Link>
      </nav>
      {/* <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold dark:bg-gray-700">
            U
          </div>
          <div>
            <p className="font-semibold">User</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              user@example.com
            </p>
          </div>
        </div>
      </div> */}
    </aside>
  );
}
