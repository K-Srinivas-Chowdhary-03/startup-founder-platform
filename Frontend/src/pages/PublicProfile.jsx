import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Image } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get(`/api/auth/${id}`);
                setProfile(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return (
        <Container className="text-center py-5">
            <Spinner animation="border" variant="primary" />
        </Container>
    );

    if (!profile) return (
        <Container className="text-center py-5">
            <div className="glass-card p-5 rounded-4 shadow-sm border-0">
                <h2 className="fw-bold mb-3">Profile not found</h2>
                <p className="text-muted mb-4">The user profile you are looking for doesn't exist or has been removed.</p>
                <Button variant="primary" className="rounded-pill px-4" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </Button>
            </div>
        </Container>
    );

    const defaultCover = 'https://images.unsplash.com/photo-1549492423-40024224c6e1?q=80&w=1500&auto=format&fit=crop';

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col lg={10} xl={9}>
                    {/* LinkedIn Style Header Card */}
                    <Card className="border-0 shadow-sm overflow-hidden rounded-4 mb-4 position-relative">
                        {/* Banner */}
                        <div className="position-relative" style={{ height: '200px' }}>
                            <Image 
                                src={profile.coverPhoto || defaultCover} 
                                className="w-100 h-100" 
                                style={{ objectFit: 'cover' }} 
                                alt=""
                            />
                        </div>

                        {/* Profile Info Overlay */}
                        <Card.Body className="pt-0 px-4 pb-4">
                            <div className="d-flex justify-content-between align-items-end" style={{ marginTop: '-60px' }}>
                                <div className="position-relative">
                                    {profile.profilePicture ? (
                                        <Image 
                                            src={profile.profilePicture} 
                                            roundedCircle 
                                            className="border border-4 border-white shadow-sm"
                                            style={{ width: '152px', height: '152px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div 
                                        className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-lg border border-4 border-white"
                                        style={{ 
                                            width: '152px', 
                                            height: '152px', 
                                            background: '#e9ecef',
                                            color: '#adb5bd'
                                        }}
                                    >
                                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    {profile.linkedin ? (
                                        <Button 
                                            as="a" 
                                            href={profile.linkedin} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            variant="primary" 
                                            className="rounded-pill fw-bold px-4"
                                        >
                                            Connect on LinkedIn
                                        </Button>
                                    ) : (
                                        <Button variant="outline-secondary" className="rounded-pill fw-bold px-4" disabled>
                                            No LinkedIn Provided
                                        </Button>
                                    )}
                                    <Button 
                                        variant="outline-primary" 
                                        className="rounded-pill fw-bold ms-2 px-4 shadow-sm"
                                        onClick={() => navigate(`/messages/${profile._id}`)}
                                    >
                                        Message
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-3">
                                <h1 className="fw-bold fs-3 mb-0">{profile.name}</h1>
                                <p className="lead text-muted fs-6 mb-2">
                                    {profile.role} • {profile.experienceLevel || "Professional"}
                                </p>
                                <div className="d-flex align-items-center gap-3">
                                    {profile.linkedin && (
                                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary fw-bold text-decoration-none">
                                            LinkedIn Profile ↗
                                        </a>
                                    )}
                                    <span className="text-muted small">Available for collaboration</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* About Section */}
                    <Card className="border-0 shadow-sm rounded-4 mb-4 p-3">
                        <Card.Body>
                            <h4 className="fw-bold mb-3">About</h4>
                            <p className="text-muted fs-5" style={{ whiteSpace: 'pre-wrap' }}>
                                {profile.bio || "This user hasn't shared a bio yet."}
                            </p>
                        </Card.Body>
                    </Card>

                    {/* Skills & Interests */}
                    <Card className="border-0 shadow-sm rounded-4 mb-4 p-3">
                        <Card.Body>
                            <h4 className="fw-bold mb-3">Skills</h4>
                            <div className="d-flex flex-wrap gap-2 mb-4">
                                {profile.skills && profile.skills.length > 0 ? profile.skills.map((s, i) => (
                                    <Badge key={i} bg="light" text="dark" className="border px-3 py-2 rounded-pill fs-6">{s}</Badge>
                                )) : <span className="text-muted">No skills listed.</span>}
                            </div>
                            <h4 className="fw-bold mb-3">Interests</h4>
                            <div className="d-flex flex-wrap gap-2">
                                {profile.interests && profile.interests.length > 0 ? profile.interests.map((s, i) => (
                                    <Badge key={i} bg="info" className="px-3 py-2 rounded-pill">{s}</Badge>
                                )) : <span className="text-muted">No interests listed.</span>}
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Projects Section */}
                    <Card className="border-0 shadow-sm rounded-4 mb-4 p-3">
                        <Card.Body>
                            <h4 className="fw-bold mb-3">Recent Projects</h4>
                            {profile.projects && profile.projects.length > 0 ? (
                                <Row className="g-3">
                                    {profile.projects.map((p, i) => (
                                        <Col key={i} md={6}>
                                            <Card className="border h-100 p-3 rounded-4 bg-light shadow-none hover-lift">
                                                <h6 className="fw-bold mb-1">{p.name}</h6>
                                                <p className="small text-muted mb-2">{p.description}</p>
                                                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="small text-primary fw-bold text-decoration-none">View Project ↗</a>}
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <p className="text-muted">No projects listed yet.</p>
                            )}
                        </Card.Body>
                    </Card>
                    
                    <div className="mt-4 text-center">
                        <Button variant="link" className="text-muted text-decoration-none" onClick={() => navigate(-1)}>
                            ← Back to previous page
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default PublicProfile;
