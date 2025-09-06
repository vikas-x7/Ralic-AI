export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <svg
        className="mb-4 h-16 w-16 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <h2 className="mb-2 text-xl font-semibold text-gray-200">
        Start a new chat
      </h2>
      <p className="text-sm text-gray-400">
        Click &quot;New Chat&quot; in the sidebar to begin
      </p>
    </div>
  );
}
