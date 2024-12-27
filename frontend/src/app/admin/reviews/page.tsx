// app/admin/reviews/page.tsx
import api from '@/utils/api';
import { useEffect, useState } from 'react';

interface Review {
    id: string;
    title: string;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        const { data } = await api.get<Review[]>('/reviews');
        setReviews(data);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Reviews</h2>
            <ul>
                {reviews.map((review) => (
                    <li key={review.id}>
                        <p>{review.title}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
