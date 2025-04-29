import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import './CSS/Cart.css';

const Cart = () => {
    const [carts, setCart] = useState([]);

    const [totalSum, setTotalSum] = useState(null);
    const [totalQuantity, setTotalQuantity] = useState(null);
    
    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const token = localStorage.getItem('token');
    
    useEffect(() => {

        if (!token) {
			window.location.href = '/userlogin';
            return;
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
		setUserId(decodedToken.id); 

        fetchCart();
    }, []);

    const fetchCart = () => {
        axios.get('http://localhost:3000/cartItem', {
            headers: {
                Authorization: token,
            },
        })
        .then((response) => {
            setCart(response.data.cartItems);
            getTotal(response.data.cartItems)
            getQuantity(response.data.cartItems)
        })
        .catch((err) => {
            alert(err.response ? err.response.data.message : 'An error occurred');
			window.location.href = '/userlogin';
        });
    }

    const getTotal = (data) => {
        const sum = data.reduce((acc, item) => acc + item.Amount * item.Quantity, 0)
        setTotalSum(sum)
    }
    const getQuantity = (data) => {
        const sum = data.reduce((acc, item) => acc + item.Quantity, 0)
        setTotalQuantity(sum)
    }

    const handleCheckout = async () => {
        if (!userId) {
            setMessage('User not found. Please log in.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/checkout', {
                userId
            });

            if (response.data.Status === "Success") {
                setMessage('Checkout successful!');
                fetchCart();
                
                setTimeout(() => {
                    setMessage('');
                }, 2000);
            } else {
                setMessage('Checkout failed. Please try again.');
            }
        } catch (error) {
            setMessage('Your cart is empty');
            
            setTimeout(() => {
                setMessage('');
            }, 2000);
        } finally {
            setIsLoading(false);
        }
    };
    
    
    const handleRemove = async (id) => {
        await axios.delete(`http://localhost:3000/cart/${id}`);
        setCart(carts.filter(cart => cart.ID !== id));
        
        setMessage("Cart item deleted successfully");
        setTimeout(() => {
            setMessage('');
        }, 2000);
        
        fetchCart();
    };
    
    return (
        <div className='ebacart'>
            <div className="mycart">
                <div className="cart-block">
                    <div className="top">
                        <a href='/ebastore' className="back">
                            <FontAwesomeIcon icon={faChevronLeft} />
                            <span>Back</span>
                        </a>

                        <h1>My Cart</h1>
                    </div>

                    {carts.length === 0 ? (
                        <div className="cart">
                            <h2>Your cart is empty</h2>
                        </div>
                    ) : (
                        <>
                            {carts.map((cart, index) => (
                                <div className="item" key={index}>
                                    <div className="info-blocks">
                                        <img src={`http://localhost:3000/${cart.Image}`} alt="" />

                                        <div className="info">
                                            <p className='th'>{cart.Item_Name}</p>
                                            <p className="td tds">{cart.Variant}</p>
                                            <button onClick={() => handleRemove(cart.ID)}>Delete</button>
                                        </div>
                                    </div>

                                    <div className="info-block text">
                                        {cart.Item_Name !== 'Modules' && cart.Item_Name !== 'Capstone Manual' && (
                                            <div className="info">
                                                <p className="th">Size</p>
                                                <p className="td">{cart.Size}</p>
                                                <p></p>
                                            </div>
                                        )}

                                        <div className="info">
                                            <p className="th">Quantity</p>
                                            <p className="td">{cart.Quantity}</p>
                                            <p></p>
                                        </div>

                                        <div className="info">
                                            <p className="th">Price</p>
                                            <p className="td">P{cart.Amount * cart.Quantity}</p>
                                            <p></p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {message && <div className='message'>{message}</div>}
                </div>
            </div>

            <div className="summary">
                <div className="order-summary">
                    <div className="group">
                        <h1>Order Summary</h1>

                        <div className="total">
                            <p>Total Item:</p>
                            <span>{totalQuantity}</span>
                        </div>

                        <div className="payment-method">
                            <p>Payment Method:</p>
                            <span>Pay on Campus EBA</span>
                        </div>
                    </div>

                    <div className="total-block">
                        <div className="total">
                            <p>Total: </p>
                            <span>P{totalSum}</span>
                        </div>

                        <button type='button' onClick={handleCheckout}>
                            {isLoading ? (
                                <div className="loading">
                                    <div class="sending">Placing Order<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></div>
                                </div>
                            ) : (
                                <span>Checkout</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart