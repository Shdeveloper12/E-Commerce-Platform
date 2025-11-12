import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function CheckRolePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You need to log in first.</p>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fetch fresh user data from database
  const dbUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>User Role & Session Check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Session Data */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Session Data (From Token)</h3>
            <div className="bg-gray-100 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{session.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{session.user.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Role (Session):</span>
                <span className={`px-2 py-1 rounded ${
                  session.user.role === 'ADMIN' ? 'bg-purple-200 text-purple-800' :
                  session.user.role === 'MODERATOR' ? 'bg-blue-200 text-blue-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  {session.user.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">User ID:</span>
                <span className="text-sm font-mono">{session.user.id}</span>
              </div>
            </div>
          </div>

          {/* Database Data */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Database Data (Real-time)</h3>
            {dbUser ? (
              <div className="bg-gray-100 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{dbUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{`${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim() || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Role (Database):</span>
                  <span className={`px-2 py-1 rounded ${
                    dbUser.role === 'ADMIN' ? 'bg-purple-200 text-purple-800' :
                    dbUser.role === 'MODERATOR' ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {dbUser.role}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Active:</span>
                  <span className={dbUser.isActive ? 'text-green-600' : 'text-red-600'}>
                    {dbUser.isActive ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Created:</span>
                  <span className="text-sm">{new Date(dbUser.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Updated:</span>
                  <span className="text-sm">{new Date(dbUser.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-red-600">User not found in database!</p>
            )}
          </div>

          {/* Status Check */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Access Status</h3>
            <div className="bg-gray-100 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Can Access Admin Panel:</span>
                <span className={`px-3 py-1 rounded font-semibold ${
                  session.user.role === 'ADMIN' || session.user.role === 'MODERATOR' 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-red-200 text-red-800'
                }`}>
                  {session.user.role === 'ADMIN' || session.user.role === 'MODERATOR' ? 'YES ✓' : 'NO ✗'}
                </span>
              </div>
              
              {dbUser && session.user.role !== dbUser.role && (
                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
                  <p className="text-yellow-800 font-medium">⚠️ Role Mismatch Detected!</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your session role ({session.user.role}) doesn't match your database role ({dbUser.role}).
                  </p>
                  <p className="text-sm text-yellow-700 font-semibold mt-2">
                    Please LOG OUT and LOG BACK IN to sync your role!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4">
            <div className="flex gap-3">
              {(session.user.role === 'ADMIN' || session.user.role === 'MODERATOR') && (
                <Link href="/admin" className="flex-1">
                  <Button className="w-full">Go to Admin Panel</Button>
                </Link>
              )}
            </div>
            
            <div className="flex gap-3">
              <Link href="/api/auth/signout" className="flex-1">
                <Button variant="destructive" className="w-full">
                  🚪 Log Out (Required to Update Role)
                </Button>
              </Link>
            </div>

            <div className="flex gap-3">
              <Link href="/api/debug-session" target="_blank" className="flex-1">
                <Button variant="outline" className="w-full">
                  🔍 View Debug JSON
                </Button>
              </Link>
            </div>
          </div>

          {/* Troubleshooting */}
          {session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR' && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-semibold text-blue-900 mb-2">📋 How to Become Admin:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Update your role in the database:
                  <code className="block bg-blue-100 p-2 mt-1 rounded text-xs">
                    UPDATE users SET role = 'ADMIN' WHERE email = '{session.user.email}';
                  </code>
                </li>
                <li>Click "Log Out" button above</li>
                <li>Clear your browser cookies (or use incognito mode)</li>
                <li>Log back in at /login</li>
                <li>Visit /admin</li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
