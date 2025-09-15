import { redirect } from 'next/navigation'

export default function Page() {
  // Redirect root path to the new Home route for consistent behavior in all environments
  redirect('/home')
}
