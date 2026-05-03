import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';


const PrivateLayout = ({ children }) => (
    <>
        <Navbar />
        <main className="min-h-screen bg-[#f8fafc]">
            {children}
        </main>
    </>
);

function App() {
    return (
        <Router>
            <Routes>
              
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <PrivateLayout>
                                <Dashboard />
                            </PrivateLayout>
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/project/:id" 
                    element={
                        <ProtectedRoute>
                            <PrivateLayout>
                                <ProjectDetails />
                            </PrivateLayout>
                        </ProtectedRoute>
                    } 
                />

                {/* Fallback: Redirect any unknown route to dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
