type ErrorMessageProps = { message?: string };

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  return (
    <div className="text-red-600 text-sm p-2 border border-red-200 bg-red-50 rounded">
      {message}
    </div>
  );
}
