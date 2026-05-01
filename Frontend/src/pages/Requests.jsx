import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Requests = () => {
    const user = JSON.parse(sessionStorage.getItem('userInfo'));
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchRequests();
    }, [navigate, user?._id]);

    const fetchRequests = async () => {
        try {
            const { data } = await axios.get(`/api/connect/pending/${user._id}`);
            setRequests(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setLoading(false);
        }
    };

    const handleAction = async (requestId, status) => {
        try {
            await axios.put(`/api/connect/${requestId}`, { status });
            // Remove the request from the list
            setRequests(requests.filter(req => req._id !== requestId));
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

    return (
        <Container className="py-5">
            <div className="mb-5 text-center">
                <h1 className="display-4 fw-bold mb-2 text-dark">
                    Join <span className="text-primary">Requests</span>
                </h1>
                <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Review candidates who want to join your startup innovations.
                </p>
            </div>

            {requests.length === 0 ? (
                <Card className="border-0 shadow-sm rounded-4 p-5 text-center bg-light">
                    <Card.Body>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                        <h4 className="fw-bold mb-3">No Pending Requests</h4>
                        <p className="text-muted mb-4">You're all caught up! There are no pending application requests for your startups right now.</p>
                        <Button variant="primary" className="rounded-pill px-4 fw-bold" onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </Card.Body>
                </Card>
            ) : (
                <Row className="g-4">
                    {requests.map(req => (
                        <Col key={req._id} lg={4} md={6}>
                            <Card className="border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                                <div style={{ height: '4px', background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
                                <Card.Body className="p-4 d-flex flex-column">
                                    <div className="d-flex align-items-center mb-3">
                                        {req.senderId?.profilePicture ? (
                                            <Image 
                                                src={req.senderId.profilePicture} 
                                                roundedCircle 
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                className="shadow-sm border border-2 border-white me-3"
                                            />
                                        ) : (
                                            <div 
                                                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm me-3"
                                                style={{ width: '50px', height: '50px', background: '#6366f1' }}
                                            >
                                                {req.senderId?.name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                        <div>
                                            <h5 className="fw-bold mb-0">{req.senderId?.name}</h5>
                                            <span className="text-muted small fw-semibold text-uppercase">{req.senderId?.role || "Applicant"}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-3 p-3 bg-light rounded-3">
                                        <p className="small text-muted mb-1 fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Applying For</p>
                                        <h6 className="fw-bold text-primary mb-0">{req.ideaId?.title}</h6>
                                    </div>

                                    <div className="mb-4">
                                        <p className="small text-muted mb-2 fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Top Skills</p>
                                        <div className="d-flex flex-wrap gap-2">
                                            {req.senderId?.skills?.slice(0, 3).map(skill => (
                                                <Badge bg="white" text="dark" className="border shadow-sm p-2" key={skill}>{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-auto d-flex flex-column gap-2">
                                        <div className="d-flex gap-2">
                                            <Button 
                                                variant="outline-primary" 
                                                className="flex-grow-1 rounded-pill fw-bold"
                                                onClick={() => navigate(`/profile/${req.senderId?._id}`)}
                                            >
                                                View Profile
                                            </Button>
                                            <Button 
                                                variant="outline-secondary" 
                                                className="flex-grow-1 rounded-pill fw-bold"
                                                onClick={() => navigate(`/messages/${req.senderId?._id}`)}
                                            >
                                                Message
                                            </Button>
                                        </div>
                                        <div className="d-flex gap-2 mt-2 pt-2 border-top">
                                            <Button 
                                                variant="success" 
                                                className="flex-grow-1 rounded-pill fw-bold text-white shadow-sm"
                                                onClick={() => handleAction(req._id, 'Accepted')}
                                            >
                                                ✓ Accept
                                            </Button>
                                            <Button 
                                                variant="danger" 
                                                className="flex-grow-1 rounded-pill fw-bold text-white shadow-sm"
                                                onClick={() => handleAction(req._id, 'Rejected')}
                                            >
                                                ✕ Reject
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default Requests;
