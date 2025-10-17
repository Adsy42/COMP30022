import Link from 'next/link';
import Button from './Button';

interface ErrorStateProps {
  message?: string;
  code?: string;
}

export function ErrorState({ message = "Something went wrong", code = "404" }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-900 mb-4">{code}</h1>
        <p className="text-xl text-gray-600 mb-8">{message}</p>
        <Link href="/admin">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}