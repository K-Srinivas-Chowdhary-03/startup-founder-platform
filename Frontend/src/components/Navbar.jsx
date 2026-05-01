import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown, Modal, Badge } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AppNavbar = () => {
    const navigate = useNavigate();
    let initialUser = null;
    try {
        initialUser = JSON.parse(sessionStorage.getItem('userInfo'));
    } catch (e) {
        sessionStorage.removeItem('userInfo');
    }
    const [user, setUser] = useState(initialUser);
    const [showLogoutWarning, setShowLogoutWarning] = useState(false);
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
    
    // Mobile Nav State
    const [expanded, setExpanded] = useState(false);
    const navRef = useRef(null);
    
    // Notifications State
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        const handleAuthChange = () => {
            try {
                setUser(JSON.parse(sessionStorage.getItem('userInfo')));
            } catch(e) {
                setUser(null);
            }
        };

        window.addEventListener('authChange', handleAuthChange);
        window.addEventListener('storage', handleAuthChange);
        
        return () => {
            window.removeEventListener('authChange', handleAuthChange);
            window.removeEventListener('storage', handleAuthChange);
        };
    }, []);

    // Handle outside click for Mobile Menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!user) return;
        
        const fetchNotifications = async () => {
            try {
                // Fetch unread messages count
                const msgRes = await axios.get(`/api/messages/unread/${user._id}`);
                setUnreadMessages(msgRes.data.unreadCount || 0);

                // Fetch pending requests
                const reqRes = await axios.get(`/api/connect/pending/${user._id}`);
                setPendingRequests(reqRes.data || []);
            } catch (err) {
                console.error('Error fetching notifications:', err);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000); // poll every 5 seconds
        return () => clearInterval(interval);
    }, [user]);

    const totalNotifications = unreadMessages + pendingRequests.length;

    const handleLogoutClick = () => {
        setShowLogoutWarning(true);
    };

    const confirmLogout = () => {
        sessionStorage.removeItem('userInfo');
        window.dispatchEvent(new Event('authChange'));
        setShowLogoutWarning(false);
        setShowLogoutSuccess(true);
    };

    const finalizeLogout = () => {
        setShowLogoutSuccess(false);
        navigate('/login');
    };

    return (
        <Navbar expand="lg" expanded={expanded} onToggle={setExpanded} className="mb-4 py-3 sticky-top nav-glass" ref={navRef}>
            <Container>
                {/* Logout Warning Modal */}
                <Modal show={showLogoutWarning} onHide={() => setShowLogoutWarning(false)} centered>
                    <Modal.Body style={{ background: '#facc15', borderRadius: '1rem', padding: '2.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
                        <h3 style={{ color: '#854d0e', fontWeight: 800, marginBottom: '0.5rem' }}>Leaving So Soon?</h3>
                        <p style={{ color: '#854d0e', marginBottom: '1.5rem', fontWeight: 600 }}>
                            Are you sure you want to logout? We'll miss you!
                        </p>
                        <div className="d-flex gap-3 justify-content-center">
                            <Button
                                onClick={() => setShowLogoutWarning(false)}
                                style={{
                                    background: 'transparent',
                                    color: '#854d0e',
                                    fontWeight: 700,
                                    border: '2px solid #854d0e',
                                    borderRadius: '2rem',
                                    padding: '0.5rem 2rem'
                                }}
                            >
                                Stay
                            </Button>
                            <Button
                                onClick={confirmLogout}
                                style={{
                                    background: '#854d0e',
                                    color: '#fff',
                                    fontWeight: 700,
                                    border: 'none',
                                    borderRadius: '2rem',
                                    padding: '0.5rem 2rem'
                                }}
                            >
                                Yes, Logout
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* Logout Success Modal */}
                <Modal show={showLogoutSuccess} onHide={finalizeLogout} centered>
                    <Modal.Body style={{ background: '#ef4444', borderRadius: '1rem', padding: '2.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚪</div>
                        <h3 style={{ color: '#fff', fontWeight: 800, marginBottom: '0.5rem' }}>Logged Out!</h3>
                        <p style={{ color: '#fee2e2', marginBottom: '1.5rem', fontWeight: 600 }}>
                            You have been successfully logged out.
                        </p>
                        <Button
                            onClick={finalizeLogout}
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

                <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 brand-font d-flex align-items-center" style={{ textDecoration: 'none' }}>
                    <img 
                        src="https://img.freepik.com/premium-vector/cff-logo-cff-letter-cff-letter-logo-design-initials-cff-logo-linked-with-circle-uppercase-monogram-logo-cff-typography-technology-business-real-estate-brand_229120-54178.jpg" 
                        alt="Logo" 
                        style={{ width: '40px', height: '40px', marginRight: '10px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <span style={{ color: '#3b82f6' }}>Co-Founder</span> <span style={{ color: '#ef4444' }}>Finder</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/" className="fw-semibold mx-2 nav-btn-hover rounded-pill px-3">Home</Nav.Link>
                        <Nav.Link as={Link} to="/feed" className="fw-semibold mx-2 nav-btn-hover rounded-pill px-3">Innovations</Nav.Link>
                        {user ? (
                            <>
                                <Nav.Link as={Link} to="/dashboard" className="fw-semibold mx-2 text-dark nav-btn-hover rounded-pill px-3" onClick={() => setExpanded(false)}>Dashboard</Nav.Link>
                                
                                {/* Notification NavLink */}
                                <Nav.Link 
                                    as={Link} 
                                    to="/notifications" 
                                    className="d-flex align-items-center ms-lg-2 my-2 my-lg-0" 
                                    onClick={() => setExpanded(false)}
                                >
                                    <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#eff6ff', border: '2px solid #3b82f6', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(59,130,246,0.15)' }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <span style={{ fontSize: '1.25rem' }}>🔔</span>
                                        {totalNotifications > 0 && (
                                            <Badge bg="danger" pill className="position-absolute" style={{ top: '0px', right: '-2px', fontSize: '0.65rem' }}>
                                                {totalNotifications}
                                            </Badge>
                                        )}
                                    </div>
                                    <span className="d-lg-none ms-2 fw-semibold text-dark">Notifications</span>
                                </Nav.Link>

                                {/* Profile NavLink */}
                                <Nav.Link 
                                    as={Link} 
                                    to="/profile" 
                                    className="d-flex align-items-center ms-lg-3 my-2 my-lg-0"
                                    onClick={() => setExpanded(false)}
                                >
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '42px',
                                        height: '42px',
                                        borderRadius: '50%',
                                        background: '#f1f5f9',
                                        border: '2px solid #6366f1',
                                        fontSize: '1.25rem',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 2px 8px rgba(99,102,241,0.15)'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        👤
                                    </div>
                                    <span className="d-lg-none ms-2 fw-semibold text-dark">My Profile</span>
                                </Nav.Link>
                                
                                {/* Logout Button */}
                                <Button 
                                    variant="outline-danger" 
                                    className="ms-lg-3 my-2 my-lg-0 d-flex align-items-center justify-content-center shadow-sm"
                                    style={{ width: '42px', height: '42px', borderRadius: '50%', padding: '0' }}
                                    onClick={handleLogoutClick}
                                    title="Logout"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className="fw-semibold mx-2 nav-btn-hover rounded-pill px-3">Login</Nav.Link>
                                <Button as={Link} to="/register" variant="primary" className="ms-3 fw-bold rounded-pill px-4 nav-btn-hover">
                                    Join Now
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
