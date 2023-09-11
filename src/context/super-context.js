import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, SidebarProvider, AlertProvider, AuthProvider } from "../context";

function SuperProvider({children}) {
    return (
        <>
        <Router>
            <AuthProvider>
                <AlertProvider>
                    <SidebarProvider>
                        <ThemeProvider>
                            {children}
                        </ThemeProvider>
                    </SidebarProvider>
                </AlertProvider>
            </AuthProvider>
        </Router>
        </>
    );
}

export default SuperProvider;