import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="flex min-h-screen noise">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 max-w-6xl">
        <Outlet />
      </main>
    </div>
  )
}
