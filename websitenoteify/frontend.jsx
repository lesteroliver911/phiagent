import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, RefreshCw, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WebsiteMonitor = () => {
  const [monitoringData, setMonitoringData] = useState({
    websites: [
      {
        url: "https://www.children.alabama.gov/first-class-prek/aseld/",
        status: "unchanged",
        lastChecked: new Date().toISOString(),
        changeHistory: []
      },
      {
        url: "https://www.cde.ca.gov/sp/cd/re/psframework.asp",
        status: "changed",
        lastChecked: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        changeHistory: [
          { date: new Date(Date.now() - 3600000).toISOString(), type: "Content Update" }
        ]
      },
      {
        url: "https://www.fibonacciskills.com",
        status: "uncertain",
        lastChecked: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        changeHistory: []
      }
    ],
    lastUpdate: new Date().toISOString()
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh - in real implementation, this would call the backend
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'changed':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'unchanged':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'uncertain':
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'changed':
        return 'Changed';
      case 'unchanged':
        return 'Unchanged';
      case 'uncertain':
        return 'Uncertain';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getFilteredAndSortedWebsites = () => {
    return monitoringData.websites
      .filter(website => statusFilter === 'all' || website.status === statusFilter)
      .sort((a, b) => new Date(b.lastChecked) - new Date(a.lastChecked));
  };

  const FilterButton = ({ status, label, count }) => (
    <button
      onClick={() => setStatusFilter(status)}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        statusFilter === status 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label} ({count})
    </button>
  );

  const getStatusCounts = () => {
    return monitoringData.websites.reduce((acc, website) => {
      acc[website.status] = (acc[website.status] || 0) + 1;
      return acc;
    }, {});
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Website Monitor Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <Alert>
        <AlertDescription>
          Last updated: {formatDate(monitoringData.lastUpdate)}
        </AlertDescription>
      </Alert>

      <div className="flex gap-2 items-center bg-gray-50 p-4 rounded-lg">
        <Filter className="h-5 w-5 text-gray-500" />
        <div className="flex gap-2">
          <FilterButton status="all" label="All" count={monitoringData.websites.length} />
          <FilterButton status="changed" label="Changed" count={statusCounts.changed || 0} />
          <FilterButton status="unchanged" label="Unchanged" count={statusCounts.unchanged || 0} />
          <FilterButton status="uncertain" label="Uncertain" count={statusCounts.uncertain || 0} />
        </div>
      </div>

      <div className="grid gap-6">
        {getFilteredAndSortedWebsites().map((website, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">
                  {website.url}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(website.status)}
                  <span className="text-sm text-gray-500">
                    Status: {getStatusLabel(website.status)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">
                  Last checked: {formatDate(website.lastChecked)}
                </div>
                {website.changeHistory.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Recent Changes:</h4>
                    <ul className="space-y-2">
                      {website.changeHistory.map((change, idx) => (
                        <li key={idx} className="text-sm">
                          {formatDate(change.date)} - {change.type}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WebsiteMonitor;