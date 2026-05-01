import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', message: '', variant: 'success' });
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            window.dispatchEvent(new Event('authChange'));
            
            setModalConfig({
                title: 'Success!',
                message: 'Login successful.',
                variant: 'success'
            });
            setShowModal(true);
            
            setTimeout(() => {
                setShowModal(false);
                navigate('/dashboard');
            }, 1500);
        } catch (err) {
            setModalConfig({
                title: 'Login Failed',
                message: err.response?.data?.message || 'Invalid credentials',
                variant: 'danger'
            });
            setShowModal(true);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card className="glass-card p-4 shadow-lg border-0" style={{ maxWidth: '450px', width: '100%' }}>
                <Card.Body>
                    <div className="text-center mb-3 brand-font d-flex align-items-center justify-content-center" style={{ fontSize: '1.7rem', whiteSpace: 'nowrap', width: '100%' }}>
                        <img 
                            src="https://img.freepik.com/premium-vector/cff-logo-cff-letter-cff-letter-logo-design-initials-cff-logo-linked-with-circle-uppercase-monogram-logo-cff-typography-technology-business-real-estate-brand_229120-54178.jpg" 
                            alt="Logo" 
                            style={{ width: '35px', height: '35px', marginRight: '10px', borderRadius: '50%' }} 
                        />
                        <span style={{ color: '#3b82f6' }}>Co-Founder</span><span className="ms-1" style={{ color: '#ef4444' }}>Finder</span>
                    </div>
                    <h2 className="text-center fw-bold mb-4">Welcome Back</h2>
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Enter email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="rounded-pill px-4 py-2 border-primary"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Enter password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="rounded-pill px-4 py-2 border-primary"
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 rounded-pill py-2 shadow-sm fs-5 fw-bold">
                            Login
                        </Button>
                    </Form>
                    <div className="mt-4 text-center">
                        New here? <Link to="/register" className="text-decoration-none fw-bold">Create an Account</Link>
                    </div>
                </Card.Body>
            </Card>

            {/* Status Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body style={{ 
                    background: modalConfig.variant === 'success' ? '#16a34a' : '#ef4444', 
                    borderRadius: '1rem', 
                    padding: '2.5rem', 
                    textAlign: 'center' 
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                        {modalConfig.variant === 'success' ? '✅' : '❌'}
                    </div>
                    <h3 style={{ color: '#fff', fontWeight: 800, marginBottom: '0.5rem' }}>
                        {modalConfig.title}
                    </h3>
                    <p style={{ color: modalConfig.variant === 'success' ? '#dcfce7' : '#fee2e2', marginBottom: '1.5rem', fontWeight: 600 }}>
                        {modalConfig.message}
                    </p>
                    <Button 
                        onClick={() => setShowModal(false)}
                        style={{
                            background: '#fff',
                            color: modalConfig.variant === 'success' ? '#16a34a' : '#ef4444',
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
        </Container>
    );
};

export default Login;
