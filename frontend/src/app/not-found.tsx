import { ErrorState } from '@/components/ErrorState'

export default function NotFound() {
  return (
    <ErrorState 
      code="404"
      message="The page you're looking for doesn't exist."
    />
  )
}