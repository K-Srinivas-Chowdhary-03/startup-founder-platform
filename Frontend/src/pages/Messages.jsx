import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Image, Badge, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Messages = () => {
    const { id: activeUserId } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('userInfo'));
    
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [activeUser, setActiveUser] = useState(null);
    const messagesEndRef = useRef(null);

    // Fetch conversations list
    const fetchConversations = async () => {
        try {
            const { data } = await axios.get(`/api/messages/conversations/${user._id}`);
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations', error);
        }
    };

    // Fetch messages for active user
    const fetchMessages = async () => {
        if (!activeUserId) return;
        try {
            const { data } = await axios.get(`/api/messages/conversation/${user._id}/${activeUserId}`);
            setMessages(data);
            
            // Mark as read
            await axios.put(`/api/messages/read/${activeUserId}/${user._id}`);
            
            // Reload conversations to update unread count
            fetchConversations();
        } catch (error) {
            console.error('Error fetching messages', error);
        }
    };

    // Load user basic info if activeUserId is present but not in conversations yet
    const fetchActiveUserInfo = async () => {
        if (!activeUserId) return null;
        try {
            const { data } = await axios.get(`/api/auth/${activeUserId}`);
            return data;
        } catch (error) {
            console.error('Error fetching user info', error);
            return null;
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchConversations();
    }, [navigate, user?._id]);

    useEffect(() => {
        const initActiveChat = async () => {
            if (activeUserId) {
                const existingConv = conversations.find(c => c.user._id === activeUserId);
                if (existingConv) {
                    setActiveUser(existingConv.user);
                } else {
                    const info = await fetchActiveUserInfo();
                    if (info) setActiveUser(info);
                }
                fetchMessages();
            } else {
                setActiveUser(null);
                setMessages([]);
            }
        };
        initActiveChat();
        
        // Polling
        const intervalId = setInterval(() => {
            fetchConversations();
            if (activeUserId) {
                fetchMessages();
            }
        }, 3000);
        
        return () => clearInterval(intervalId);
    }, [activeUserId]);

    useEffect(() => {
        // Scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeUserId) return;

        try {
            const { data } = await axios.post('/api/messages/send', {
                senderId: user._id,
                receiverId: activeUserId,
                content: newMessage
            });
            setMessages([...messages, data]);
            setNewMessage('');
            fetchConversations();
        } catch (error) {
            console.error('Error sending message', error);
        }
    };

    return (
        <div className="h-100 w-100 bg-white">
            <Row className="g-0 h-100">
                {/* Sidebar */}
                <Col md={4} lg={3} className="border-end h-100 d-flex flex-column" style={{ background: '#f8fafc' }}>
                    <div className="p-3 border-bottom bg-white d-flex align-items-center gap-3">
                        <Button variant="light" size="sm" className="rounded-circle p-2 shadow-sm" onClick={() => navigate('/dashboard')} title="Back to Dashboard">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                        </Button>
                        <h5 className="fw-bold m-0 brand-font">Messages</h5>
                    </div>
                        <ListGroup variant="flush" className="flex-grow-1">
                            {conversations.length === 0 ? (
                                <div className="p-4 text-center text-muted">No conversations yet</div>
                            ) : (
                                conversations.map((conv) => (
                                    <ListGroup.Item 
                                        key={conv.user._id}
                                        action
                                        active={activeUserId === conv.user._id}
                                        onClick={() => navigate(`/messages/${conv.user._id}`)}
                                        className="border-bottom p-3 d-flex align-items-center gap-3"
                                        style={{ 
                                            cursor: 'pointer',
                                            borderLeft: activeUserId === conv.user._id ? '4px solid #6366f1' : 'none',
                                            backgroundColor: activeUserId === conv.user._id ? '#f1f5f9' : 'transparent',
                                            color: 'inherit'
                                        }}
                                    >
                                        {conv.user.profilePicture ? (
                                            <Image src={conv.user.profilePicture} roundedCircle width={48} height={48} style={{ objectFit: 'cover' }} />
                                        ) : (
                                            <div className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold" style={{ width: 48, height: 48, background: '#6366f1' }}>
                                                {conv.user.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="flex-grow-1 overflow-hidden">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h6 className="mb-0 fw-bold text-truncate">{conv.user.name}</h6>
                                                {conv.unreadCount > 0 && (
                                                    <Badge bg="danger" pill>{conv.unreadCount}</Badge>
                                                )}
                                            </div>
                                            <p className="mb-0 small text-muted text-truncate" style={{ fontSize: '0.8rem' }}>
                                                {conv.lastMessage?.content}
                                            </p>
                                        </div>
                                    </ListGroup.Item>
                                ))
                            )}
                        </ListGroup>
                    </Col>

                    {/* Chat Area */}
                    <Col md={8} lg={9} className="d-flex flex-column h-100">
                        {activeUser ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-3 border-bottom d-flex align-items-center gap-3 bg-white">
                                    {activeUser.profilePicture ? (
                                        <Image src={activeUser.profilePicture} roundedCircle width={40} height={40} style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold" style={{ width: 40, height: 40, background: '#6366f1' }}>
                                            {activeUser.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h6 className="mb-0 fw-bold">{activeUser.name}</h6>
                                        <small className="text-muted">{activeUser.role}</small>
                                    </div>
                                    <Button variant="link" className="ms-auto p-0 text-muted" onClick={() => navigate(`/profile/${activeUser._id}`)}>
                                        View Profile
                                    </Button>
                                </div>

                                {/* Chat Messages Collection */}
                                <div className="flex-grow-1 p-4 overflow-auto" style={{ background: '#f8fafc' }}>
                                    {messages.map((msg, index) => {
                                        const isSender = msg.senderId === user._id;
                                        return (
                                            <div key={msg._id || index} className={`d-flex mb-3 ${isSender ? 'justify-content-end' : 'justify-content-start'}`}>
                                                <div 
                                                    className={`p-3 rounded-4 shadow-sm ${isSender ? 'bg-primary text-white' : 'bg-white border'}`}
                                                    style={{ maxWidth: '75%', borderBottomRightRadius: isSender ? 0 : '1rem', borderBottomLeftRadius: isSender ? '1rem' : 0 }}
                                                >
                                                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                                                    <div className={`mt-1 small text-end ${isSender ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        {isSender && (
                                                            <span className="ms-2">
                                                                {msg.isRead ? '✓✓' : '✓'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Chat Input */}
                                <div className="p-3 bg-white border-top">
                                    <Form onSubmit={handleSendMessage} className="d-flex gap-2">
                                        <Form.Control
                                            type="text"
                                            placeholder="Type a message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            className="rounded-pill px-4 bg-light border-0"
                                            autoFocus
                                        />
                                        <Button type="submit" variant="primary" className="rounded-pill px-4 fw-bold shadow-sm" disabled={!newMessage.trim()}>
                                            Send
                                        </Button>
                                    </Form>
                                </div>
                            </>
                        ) : (
                            <div className="h-100 d-flex flex-column justify-content-center align-items-center text-muted p-5 text-center">
                                <div className="p-4 rounded-circle bg-light mb-3">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </div>
                                <h4 className="fw-bold text-dark">Your Messages</h4>
                                <p>Select a conversation from the sidebar or start a new one from a user's profile.</p>
                            </div>
                        )}
                    </Col>
            </Row>
        </div>
    );
};

export default Messages;
