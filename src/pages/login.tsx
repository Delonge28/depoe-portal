import React, { useState } from 'react';
import Layout from '../app/layout';


const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Get CSRF token

            const csrfRes = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/sanctum/csrf-cookie', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: "application/json",
                },
            });
            const csrfToken = csrfRes.headers.get('XSRF-TOKEN');
            if (!csrfRes.ok) {
                throw new Error('Failed to fetch CSRF token');
            }

            // CSRF token retrieved successfully, now make the login request
            const loginRes = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/v3/login', {
                method: 'POST',
                credentials: 'include', // necessary to include cookies
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
                body: JSON.stringify({
                    email: username, // Assuming username is actually an email
                    password: password,
                }),
            });

            if (!loginRes.ok) {
                throw new Error('Failed to log in');
            }

            const data = await loginRes.json();
            console.log(data); // Here you can handle the response data as you need
        } catch (error) {
            console.error('Login failed:', error);
        }
    };


    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-lg shadow-2xl">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                            Sign in to your account
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default LoginPage;
