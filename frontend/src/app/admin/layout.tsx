import Navbar from '@/components/Navbar';
import { ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    );
}
