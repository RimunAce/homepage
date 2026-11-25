import styles from "../anilist.module.css";

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className={styles.error} role="alert">
      <p className={styles.errorMessage}>Error: {message}</p>
      <button type="button" className="retro-button" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
