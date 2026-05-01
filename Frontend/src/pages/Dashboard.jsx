import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Form, Tabs, Tab, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [userInnovations, setUserInnovations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newInnovation, setNewInnovation] = useState({ title: '', description: '', industry: '', requiredSkills: '' });

    useEffect(() => {
        if (user) {
            fetchMatches();
            fetchUserInnovations();
        }
    }, []);

    const fetchMatches = async () => {
        try {
            const { data } = await axios.get(`/api/ideas/match/${user._id}`);
            // Filter out dummy data
            const dummyNames = ["Bug Fixer", "Final Test", "API Test User", "Alex Rivera", "Sarah Chen", "Marcus Thorne", "Elena Vance", "Jordan Lee", "Sophie Amis", "Test User"];
            const realUsers = data.filter(m => !dummyNames.includes(m.user.name));
            setMatches(realUsers);
        } catch (err) { console.error(err); }
    };

    const fetchUserInnovations = async () => {
        try {
            const { data } = await axios.get(`/api/ideas`);
            const myInnovations = data.filter(innovation => innovation.founderId?._id === user._id);
            setUserInnovations(myInnovations);
        } catch (err) { console.error(err); }
    };

    const handlePostInnovation = async (e) => {
        e.preventDefault();
        try {
            const innovationData = {
                ...newInnovation,
                founderId: user._id,
                requiredSkills: newInnovation.requiredSkills.split(',').map(s => s.trim())
            };
            await axios.post('/api/ideas', innovationData);
            setShowModal(false);
            setNewInnovation({ title: '', description: '', industry: '', requiredSkills: '' });
            fetchUserInnovations();
        } catch (err) { console.error(err); }
    };

    const filteredMatches = matches.filter(m => {
        const matchesTab = activeFilter === 'All' || m.user.role === activeFilter;
        const matchesSearch = m.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.user.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    return (
        <div className="dashboard-bg py-5">
            <Container>
                <Row className="mb-5 align-items-center">
                    <Col md={7}>
                        <h1 className="display-5 fw-bold mb-2">
                            Welcome back, <span className="text-primary">{user?.name}</span>! 👋
                        </h1>
                        <p className="lead text-muted">
                            Find your perfect co-founder and turn your vision into reality.
                        </p>
                    </Col>
                    <Col md={5} className="text-md-end">
                        <Button 
                            variant="primary" 
                            onClick={() => setShowModal(true)} 
                            className="rounded-pill px-5 py-3 fw-bold shadow-lg border-0"
                            style={{ 
                                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                fontSize: '1.1rem'
                            }}
                        >
                            + Post Innovation
                        </Button>
                    </Col>
                </Row>

                <Card 
                    className="border-0 shadow-sm p-4 mb-4" 
                    style={{ 
                        background: 'rgba(255, 255, 255, 0.7)', 
                        backdropFilter: 'blur(20px)',
                        borderRadius: '1.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                >
                    <Card.Body p={0}>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-4">
                            <div className="d-flex align-items-center gap-3 w-100" style={{ maxWidth: '400px' }}>
                                <div className="position-relative w-100">
                                    <span className="position-absolute translate-middle-y translate-middle-x" style={{ top: '50%', left: '20px', color: '#94a3b8' }}>
                                        🔍
                                    </span>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Search co-founders by name or role..." 
                                        className="rounded-pill border-0 bg-light py-2 ps-5 shadow-none"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ fontSize: '0.9rem' }}
                                    />
                                </div>
                            </div>
                            
                            <Tabs
                                activeKey={activeFilter}
                                onSelect={(k) => setActiveFilter(k)}
                                className="border-0 bg-light p-1 rounded-pill"
                            >
                                <Tab eventKey="All" title="All" />
                                <Tab eventKey="Developer" title="Developers" />
                                <Tab eventKey="Designer" title="Designers" />
                                <Tab eventKey="Innovator" title="Innovators" />
                            </Tabs>
                        </div>
                        
                        <Row className="g-4">
                            {filteredMatches.length > 0 ? (
                                filteredMatches.map(match => (
                                    <Col lg={3} md={4} sm={6} key={match.user._id}> 
                                        <Card 
                                            className="border-0 shadow-sm rounded-4 h-100 overflow-hidden"
                                            style={{ 
                                                transition: 'all 0.3s',
                                                background: '#fff'
                                            }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <div className="p-4 flex-grow-1 d-flex flex-column align-items-center text-center">
                                                {match.user.profilePicture ? (
                                                    <Image 
                                                        src={match.user.profilePicture} 
                                                        roundedCircle 
                                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                        className="shadow-sm border border-4 border-light mb-3"
                                                    />
                                                ) : (
                                                    <div 
                                                        className="rounded-circle d-flex align-items-center justify-content-center mb-3 shadow-sm"
                                                        style={{ 
                                                            width: '80px', 
                                                            height: '80px', 
                                                            background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                                                            color: '#94a3b8'
                                                        }}
                                                    >
                                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                            <circle cx="12" cy="7" r="4"></circle>
                                                        </svg>
                                                    </div>
                                                )}
                                                <h5 className="mb-1 fw-bold">{match.user.name}</h5>
                                                <Badge 
                                                    bg="primary" 
                                                    style={{ 
                                                        background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
                                                        color: '#fff',
                                                        fontSize: '0.75rem',
                                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                                                    }} 
                                                    className="rounded-pill px-3 py-2 mb-3"
                                                >
                                                    {match.user.role}
                                                </Badge>
                                                
                                                <div className="w-100 mt-auto pt-3 border-top">
                                                    <div className="d-flex justify-content-between align-items-center mb-0">
                                                        <small className="text-muted fw-bold">Compatibility</small>
                                                        <small className="text-success fw-bold">{match.score}%</small>
                                                    </div>
                                                    <div className="progress mb-3" style={{ height: '6px', borderRadius: '10px' }}>
                                                        <div 
                                                            className="progress-bar bg-success" 
                                                            role="progressbar" 
                                                            style={{ width: `${match.score}%` }}
                                                        ></div>
                                                    </div>
                                                    <Button 
                                                        variant="link" 
                                                        className="p-0 text-primary fw-bold text-decoration-none w-100"
                                                        onClick={() => navigate(`/profile/${match.user._id}`)}
                                                    >
                                                        View Profile →
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Col lg={12} className="text-center py-5">
                                    <h3 className="text-muted">No co-founders found matching your criteria.</h3>
                                    <p className="text-muted">Try a different search term or filter!</p>
                                </Col>
                            )}
                        </Row>
                    </Card.Body>
                </Card>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0 px-4 pt-4">
                    <Modal.Title className="fw-bold">Post Your Innovation</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <Form onSubmit={handlePostInnovation}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Innovation Title</Form.Label>
                            <Form.Control type="text" placeholder="e.g. AI-driven Health App" required 
                                value={newInnovation.title} onChange={(e) => setNewInnovation({...newInnovation, title: e.target.value})} className="rounded-3" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Industry/Company Name</Form.Label>
                            <Form.Control type="text" placeholder="e.g. HealthTech / Acme Corp" 
                                value={newInnovation.industry} onChange={(e) => setNewInnovation({...newInnovation, industry: e.target.value})} className="rounded-3" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Describe your vision..." required 
                                value={newInnovation.description} onChange={(e) => setNewInnovation({...newInnovation, description: e.target.value})} className="rounded-3" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Required Skills (comma separated)</Form.Label>
                            <Form.Control type="text" placeholder="React, Node.js, UI/UX" required 
                                value={newInnovation.requiredSkills} onChange={(e) => setNewInnovation({...newInnovation, requiredSkills: e.target.value})} className="rounded-3" />
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100 rounded-pill py-2 mt-2 fw-bold"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', border: 'none' }}
                        >
                            Launch Innovation 🚀
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};


export default Dashboard;
