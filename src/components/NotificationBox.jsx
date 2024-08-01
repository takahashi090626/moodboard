import React, { useState, useEffect } from 'react';
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../styles/StyledComponents';
import styled from 'styled-components';

const NotificationContainer = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 20px;
`;

const NotificationItem = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
`;

function NotificationBox() {
  const [friendRequests, setFriendRequests] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFriendRequests = async () => {
      const requests = await getFriendRequests(user.uid);
      setFriendRequests(requests);
    };

    fetchFriendRequests();
  }, [user.uid]);

  const handleAccept = async (requestId, friendId) => {
    await acceptFriendRequest(requestId, user.uid, friendId);
    setFriendRequests(friendRequests.filter(request => request.id !== requestId));
  };

  const handleReject = async (requestId) => {
    await rejectFriendRequest(requestId);
    setFriendRequests(friendRequests.filter(request => request.id !== requestId));
  };

  return (
    <NotificationContainer>
      <h3>Friend Requests</h3>
      {friendRequests.length === 0 ? (
        <p>No new friend requests</p>
      ) : (
        friendRequests.map(request => (
          <NotificationItem key={request.id}>
            <p>{request.senderId} wants to be your friend</p>
            <Button onClick={() => handleAccept(request.id, request.senderId)}>Accept</Button>
            <Button onClick={() => handleReject(request.id)}>Reject</Button>
          </NotificationItem>
        ))
      )}
    </NotificationContainer>
  );
}

export default NotificationBox;