import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import heroBg from '../assets/hero-bg.png';


const FeatureCard = ({ card }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onClick={() => navigate(card.to)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: '#fff',
                borderRadius: '1.25rem',
                padding: '2rem 1.75rem',
                textAlign: 'center',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: hovered
                    ? '0 20px 40px rgba(99,102,241,0.18)'
                    : '0 4px 16px rgba(0,0,0,0.07)',
                transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
                border: hovered
                    ? '1.5px solid rgba(99,102,241,0.25)'
                    : '1.5px solid rgba(0,0,0,0.06)',
            }}
        >
            {/* Gradient icon circle */}
            <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: card.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', marginBottom: '1.25rem',
                boxShadow: `0 8px 20px rgba(99,102,241,0.25)`,
                transition: 'transform 0.3s',
                transform: hovered ? 'scale(1.1)' : 'scale(1)'
            }}>
                {card.icon}
            </div>
            <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e293b', marginBottom: '0.75rem' }}>
                {card.title}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.65, flex: 1, marginBottom: '1.5rem' }}>
                {card.desc}
            </p>
            {/* CTA label */}
            <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                color: '#6366f1', fontWeight: 700, fontSize: '0.9rem',
                borderTop: '1px solid rgba(99,102,241,0.12)',
                paddingTop: '1rem', width: '100%', justifyContent: 'center',
                transition: 'gap 0.2s',
                gap: hovered ? '10px' : '6px'
            }}>
                {card.label} <span style={{ fontSize: '1rem' }}>→</span>
            </div>
        </div>
    );
};

