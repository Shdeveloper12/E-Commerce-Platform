import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-2">Manage store settings and configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Configure your store details, contact information, and branding.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Manage payment gateways and methods.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Configure shipping zones, methods, and rates.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Set up tax rates and rules.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Configure email templates and notifications.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Manage authentication and security options.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
