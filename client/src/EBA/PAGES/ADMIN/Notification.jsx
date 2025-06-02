import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        const [ordersRes, stockRes] = await Promise.all([
        axios.get('/api/notifications/new-orders'),
        axios.get('/api/notifications/low-stock'),
        ]);

        const newNotifications = [];

        ordersRes.data.forEach(order =>
        newNotifications.push({ type: 'New Order', message: `Order #${order.id} is pending` })
        );

        stockRes.data.forEach(item =>
        newNotifications.push({ type: 'Low Stock', message: `${item.item_name} is low in stock (${item.quantity})` })
        );

        setNotifications(newNotifications);
    };

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="notification">
            {notifications.map((note, idx) => (
                <div key={idx} className="notification-item">
                    <strong>{note.type}:</strong> {note.message}
                </div>
            ))}
        </div>
    );
};

export default NotificationBell;
