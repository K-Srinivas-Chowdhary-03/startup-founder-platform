import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [showDialog, setShowDialog] = useState(false);

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

            {/* Hero Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                padding: '4rem 0 3rem',
                textAlign: 'center',
                marginBottom: '3rem'
            }}>
                <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2.8rem', marginBottom: '0.75rem' }}>
                    📬 Get In Touch
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem', maxWidth: '500px', margin: '0 auto' }}>
                    Have a question or want to collaborate? We'd love to hear from you.
                </p>
            </div>

            <Container style={{ maxWidth: '680px', marginBottom: '5rem' }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '1.5rem',
                    padding: '2.5rem',
                    boxShadow: '0 8px 32px rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.1)'
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
            </Container>
        </>
    );
};

export default Contact;
