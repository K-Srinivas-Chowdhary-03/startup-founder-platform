import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Developer');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', message: '', variant: 'success' });
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register', { name, email, password, role });
            
            setModalConfig({
                title: 'Welcome Aboard!',
                message: 'Account created! Please sign in.',
                variant: 'success'
            });
            setShowModal(true);
            
            setTimeout(() => {
                setShowModal(false);
                navigate('/login');
            }, 2500);
        } catch (err) {
            setModalConfig({
                title: 'Registration Failed',
                message: err.response?.data?.message || 'Registration failed. Please try again.',
                variant: 'danger'
            });
            setShowModal(true);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card className="glass-card p-4 shadow-lg border-0" style={{ maxWidth: '450px', width: '100%' }}>
                <Card.Body>
                    <h2 className="text-center fw-bold mb-4 d-flex align-items-center justify-content-center">
                        Join 
                        <img 
                            src="https://img.freepik.com/premium-vector/cff-logo-cff-letter-cff-letter-logo-design-initials-cff-logo-linked-with-circle-uppercase-monogram-logo-cff-typography-technology-business-real-estate-brand_229120-54178.jpg" 
                            alt="Logo" 
                            style={{ width: '35px', height: '35px', margin: '0 10px', borderRadius: '50%' }} 
                        />
                        <span className="brand-font" style={{ color: '#3b82f6' }}>Co-Founder</span> <span className="brand-font" style={{ color: '#ef4444' }}>Finder</span>
                    </h2>
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="rounded-pill px-4 py-2 border-primary"
                                required
                            />
                        </Form.Group>
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
                        <Form.Group className="mb-3" controlId="role">
                            <Form.Label>I am a...</Form.Label>
                            <Form.Select 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                                className="rounded-pill px-4 py-2 border-primary"
                            >
                                <option>Developer</option>
                                <option>Designer</option>
                                <option>Innovator</option>
                                <option>Marketer</option>
                                <option>Business Manager</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Create password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="rounded-pill px-4 py-2 border-primary"
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 rounded-pill py-2 shadow-sm fs-5 fw-bold">
                            Create Account
                        </Button>
                    </Form>
                    <div className="mt-4 text-center">
                        Already have an account? <Link to="/login" className="text-decoration-none fw-bold">Log In</Link>
                    </div>
                </Card.Body>
            </Card>

            {/* Status Modal */}
            <Modal show={showModal} onHide={() => { setShowModal(false); if (modalConfig.variant === 'success') navigate('/login'); }} centered>
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
                        onClick={() => { setShowModal(false); if (modalConfig.variant === 'success') navigate('/login'); }}
                        style={{
                            background: '#fff',
                            color: modalConfig.variant === 'success' ? '#16a34a' : '#ef4444',
                            fontWeight: 700,
                            border: 'none',
                            borderRadius: '2rem',
                            padding: '0.5rem 2.0rem'
                        }}
                    >
                        {modalConfig.variant === 'success' ? 'Go to Login' : 'Close'}
                    </Button>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Register;
