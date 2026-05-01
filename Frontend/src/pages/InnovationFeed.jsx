import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Image, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InnovationCard = ({ innovation, user, handleJoinRequest, handleDelete }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    return (
        <Card 
            className="border-0 shadow-sm overflow-hidden h-100"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ 
                borderRadius: '1.25rem',
                transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: hovered ? '0 20px 40px rgba(99,102,241,0.15)' : '0 4px 12px rgba(0,0,0,0.05)',
                background: '#fff',
                position: 'relative'
            }}
        >
            {/* Top accent line */}
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #6366f1, #a855f7)', width: '100%' }} />

            <Card.Body className="p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex flex-column">
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>STARTUP</span>
                        <h5 className="brand-font" style={{ color: '#6366f1', margin: 0, fontSize: '1rem' }}>
                            {innovation.industry || 'INNOVATION'}
                        </h5>
                    </div>

                    {user && user._id === innovation.founderId?._id && (
                        <Button 
                            variant="link" 
                            size="sm" 
                            className="p-0 text-danger opacity-50 hover-opacity-100"
                            onClick={() => handleDelete(innovation._id)}
                            style={{ textDecoration: 'none' }}
                        >
                            ✕
                        </Button>
                    )}
                </div>

                <Card.Title 
                    className="fw-bold mb-2 fs-4 brand-font" 
                    style={{ color: '#1e293b', lineHeight: 1.2, letterSpacing: '-0.02em' }}
                >
                    {innovation.title}
                </Card.Title>

                <Card.Text 
                    className="text-muted mb-4" 
                    style={{ fontSize: '0.95rem', lineHeight: 1.6 }}
                >
                    {innovation.description.length > 130 
                        ? innovation.description.substring(0, 130) + '...' 
                        : innovation.description}
                </Card.Text>

                <div className="mt-auto">
                    <div className="mb-3">
                        <div className="d-flex flex-wrap gap-2">
                            {innovation.requiredSkills.slice(0, 3).map(skill => (
                                <span 
                                    key={skill}
                                    style={{
                                        fontSize: '0.75rem',
                                        background: '#f8fafc',
                                        color: '#64748b',
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #e2e8f0',
                                        fontWeight: 600
                                    }}
                                >
                                    {skill}
                                </span>
                            ))}
                            {innovation.requiredSkills.length > 3 && (
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                    +{innovation.requiredSkills.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>

                    <Button 
                        onClick={() => handleJoinRequest(innovation)}
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            border: 'none',
                            borderRadius: '0.75rem',
                            padding: '0.6rem',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            transition: 'all 0.2s',
                            boxShadow: hovered ? '0 8px 15px rgba(99,102,241,0.25)' : 'none'
                        }}
                    >
                        Apply to Join →
                    </Button>
                </div>
            </Card.Body>

            <Card.Footer 
                className="bg-transparent border-0 px-4 py-3 border-top" 
                style={{ background: '#f8fafc' }}
            >
                <div className="d-flex align-items-center">
                    <div 
                        onClick={() => navigate(`/profile/${innovation.founderId?._id}`)}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateX(5px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                        {innovation.founderId?.profilePicture ? (
                            <Image 
                                src={innovation.founderId.profilePicture} 
                                roundedCircle 
                                style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                                className="me-2 shadow-sm"
                            />
                        ) : (
                            <div 
                                className="rounded-circle d-flex align-items-center justify-content-center me-2 shadow-sm"
                                style={{ 
                                    width: '32px', 
                                    height: '32px', 
                                    background: '#6366f1',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: '0.8rem'
                                }}
                            >
                                {innovation.founderId?.name?.charAt(0) || 'U'}
                            </div>
                        )}
                        <div className="d-flex flex-column">
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>POSTED BY</span>
                            <span 
                                style={{ 
                                    fontSize: '0.9rem', 
                                    fontWeight: 800, 
                                    color: '#6366f1',
                                    textDecoration: 'underline'
                                }}
                            >
                                {innovation.founderId?.name}
                            </span>
                        </div>
                    </div>
                </div>
            </Card.Footer>
        </Card>
    );
};

