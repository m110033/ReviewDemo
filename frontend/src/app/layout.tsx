// app/layout.tsx
import './globals.css';

export const metadata = {
    title: 'Performance Review App',
    description: 'Manage employee performance reviews',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
