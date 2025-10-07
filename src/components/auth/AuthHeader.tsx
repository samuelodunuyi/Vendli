
import { Building2 } from 'lucide-react';

export function AuthHeader() {
  return (
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
        <Building2 className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">CW RETAIL</h1>
      <p className="text-gray-600">Admin Portal</p>
    </div>
  );
}
