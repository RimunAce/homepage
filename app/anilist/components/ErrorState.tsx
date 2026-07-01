export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-red-100 border-2 border-red-500 p-4 mb-4">
      <p className="text-red-700 retro-text">Error: {message}</p>
      <button className="retro-button mt-2 text-sm" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
