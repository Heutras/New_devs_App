import React, { useState, useEffect } from "react";
import { RevenueSummary } from "./RevenueSummary";
import Api from '../apiConfig';

// Define the shape of our city/property data
interface TenantProperty {
  id: string;
  name: string;
  property_count: number;
}

export const getTenantProperties = async (): Promise<any> => {
  // Your interceptor returns response.data directly
  return Api.get('/cities/user-accessible') as any; 
};

const Dashboard: React.FC = () => {
  // Change state to hold dynamic properties
  const [properties, setProperties] = useState<TenantProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTenantProperties()
      .then((res) => {
        // Log to verify the response shape
        console.log('API Response:', res);
        
        if (res.cities && res.cities.length > 0) {
          setProperties(res.cities);
          // Auto-select the first property in the list
          setSelectedProperty(res.cities[0].id);
        }
      })
      .catch(err => {
        console.error("Fetch failed:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-4 lg:p-6 flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 min-h-full">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Property Management Dashboard</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <h2 className="text-lg lg:text-xl font-medium text-gray-900 mb-2">Revenue Overview</h2>
                <p className="text-sm lg:text-base text-gray-600">
                  Monthly performance insights for your properties
                </p>
              </div>
              
              {/* Property Selector */}
              <div className="flex flex-col sm:items-end">
                <label className="text-xs font-medium text-gray-700 mb-1">Select Property</label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="block w-full sm:w-auto min-w-[200px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {/* Map over dynamic properties state */}
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name} ({property.property_count})
                    </option>
                  ))}
                  {properties.length === 0 && (
                    <option value="">No properties available</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Only render summary if a property is selected */}
            {selectedProperty ? (
              <RevenueSummary propertyId={selectedProperty} />
            ) : (
              <div className="text-center py-10 text-gray-400">
                Please select a property to view revenue data.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;