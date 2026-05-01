import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Badge, Spinner, Image, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        skills: '',
        interests: '',
        experienceLevel: 'Beginner',
        role: 'Developer',
        linkedin: '',
        projects: [],
        profilePicture: '',
        coverPhoto: 'https://images.unsplash.com/photo-1549492423-40024224c6e1?q=80&w=1500&auto=format&fit=crop'
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const storedUserInfo = sessionStorage.getItem('userInfo');
    const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

    useEffect(() => {
        if (!userInfo || !userInfo._id) {
            console.error('No valid user session found');
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const { data: user } = await axios.get(`/api/auth/${userInfo._id}`);
                if (!user) throw new Error('User not found');
                
                setFormData({
                    name: user.name || '',
                    bio: user.bio || '',
                    skills: user.skills?.join(', ') || '',
                    interests: user.interests?.join(', ') || '',
                    experienceLevel: user.experienceLevel || 'Beginner',
                    role: user.role || 'Developer',
                    linkedin: user.linkedin || '',
                    projects: user.projects || [],
                    profilePicture: user.profilePicture || '',
                    coverPhoto: user.coverPhoto || 'https://images.unsplash.com/photo-1549492423-40024224c6e1?q=80&w=1500&auto=format&fit=crop'
                });

                setLoading(false);
            } catch (err) {
                console.error('Error loading profile:', err);
                setError('Failed to load profile data. Please try logging in again.');
                setLoading(false);
                // Clear local storage if 404 occurs on own profile, it might be a stale session
                if (err.response?.status === 404) {
                    console.warn('Session user not found in DB, logging out...');
                    // sessionStorage.removeItem('userInfo');
                    // navigate('/login');
                }
            }
        };
        fetchData();
    }, [navigate]); // Removed userInfo._id to prevent loops if session is unstable

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('Image size should be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, [type]: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = (type) => {
        setFormData({ ...formData, [type]: type === 'coverPhoto' ? 'https://images.unsplash.com/photo-1549492423-40024224c6e1?q=80&w=1500&auto=format&fit=crop' : '' });
    };

    const addProject = () => {
        setFormData({
            ...formData,
            projects: [...formData.projects, { name: '', description: '', link: '' }]
        });
    };

    const removeProject = (index) => {
        const newProjects = formData.projects.filter((_, i) => i !== index);
        setFormData({ ...formData, projects: newProjects });
    };

    const handleProjectChange = (index, field, value) => {
        const newProjects = [...formData.projects];
        newProjects[index][field] = value;
        setFormData({ ...formData, projects: newProjects });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const dataToUpdate = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
                interests: formData.interests.split(',').map(i => i.trim()).filter(i => i !== '')
            };
            
            const { data } = await axios.put(`/api/auth/profile/${userInfo._id}`, dataToUpdate);
            
            sessionStorage.setItem('userInfo', JSON.stringify({ 
                ...userInfo, 
                name: data.name, 
                role: data.role,
                profilePicture: data.profilePicture 
            }));
            window.dispatchEvent(new Event('authChange'));
            
            setMessage('Profile updated successfully!');
            setShowSuccess(true);
            setIsEditing(false);
            window.scrollTo(0, 0);
        } catch (err) {
            console.error('Update profile error:', err);
            setError(err.response?.data?.message || 'Failed to update profile.');
        }
    };

    if (loading) return (
        <Container className="text-center py-5">
            <Spinner animation="border" variant="primary" />
        </Container>
    );

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col lg={10} xl={9}>
                    {/* LinkedIn Style Header Card */}
                    <Card className="border-0 shadow-sm overflow-hidden rounded-4 mb-4 position-relative">
                        {/* Banner */}
                        <div className="position-relative" style={{ height: '200px' }}>
                            <Image 
                                src={formData.coverPhoto} 
                                className="w-100 h-100" 
                                style={{ objectFit: 'cover' }} 
                                alt=""
                            />
                            {isEditing && (
                                <div className="position-absolute top-0 end-0 p-3">
                                    <Form.Label htmlFor="coverUpload" className="btn btn-light btn-sm rounded-pill shadow-sm">
                                        📷
                                    </Form.Label>
                                    <Form.Control id="coverUpload" type="file" className="d-none" accept="image/*" onChange={(e) => handleImageUpload(e, 'coverPhoto')} />
                                </div>
                            )}
                        </div>

                        {/* Profile Info Overlay */}
                        <Card.Body className="pt-0 px-4 pb-4">
                            <div className="d-flex justify-content-between align-items-end" style={{ marginTop: '-60px' }}>
                                <div className="position-relative">
                                    {formData.profilePicture ? (
                                        <Image 
                                            src={formData.profilePicture} 
                                            roundedCircle 
                                            className="border border-4 border-white shadow-sm"
                                            style={{ width: '152px', height: '152px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                            <div 
                                                className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm border border-4 border-white"
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
                                    {isEditing && (
                                        <Form.Label htmlFor="profileUpload" className="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 shadow-sm p-2" style={{ cursor: 'pointer' }}>
                                            📷
                                            <Form.Control id="profileUpload" type="file" className="d-none" accept="image/*" onChange={(e) => handleImageUpload(e, 'profilePicture')} />
                                        </Form.Label>
                                    )}
                                </div>
                                <div className="mb-3">
                                    {!isEditing && (
                                        <Button variant="outline-primary" className="rounded-pill fw-bold" onClick={() => setIsEditing(true)}>
                                            Edit Profile
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3">
                                <h1 className="fw-bold fs-3 mb-0">{formData.name}</h1>
                                <p className="lead text-muted fs-6 mb-2">
                                    {formData.role} | {formData.experienceLevel} Level
                                </p>
                                <div className="d-flex align-items-center gap-3">
                                    {formData.linkedin && (
                                        <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary fw-bold text-decoration-none">
                                            LinkedIn Profile ↗
                                        </a>
                                    )}
                                    <span className="text-muted small">San Francisco Bay Area</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {message && <Alert variant="success" className="rounded-4">{message}</Alert>}
                    {error && <Alert variant="danger" className="rounded-4">{error}</Alert>}

                    {/* Section Cards */}
                    {!isEditing ? (
                        <>
                            <Card className="border-0 shadow-sm rounded-4 mb-4 p-3">
                                <Card.Body>
                                    <h4 className="fw-bold mb-3">About</h4>
                                    <p className="text-muted fs-5" style={{ whiteSpace: 'pre-wrap' }}>
                                        {formData.bio || "No bio available. Add one to stand out!"}
                                    </p>
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm rounded-4 mb-4 p-3">
                                <Card.Body>
                                    <h4 className="fw-bold mb-3">Skills & Expertise</h4>
                                    <div className="d-flex flex-wrap gap-2 mb-4">
                                        {formData.skills ? formData.skills.split(',').map((s, i) => (
                                            <Badge key={i} bg="light" text="dark" className="border px-3 py-2 rounded-pill fs-6">{s.trim()}</Badge>
                                        )) : <span className="text-muted">No skills listed.</span>}
                                    </div>
                                    <h5 className="fw-bold mb-2">Interests</h5>
                                    <div className="d-flex flex-wrap gap-2">
                                        {formData.interests ? formData.interests.split(',').map((s, i) => (
                                            <Badge key={i} bg="info" className="px-3 py-2 rounded-pill">{s.trim()}</Badge>
                                        )) : <span className="text-muted">No interests listed.</span>}
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm rounded-4 mb-4 p-3">
                                <Card.Body>
                                    <h4 className="fw-bold mb-3">Projects</h4>
                                    {formData.projects.length > 0 ? (
                                        <Row className="g-3">
                                            {formData.projects.map((p, i) => (
                                                <Col key={i} md={6}>
                                                    <Card className="border h-100 p-3 rounded-4 bg-light shadow-none">
                                                        <h6 className="fw-bold mb-1">{p.name}</h6>
                                                        <p className="small text-muted mb-2">{p.description}</p>
                                                        {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="small text-primary fw-bold">View Project ↗</a>}
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    ) : (
                                        <p className="text-muted">No projects listed yet.</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </>
                    ) : (
                        /* Edit Form Card */
                        <Card className="border-0 shadow-sm rounded-4 mb-4 p-4">
                            <Card.Body>
                                <h4 className="fw-bold mb-4">Update Profile Information</h4>
                                <Form onSubmit={submitHandler}>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Full Name</Form.Label>
                                                <Form.Control type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="rounded-pill px-4" />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">LinkedIn URL</Form.Label>
                                                <Form.Control type="url" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} className="rounded-pill px-4" />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Professional Bio</Form.Label>
                                        <Form.Control as="textarea" rows={4} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="rounded-4" />
                                    </Form.Group>

                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Current Role</Form.Label>
                                                <Form.Select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="rounded-pill px-4">
                                                    <option>Developer</option>
                                                    <option>Designer</option>
                                                    <option>Innovator</option>
                                                    <option>Marketer</option>
                                                    <option>Business Manager</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Experience Level</Form.Label>
                                                <Form.Select value={formData.experienceLevel} onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})} className="rounded-pill px-4">
                                                    <option>Beginner</option>
                                                    <option>Intermediate</option>
                                                    <option>Expert</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mb-4">
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Skills</Form.Label>
                                                <Form.Control type="text" placeholder="e.g. React, Node.js" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} className="rounded-pill px-4" />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Interests</Form.Label>
                                                <Form.Control type="text" placeholder="e.g. AI, Fintech" value={formData.interests} onChange={(e) => setFormData({...formData, interests: e.target.value})} className="rounded-pill px-4" />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="fw-bold m-0">Projects</h5>
                                            <Button variant="outline-primary" size="sm" onClick={addProject} className="rounded-pill">+ Add</Button>
                                        </div>
                                        {formData.projects.map((p, i) => (
                                            <Card key={i} className="mb-3 border-0 bg-light p-3 rounded-4">
                                                <div className="text-end">
                                                    <Button variant="link" className="text-danger p-0 shadow-none" onClick={() => removeProject(i)}>✕ Remove</Button>
                                                </div>
                                                <Form.Group className="mb-2">
                                                    <Form.Label className="small fw-bold">Name</Form.Label>
                                                    <Form.Control size="sm" type="text" value={p.name} onChange={(e) => handleProjectChange(i, 'name', e.target.value)} className="rounded-pill" />
                                                </Form.Group>
                                                <Form.Group className="mb-2">
                                                    <Form.Label className="small fw-bold">Link</Form.Label>
                                                    <Form.Control size="sm" type="url" value={p.link} onChange={(e) => handleProjectChange(i, 'link', e.target.value)} className="rounded-pill" />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label className="small fw-bold">Description</Form.Label>
                                                    <Form.Control size="sm" as="textarea" value={p.description} onChange={(e) => handleProjectChange(i, 'description', e.target.value)} className="rounded-3" />
                                                </Form.Group>
                                            </Card>
                                        ))}
                                    </div>

                                    <div className="d-flex gap-2">
                                        <Button variant="primary" type="submit" className="flex-grow-1 rounded-pill py-2 fw-bold">
                                            Save All Changes
                                        </Button>
                                        <Button variant="light" className="rounded-pill px-4 border" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
            <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
                <Modal.Body className="text-center p-5">
                    <div className="mb-4 text-success" style={{ fontSize: '4.5rem' }}>
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <h2 className="fw-bold text-success mb-3">Profile Updated!</h2>
                    <p className="text-muted fs-5 mb-4">Your changes have been saved successfully.</p>
                    <Button variant="success" className="rounded-pill px-5 py-2 fw-bold shadow-sm" onClick={() => setShowSuccess(false)}>
                        Great!
                    </Button>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Profile;
