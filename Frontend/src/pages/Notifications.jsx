import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Image, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Notifications = () => {
    let initialUser = null;
    try {
        initialUser = JSON.parse(sessionStorage.getItem('userInfo'));
    } catch(e) {}
    
    const user = initialUser;
    const navigate = useNavigate();
    
    const [unreadMessages, setUnreadMessages] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        const fetchAllNotifications = async () => {
            try {
                // Fetch unread messages
                const msgRes = await axios.get(`/api/messages/conversations/${user._id}`);
                const unread = msgRes.data.filter(conv => conv.unreadCount > 0);
                setUnreadMessages(unread);

                // Fetch pending requests
                const reqRes = await axios.get(`/api/connect/pending/${user._id}`);
                setPendingRequests(reqRes.data || []);
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching notifications:', err);
                setLoading(false);
            }
        };

        fetchAllNotifications();
    }, [navigate, user?._id]);

    const handleAction = async (requestId, status) => {
        try {
            await axios.put(`/api/connect/${requestId}`, { status });
            setPendingRequests(pendingRequests.filter(req => req._id !== requestId));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update request status.');
        }
    };

    if (loading) return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <Spinner animation="grow" variant="primary" />
        </Container>
    );

    const totalNotifications = unreadMessages.length + pendingRequests.length;

    return (
        <Container className="py-5">
            <div className="mb-5 text-center">
                <h1 className="display-4 fw-bold mb-2 text-dark">
                    Your <span className="text-primary">Notifications</span>
                </h1>
                <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Stay on top of your messages and collaboration requests.
                </p>
            </div>

            {totalNotifications === 0 ? (
                <Card className="border-0 shadow-sm rounded-4 p-5 text-center bg-light">
                    <Card.Body>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                        <h4 className="fw-bold mb-3">No notifications available</h4>
                        <p className="text-muted mb-4">You're all caught up! Check back later for new messages or requests.</p>
                        <Button variant="primary" className="rounded-pill px-4 fw-bold" onClick={() => navigate('/dashboard')}>
                            Return to Dashboard
                        </Button>
                    </Card.Body>
                </Card>
            ) : (
                <Row className="g-4 justify-content-center">
                    <Col lg={8}>
                        {unreadMessages.length > 0 && (
                            <div className="mb-5">
                                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <span style={{ fontSize: '1.5rem' }}>💬</span> Unread Messages
                                    <Badge bg="danger" pill>{unreadMessages.length}</Badge>
                                </h4>
                                {unreadMessages.map((conv) => (
                                    <Card key={conv.user._id} className="border-0 shadow-sm rounded-4 mb-3 overflow-hidden cursor-pointer" onClick={() => navigate(`/messages/${conv.user._id}`)} style={{ cursor: 'pointer' }}>
                                        <Card.Body className="p-4 d-flex align-items-center gap-3">
                                            {conv.user.profilePicture ? (
                                                <Image src={conv.user.profilePicture} roundedCircle width={56} height={56} style={{ objectFit: 'cover' }} />
                                            ) : (
                                                <div className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold" style={{ width: 56, height: 56, background: '#6366f1' }}>
                                                    {conv.user.name.charAt(0)}
                                                </div>
                                            )}
                                            <div className="flex-grow-1">
                                                <h5 className="mb-1 fw-bold">{conv.user.name}</h5>
                                                <p className="mb-0 text-muted">{conv.unreadCount} new message(s) waiting for you</p>
                                            </div>
                                            <Button variant="outline-primary" className="rounded-pill fw-bold" onClick={(e) => { e.stopPropagation(); navigate(`/messages/${conv.user._id}`); }}>
                                                Reply
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {pendingRequests.length > 0 && (
                            <div>
                                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <span style={{ fontSize: '1.5rem' }}>🚀</span> Join Requests
                                    <Badge bg="primary" pill>{pendingRequests.length}</Badge>
                                </h4>
                                {pendingRequests.map(req => (
                                    <Card key={req._id} className="border-0 shadow-sm rounded-4 mb-3 overflow-hidden">
                                        <Card.Body className="p-4 d-flex align-items-center flex-wrap gap-3">
                                            {req.senderId?.profilePicture ? (
                                                <Image src={req.senderId.profilePicture} roundedCircle width={56} height={56} style={{ objectFit: 'cover' }} />
                                            ) : (
                                                <div className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold" style={{ width: 56, height: 56, background: '#a855f7' }}>
                                                    {req.senderId?.name?.charAt(0) || 'U'}
                                                </div>
                                            )}
                                            <div className="flex-grow-1">
                                                <h5 className="mb-1 fw-bold">{req.senderId?.name}</h5>
                                                <p className="mb-1 text-muted small">Wants to join: <strong className="text-primary">{req.ideaId?.title}</strong></p>
                                                <div className="d-flex flex-wrap gap-1 mt-1">
                                                    {req.senderId?.skills?.slice(0, 3).map(skill => (
                                                        <Badge bg="light" text="dark" key={skill}>{skill}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column gap-2 ms-auto">
                                                <div className="d-flex gap-2">
                                                    <Button variant="outline-primary" size="sm" className="rounded-pill fw-bold flex-grow-1" onClick={() => navigate(`/profile/${req.senderId?._id}`)}>
                                                        Profile
                                                    </Button>
                                                    <Button variant="outline-secondary" size="sm" className="rounded-pill fw-bold flex-grow-1" onClick={() => navigate(`/messages/${req.senderId?._id}`)}>
                                                        Message
                                                    </Button>
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <Button variant="success" size="sm" className="rounded-pill fw-bold text-white flex-grow-1" onClick={() => handleAction(req._id, 'Accepted')}>
                                                        Accept
                                                    </Button>
                                                    <Button variant="danger" size="sm" className="rounded-pill fw-bold text-white flex-grow-1" onClick={() => handleAction(req._id, 'Rejected')}>
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default Notifications;