const InnovationFeed = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const [innovations, setInnovations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [selectedInnovation, setSelectedInnovation] = useState(null);
    const [idToDelete, setIdToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInnovations = async () => {
            try {
                const { data } = await axios.get('/api/ideas');
                setInnovations(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching innovations:', error);
                setLoading(false);
            }
        };
        fetchInnovations();
    }, []);

    const handleJoinRequest = async (innovation) => {
        if (!user) {
            alert('Please login to join an innovation!');
            return;
        }
        try {
            await axios.post('/api/connect/request', {
                senderId: user._id,
                receiverId: innovation.founderId?._id,
                ideaId: innovation._id
            });
            setSelectedInnovation(innovation);
            setShowSuccess(true);
        } catch (err) {
            console.error(err);
            alert('Failed to send request.');
        }
    };

    const handleDeleteClick = (id) => {
        setIdToDelete(id);
        setShowDeleteWarning(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/ideas/${idToDelete}`);
            setInnovations(innovations.filter(i => i._id !== idToDelete));
            setShowDeleteWarning(false);
            setShowDeleteSuccess(true);
        } catch (err) {
            console.error(err);
            alert('Failed to delete.');
            setShowDeleteWarning(false);
        }
    };

    if (loading) return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
                <Spinner animation="grow" variant="primary" />
                <div className="mt-3 fw-bold text-primary">Loading Innovations...</div>
            </div>
        </Container>
    );

    return (
        <Container className="py-5">
            {/* Success Modal */}
            <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
                <Modal.Body style={{ background: '#16a34a', borderRadius: '1rem', padding: '2.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                    <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>Application Sent!</h3>
                    <p style={{ color: '#dcfce7', marginBottom: '1.5rem' }}>
                        Your request to join <strong>{selectedInnovation?.title}</strong> has been successfully sent to the founder.
                    </p>
                    <Button
                        onClick={() => setShowSuccess(false)}
                        style={{
                            background: '#fff',
                            color: '#16a34a',
                            fontWeight: 700,
                            border: 'none',
                            borderRadius: '2rem',
                            padding: '0.5rem 2rem'
                        }}
                    >
                        Got it!
                    </Button>
                </Modal.Body>
            </Modal>

            {/* Delete Warning Modal */}
            <Modal show={showDeleteWarning} onHide={() => setShowDeleteWarning(false)} centered>
                <Modal.Body style={{ background: '#facc15', borderRadius: '1rem', padding: '2.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                    <h3 style={{ color: '#854d0e', fontWeight: 800, marginBottom: '0.5rem' }}>Wait A Second!</h3>
                    <p style={{ color: '#854d0e', marginBottom: '1.5rem', fontWeight: 600 }}>
                        Are you sure you want to delete this innovation? This action cannot be undone.
                    </p>
                    <div className="d-flex gap-3 justify-content-center">
                        <Button
                            onClick={() => setShowDeleteWarning(false)}
                            style={{
                                background: 'transparent',
                                color: '#854d0e',
                                fontWeight: 700,
                                border: '2px solid #854d0e',
                                borderRadius: '2rem',
                                padding: '0.5rem 2rem'
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            style={{
                                background: '#854d0e',
                                color: '#fff',
                                fontWeight: 700,
                                border: 'none',
                                borderRadius: '2rem',
                                padding: '0.5rem 2rem'
                            }}
                        >
                            Yes, Delete
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Delete Success Modal */}
            <Modal show={showDeleteSuccess} onHide={() => setShowDeleteSuccess(false)} centered>
                <Modal.Body style={{ background: '#ef4444', borderRadius: '1rem', padding: '2.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
                    <h3 style={{ color: '#fff', fontWeight: 800, marginBottom: '0.5rem' }}>Deleted!</h3>
                    <p style={{ color: '#fee2e2', marginBottom: '1.5rem', fontWeight: 600 }}>
                        Innovation removed successfully.
                    </p>
                    <Button
                        onClick={() => setShowDeleteSuccess(false)}
                        style={{
                            background: '#fff',
                            color: '#ef4444',
                            fontWeight: 700,
                            border: 'none',
                            borderRadius: '2rem',
                            padding: '0.5rem 2.0rem'
                        }}
                    >
                        Close
                    </Button>
                </Modal.Body>
            </Modal>

            <div className="mb-5 text-center">
                <h1 className="display-4 fw-bold mb-2" style={{ color: '#1e293b' }}>
                    Innovation <span style={{ color: '#6366f1' }}>Feed</span>
                </h1>
                <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
                    Discover groundbreaking ideas and find your next big startup opportunity. Connect with visionary founders and build the future together. 🚀
                </p>
            </div>
            
            <Row className="g-4">
                {innovations.map((innovation) => (
                    <Col key={innovation._id} lg={4} md={6} sm={12}>
                        <InnovationCard 
                            innovation={innovation} 
                            user={user}
                            handleJoinRequest={handleJoinRequest}
                            handleDelete={handleDeleteClick}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};


export default InnovationFeed;
