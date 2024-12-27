// app/employee/feedback/page.tsx
import api from '@/utils/api';
import { useState } from 'react';

export default function SubmitFeedbackPage() {
    const [feedback, setFeedback] = useState('');

    const submitFeedback = async () => {
        await api.post('/reviews/{id}/feedbacks', { feedback });
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Submit Feedback</h2>
            <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full border p-2"
            />
            <button
                onClick={submitFeedback}
                className="bg-blue-500 text-white px-4 py-2 mt-2"
            >
                Submit
            </button>
        </div>
    );
}