const Home = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [showDialog, setShowDialog] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);

    const user = JSON.parse(localStorage.getItem('userInfo'));
    const getStartedRoute = user ? '/dashboard' : '/login';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowDialog(true);
        setFormData({ name: '', email: '', phone: '' });
    };

    return (
        <>
            {/* Success Dialog */}
            <Modal show={showDialog} onHide={() => setShowDialog(false)} centered>
                <Modal.Body style={{ background: '#16a34a', borderRadius: '1rem', padding: '2.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                    <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>Message Sent!</h3>
                    <p style={{ color: '#dcfce7', marginBottom: '1.5rem' }}>
                        Thank you for reaching out! We'll get back to you as soon as possible.
                    </p>
                    <Button
                        onClick={() => setShowDialog(false)}
                        style={{
                            background: '#fff',
                            color: '#16a34a',
                            fontWeight: 700,
                            border: 'none',
                            borderRadius: '2rem',
                            padding: '0.5rem 2rem'
                        }}
                    >
                        Close
                    </Button>
                </Modal.Body>
            </Modal>

            {/* Hero Section with transparent overlay + background image */}
            <div className="hero-full-screen" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Background image */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2850&auto=format&fit=crop')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0
                }} />
                {/* Gradient overlay for transparency */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 1
                }} />

                {/* Hero Content */}
                <Container style={{ position: 'relative', zIndex: 2 }} className="hero-zoom-text mb-2">
                    <Row className="justify-content-center text-center">
                        <Col lg={8}>
                            <h1 className="display-2 fw-bold mb-4" style={{ color: '#ffffff', textShadow: '0 4px 15px rgba(0,0,0,0.6)' }}>
                                Find your missing <span style={{ color: '#60a5fa' }}>Co-Founder</span>
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.4rem', marginBottom: '3rem', fontWeight: 500, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                                Connect with developers, designers, and marketers to transform your innovations into successful startups.
                                Build your dream team today.
                            </p>
                            <div className="d-flex justify-content-center gap-3 flex-wrap">
                                <Button
                                    as={Link} to={getStartedRoute} size="lg"
                                    style={{
                                        background: '#fff', color: '#3b82f6', border: 'none',
                                        borderRadius: '2rem', padding: '0.75rem 2.5rem',
                                        fontWeight: 700, fontSize: '1rem',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    🚀 Get Started
                                </Button>
                                <Button
                                    as={Link} to="/feed" size="lg"
                                    style={{
                                        background: 'rgba(255,255,255,0.15)', color: '#fff',
                                        border: '2px solid rgba(255,255,255,0.7)',
                                        borderRadius: '2rem', padding: '0.75rem 2.5rem',
                                        fontWeight: 700, fontSize: '1rem',
                                        backdropFilter: 'blur(6px)',
                                        transition: 'transform 0.2s, background 0.2s'
                                    }}
                                    onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.25)' }}
                                    onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
                                >
                                    💡 Browse Innovations
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Features Section */}
            <Container className="my-5">
                <div className="text-center mb-5">
                    <h2 style={{ fontWeight: 800, fontSize: '2rem', color: '#1e293b' }}>Why <span className="brand-font" style={{ color: '#3b82f6' }}>Co-Founder</span> <span className="brand-font" style={{ color: '#ef4444' }}>Finder</span>?</h2>
                    <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>

                        Everything you need to find the right co-founder and grow your startup.
                    </p>
                </div>
                <Row className="g-4">
                    {[
                        {
                            icon: '🤝',
                            title: 'Smart Matching',
                            desc: 'Our AI-driven compatibility score helps you find partners with complementary skills and shared values.',
                            to: '/feed',
                            label: 'Find Matches',
                            gradient: 'linear-gradient(135deg, #6366f1, #818cf8)'
                        },
                        {
                            icon: '💡',
                            title: 'Post Innovations',
                            desc: 'Share your vision and attract talented individuals who are passionate about solving the same problems.',
                            to: '/feed',
                            label: 'Browse Innovations',
                            gradient: 'linear-gradient(135deg, #a855f7, #c084fc)'
                        },
                        {
                            icon: '📱',
                            title: 'Collaborate',
                            desc: 'Use our dashboard to manage connection requests and coordinate with your growing startup team.',
                            to: '/dashboard',
                            label: 'Go to Dashboard',
                            gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)'
                        }
                    ].map((card, i) => (
                        <Col key={i} md={4} sm={12}>
                            <FeatureCard card={card} />
                        </Col>
                    ))}
                </Row>

                {/* Contact Form Section */}
                <div style={{ marginTop: '5rem', marginBottom: '3rem' }}>
                    <div className="text-center mb-5">
                        <h2 style={{ fontWeight: 800, fontSize: '2rem', color: '#1e293b' }}>📬 Get In Touch</h2>
                        <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
                            Have a question or want to collaborate? We'd love to hear from you.
                        </p>
                    </div>

                    <div style={{
                        background: '#fff',
                        borderRadius: '1.5rem',
                        padding: '2.5rem',
                        boxShadow: '0 8px 32px rgba(99,102,241,0.12)',
                        border: '1px solid rgba(99,102,241,0.1)',
                        maxWidth: '680px',
                        margin: '0 auto'
                    }}>
                        <Form onSubmit={handleSubmit}>
                            <Row className="g-4">
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label style={{ fontWeight: 600, color: '#374151' }}>Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                            style={{
                                                borderRadius: '0.75rem',
                                                padding: '0.75rem 1rem',
                                                border: '1.5px solid #e5e7eb',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label style={{ fontWeight: 600, color: '#374151' }}>Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email address"
                                            required
                                            style={{
                                                borderRadius: '0.75rem',
                                                padding: '0.75rem 1rem',
                                                border: '1.5px solid #e5e7eb',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label style={{ fontWeight: 600, color: '#374151' }}>Contact Number</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter your contact number"
                                            required
                                            style={{
                                                borderRadius: '0.75rem',
                                                padding: '0.75rem 1rem',
                                                border: '1.5px solid #e5e7eb',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        style={{
                                            width: '100%',
                                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                            border: 'none',
                                            borderRadius: '0.75rem',
                                            fontWeight: 700,
                                            padding: '0.85rem',
                                            fontSize: '1.05rem',
                                            letterSpacing: '0.02em',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            boxShadow: '0 4px 15px rgba(99,102,241,0.3)'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        🚀 Get In Touch
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>

                    {/* Contact Info Cards */}
                    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                        <Row className="mt-4 g-3">
                            <Col md={4}>
                                <div style={{
                                    background: 'rgba(99,102,241,0.08)',
                                    borderRadius: '1rem',
                                    padding: '1.25rem',
                                    textAlign: 'center',
                                    border: '1px solid rgba(99,102,241,0.15)'
                                }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>👤</div>
                                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>K.Srinivas Chowdhary</div>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div style={{
                                    background: 'rgba(99,102,241,0.08)',
                                    borderRadius: '1rem',
                                    padding: '1.25rem',
                                    textAlign: 'center',
                                    border: '1px solid rgba(99,102,241,0.15)'
                                }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>✉️</div>
                                    <div style={{ fontWeight: 600, color: '#6366f1', fontSize: '0.78rem', wordBreak: 'break-all' }}>ks9573754879@gmail.com</div>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div style={{
                                    background: 'rgba(99,102,241,0.08)',
                                    borderRadius: '1rem',
                                    padding: '1.25rem',
                                    textAlign: 'center',
                                    border: '1px solid rgba(99,102,241,0.15)'
                                }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>📞</div>
                                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>+91 9573754879</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Container>

            {/* Footer */}
            <footer style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                color: '#e2e8f0',
                paddingTop: '3.5rem',
                paddingBottom: '1.5rem',
                marginTop: '3rem'
            }}>
                <Container>
                    <Row className="g-4 mb-4">
                        {/* Brand */}
                        <Col lg={4} md={6}>
                            <div className="brand-font mb-2 d-flex align-items-center" style={{ fontSize: '1.8rem', color: '#fff' }}>
                                <img 
                                    src="https://img.freepik.com/premium-vector/cff-logo-cff-letter-cff-letter-logo-design-initials-cff-logo-linked-with-circle-uppercase-monogram-logo-cff-typography-technology-business-real-estate-brand_229120-54178.jpg" 
                                    alt="Logo" 
                                    style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }} 
                                />
                                <span style={{ color: '#3b82f6' }}>Co-Founder</span> <span style={{ color: '#ef4444' }}>Finder</span>
                            </div>
                            <p style={{ color: '#94a3b8', lineHeight: 1.7, maxWidth: '280px', fontSize: '0.95rem' }}>

                                Connecting visionary founders with the right co-founders to build the next generation of startups.
                            </p>
                            <div className="d-flex gap-3 mt-3">
                                {['💼', '🐦', '💬', '📸'].map((icon, i) => (
                                    <div key={i} style={{
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', fontSize: '1rem',
                                        transition: 'background 0.2s'
                                    }}
                                        onMouseOver={e => e.currentTarget.style.background = 'rgba(99,102,241,0.5)'}
                                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                    >{icon}</div>
                                ))}
                            </div>
                        </Col>

                        {/* Quick Links */}
                        <Col lg={2} md={6}>
                            <h6 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem' }}>Quick Links</h6>
                            {[
                                { label: 'Home', to: '/' },
                                { label: 'Innovations', to: '/feed' },
                                { label: 'Contact', to: '/contact' }
                            ].map((link, i) => (
                                <div key={i} style={{ marginBottom: '0.5rem' }}>
                                    <a href={link.to} style={{
                                        color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem',
                                        transition: 'color 0.2s'
                                    }}
                                        onMouseOver={e => e.currentTarget.style.color = '#a5b4fc'}
                                        onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
                                    >› {link.label}</a>
                                </div>
                            ))}
                            <div style={{ marginBottom: '0.5rem', cursor: 'pointer' }} onClick={() => setShowHelpModal(true)}>
                                <span style={{
                                    color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem',
                                    transition: 'color 0.2s'
                                }}
                                    onMouseOver={e => e.currentTarget.style.color = '#a5b4fc'}
                                    onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
                                >› Help Guide</span>
                            </div>
                        </Col>

                        {/* Contact Info */}
                        <Col lg={3} md={6}>
                            <h6 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem' }}>Contact</h6>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <span>👤</span>
                                    <span style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>K.Srinivas Chowdhary</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <span>✉️</span>
                                    <a href="mailto:ks9573754879@gmail.com" style={{ color: '#a5b4fc', fontSize: '0.9rem', textDecoration: 'none', wordBreak: 'break-all' }}>
                                        ks9573754879@gmail.com
                                    </a>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <span>📞</span>
                                    <a href="tel:+919573754879" style={{ color: '#a5b4fc', fontSize: '0.95rem', textDecoration: 'none' }}>
                                        +91 9573754879
                                    </a>
                                </div>
                            </div>
                        </Col>

                        {/* CTA */}
                        <Col lg={3} md={6}>
                            <h6 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem' }}>Ready to Start?</h6>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                Join thousands of founders already building their dream teams on Co-Founder Finder.
                            </p>
                            <a href="/register" style={{
                                display: 'inline-block',
                                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                                padding: '0.6rem 1.5rem', borderRadius: '2rem',
                                textDecoration: 'none', transition: 'transform 0.2s'
                            }}>
                                Join for Free →
                            </a>
                        </Col>
                    </Row>

                    {/* Divider */}
                    <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' }} />

                    {/* Bottom Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                            © 2026 Co-Founder Finder. All rights reserved.
                        </p>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                            Built with ❤️ by K.Srinivas Chowdhary
                        </p>
                    </div>
                </Container>
            </footer>

            {/* Help Modal */}
            <Modal show={showHelpModal} onHide={() => setShowHelpModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <Modal.Title style={{ color: '#1e293b', fontWeight: 800 }}>How to use Co-Founder Finder</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '2rem' }}>
                    <h5 style={{ color: '#4f46e5', fontWeight: 700 }}>1. Join the Platform</h5>
                    <p style={{ color: '#475569', marginBottom: '1.5rem' }}>Start by clicking "Register" to create an account. Set up your profile by detailing your unique skills—like development, design, or marketing.</p>
                    
                    <h5 style={{ color: '#4f46e5', fontWeight: 700 }}>2. Explore Innovations</h5>
                    <p style={{ color: '#475569', marginBottom: '1.5rem' }}>Navigate to the "Innovations" page to browse through brilliant startup ideas. Find projects that resonate with your skills and passions to collaborate on.</p>
                    
                    <h5 style={{ color: '#4f46e5', fontWeight: 700 }}>3. Match and Collaborate</h5>
                    <p style={{ color: '#475569', marginBottom: '1.5rem' }}>See compatibility scores to find teammates whose profiles compliment your own. Use the dashboard to manage requests and get the ball rolling on development!</p>
                    
                    <div className="text-center mt-4">
                        <Button
                            onClick={() => setShowHelpModal(false)}
                            style={{
                                background: '#3b82f6',
                                borderRadius: '2rem',
                                padding: '0.5rem 2rem',
                                fontWeight: 700,
                                border: 'none'
                            }}
                        >
                            Got It
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Home;
