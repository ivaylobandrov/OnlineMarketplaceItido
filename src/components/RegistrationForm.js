"use client";

import { useState } from 'react';

const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();
        if (data.success) {
            setSuccess('Registration successful!');
            setError('');
        } else {
            setError(data.message || 'Registration failed. Please try again.');
            setSuccess('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <h2 className="mb-4">Register</h2>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">{success}</div>}
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="border mb-2 p-1"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="border mb-2 p-1"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="border mb-2 p-1"
            />
            <button type="submit" className="bg-blue-500 text-white p-2">Register</button>
        </form>
    );
};

export default RegistrationForm;