import { useCallback, useState } from 'react';
import { Heart, X, Check } from 'lucide-react';
import { Loader } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../components/Avatar';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { useAuth } from '../context/authContext';
import { respondToConnectionRequest } from '../services/connectionService';
import { getUserRequests } from '../services/userServices';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function NotificationsPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState({}); // State to track feedback messages per notification

  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['userRequests', token],
    queryFn: () => getUserRequests(token),
    enabled: !!token,
    staleTime: 30000,
    gcTime: 300000,
  });
  const notifications = data?.data?.data?.data || [];

   const formatTime = useCallback((date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }, []);


  const respondMutation = useMutation({
    mutationFn: ({ status, connectionId }) => respondToConnectionRequest(token, status, connectionId),
    onSuccess: (data, variables) => {
      setFeedback((prev) => ({
        ...prev,
        [variables.connectionId]: { type: 'success', message: `Request ${variables.status} successfully` }
      }));
      queryClient.invalidateQueries(['userRequests', token]);
      // Clear feedback after 3 seconds
      setTimeout(() => {
        setFeedback((prev) => ({ ...prev, [variables.connectionId]: null }));
      }, 3000);
    },
    onError: (error, variables) => {
      setFeedback((prev) => ({
        ...prev,
        [variables.connectionId]: { type: 'error', message: error.response?.data?.message || 'Failed to process request' }
      }));
      // Clear feedback after 3 seconds
      setTimeout(() => {
        setFeedback((prev) => ({ ...prev, [variables.connectionId]: null }));
      }, 3000);
    },
  });

  const handleAccept = useCallback((notification) => {
    respondMutation.mutate({ status: 'accepted', connectionId: notification._id });
  }, [respondMutation]);

  const handleReject = useCallback((notification) => {
    respondMutation.mutate({ status: 'rejected', connectionId: notification._id });
  }, [respondMutation]);

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 animate-spin text-gray-500" />
  
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Failed to load notifications</h3>
          <p className="text-gray-500 mt-1">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const totalNotifications = notifications?.length || 0;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {totalNotifications > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {totalNotifications} total
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {notifications?.map((notification) => (
          <Card
            key={notification._id}
            className="transition-all duration-200 hover:shadow-md border-gray-200"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={notification.fromUserId?.profile}
                      alt={`${notification.fromUserId?.firstname} ${notification.fromUserId?.lastname}'s avatar`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                      {notification.fromUserId?.firstname?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                    <Heart className="h-4 w-4 text-pink-500" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-gray-900">
                        {notification.fromUserId?.firstname} {notification.fromUserId?.lastname}
                      </span>
                      <span className="text-gray-700 ml-1">is {notification.status}</span>
                    </div>
                    <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                      {formatTime(notification.createdAt)} 
                    </span>
                  </div>

                  {feedback[notification._id] && (
                    <div className={`text-sm mt-2 ${feedback[notification._id].type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {feedback[notification._id].message}
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(notification)}
                      className="flex items-center gap-1 text-gray-600 hover:text-red-600 hover:border-red-300"
                      disabled={respondMutation.isLoading}
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAccept(notification)}
                      className="flex items-center gap-1 bg-pink-500 hover:bg-pink-600 text-white"
                      disabled={respondMutation.isLoading}
                    >
                      <Check className="h-4 w-4" />
                      Accept
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {totalNotifications === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No new notifications</h3>
        </div>
      )}
    </div>
  );
}