import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft, faChevronLeft, faFilter, faRotateRight } from '@fortawesome/free-solid-svg-icons';

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [table, setTable] = useState(true);
    const [filter, setFilter] = useState(false);
    const [details, setDetails] = useState(null);
    const [formData, setFormData] = useState({});
    const [sortOrder, setSortOrder] = useState('DESC');
    const [statusSorted, setStatusSorted] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchTransactions(sortOrder);
    }, [sortOrder]);

    const fetchTransactions = async (order) => {
        const response = await axios.get(`http://localhost:3000/transaction?order=${order}`);
        setTransactions(response.data);
        setStatusSorted(false);
    };

    const toggleTable = () => setTable(!table);

    const toggleSortOrder = () => {
        setSortOrder(prev => (prev === 'DESC' ? 'ASC' : 'DESC'));
    };

    const sortByStatus = () => {
        const statusPriority = { Confirmed: 1, Pending: 2, Cancelled: 3 };
        const sorted = [...transactions].sort((a, b) => {
            return statusPriority[a.Status] - statusPriority[b.Status];
        });
        setTransactions(sorted);
        setStatusSorted(true);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleDetails = (transaction) => {
        setDetails(transaction);
        setFormData({ 
            image: transaction.Image, 
            itemName: transaction.Item_Name, 
            variant: transaction.Variant, 
            size: transaction.Size, 
            quantity: transaction.Quantity, 
            amount: transaction.Amount,
            customerName: transaction.Customer_Name,
            emailAddress: transaction.Email_Address,
            phoneNumber: transaction.Phone_Number,
            date: transaction.Date,
            status: transaction.Status
        });
    };

    const confirmOrder = async () => {
        setConfirming(true);
        try {
            const response = await axios.post('http://localhost:3000/confirm-order', {
                orderId: details.ID,
                name: details.customerName,
                customerEmail: details.Email_Address,
            });
        
            const updated = transactions.map(txn =>
                txn.ID === details.ID ? { ...txn, Status: 'Confirmed' } : txn
            );
            setTransactions(statusSorted ? sortStatusList(updated) : updated);
            setDetails(null);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'An error occurred while confirming the order.');
        } finally {
            setConfirming(false);
        }
    };    

    const cancelOrder = async () => {
        setCancelling(true);
        try {
            const response = await axios.post('http://localhost:3000/cancel-order', {
                orderId: details.ID,
                name: details.Customer_Name,
                customerEmail: details.Email_Address,
            });
        
            const updated = transactions.map(txn =>
                txn.ID === details.ID ? { ...txn, Status: 'Cancelled' } : txn
            );
            setTransactions(statusSorted ? sortStatusList(updated) : updated);
            setDetails(null);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'An error occurred while cancelling the order.');
        } finally {
            setCancelling(false);
        }
    };    

    const sortStatusList = (list) => {
        const priority = { Confirmed: 1, Pending: 2, Cancelled: 3 };
        return [...list].sort((a, b) => priority[a.Status] - priority[b.Status]);
    };

    const refresh = () => {
        fetchTransactions();
    }

    return (
        <div className="admin-content">
            <h1>Transaction</h1>

            <div className="transaction main-content">
                <div className="top">
                    <div className="top-block">
                        <h2>{table ? 'Order Information' : 'Customer Information'}</h2>
                        <p onClick={toggleTable}>
                            {table ? 'Customer Information' : 'Order Information'}
                        </p>
                        <FontAwesomeIcon icon={faRotateRight} onClick={refresh} className='icon' />
                    </div>

                    <div className="top-block">
                        <h4>Total Transaction: {transactions.length}</h4>

                        <FontAwesomeIcon icon={faFilter} className='filter' onClick={() => setFilter(!filter)} />
                        {filter && (
                            <div className="filter-dropdown">
                                <button onClick={toggleSortOrder}>Sort by Date <FontAwesomeIcon icon={faArrowRightArrowLeft} style={{ transform: 'rotate(90deg)' }} /></button>
                                <button onClick={sortByStatus}>Sort by Status</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                {table ? (
                                    <>
                                        <th>Image</th>
                                        <th>Item Name</th>
                                        <th>Variant</th>
                                        <th>Size</th>
                                        <th>Quantity</th>
                                        <th>Amount</th>
                                    </>
                                ) : (
                                    <>
                                        <th>Customer Name</th>
                                        <th>Email Address</th>
                                        <th>Phone Number</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </>
                                )}
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <th colSpan="100%"><h3 className='no'>No Transaction</h3></th>
                                </tr>
                            ) : (
                                transactions.map((transaction, index) => (
                                    <tr key={index}>
                                        {table ? (
                                            <>
                                                <td><img src={`http://localhost:3000/ITEMS/${transaction.Image}`} alt="" /></td>
                                                <td>{transaction.Item_Name}</td>
                                                <td>{transaction.Variant || '-'}</td>
                                                <td>{transaction.Size || '-'}</td>
                                                <td>{transaction.Quantity}</td>
                                                <td>{transaction.Amount}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{transaction.Customer_Name}</td>
                                                <td>{transaction.Email_Address}</td>
                                                <td>{transaction.Phone_Number}</td>
                                                <td>{formatDate(transaction.Date)}</td>
                                                <td>{transaction.Status}</td>
                                            </>
                                        )}
                                        <td className='btn'>
                                            <button onClick={() => handleDetails(transaction)}>See Details</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {details && (
                    <div className="modal-container">
                        <div className="modal">
                            <div className="title">
                                <FontAwesomeIcon icon={faChevronLeft} className='icon' onClick={() => setDetails(null)} />
                                <h3>Order Details</h3>
                            </div>

                            <div className="order">
                                <div className="detail-block"><label>Image:</label><div className="img-block"><img src={`http://localhost:3000/ITEMS/${formData.image}`} alt="" /></div></div>
                                <div className="detail-block"><label>Item Name:</label><p>{formData.itemName}</p></div>
                                <div className="detail-block"><label>Variant:</label><p>{formData.variant}</p></div>
                                <div className="detail-block"><label>Size:</label><p>{formData.size}</p></div>
                                <div className="detail-block"><label>Quantity:</label><p>{formData.quantity}</p></div>
                                <div className="detail-block"><label>Amount:</label><p>{formData.amount}</p></div>
                                <div className="detail-block"><label>Customer Name:</label><p>{formData.customerName}</p></div>
                                <div className="detail-block"><label>Email Address:</label><p>{formData.emailAddress}</p></div>
                                <div className="detail-block"><label>Phone Number:</label><p>{formData.phoneNumber}</p></div>
                                <div className="detail-block"><label>Date:</label><p>{formatDate(formData.date)}</p></div>
                                <div className="detail-block"><label>Status:</label><p>{formData.status}</p></div>

                                {formData.status !== 'Confirmed' && formData.status !== 'Cancelled' && (
                                    <div className="detail-block detail-btn">
                                        <button onClick={confirmOrder} disabled={confirming}>
                                            {confirming ? 'Confirming...' : 'Confirm Order'}
                                        </button>
                                        <button onClick={cancelOrder} disabled={cancelling}>
                                            {cancelling ? 'Cancelling...' : 'Cancel Order'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transaction;
