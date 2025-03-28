import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import './CSS/Cart.css';

const Cart = () => {
    const [carts, setCart] = useState([]);

    const [totalSum, setTotalSum] = useState(null);
    const [totalQuantity, setTotalQuantity] = useState(null);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const token = localStorage.getItem('token');
    
    useEffect(() => {

        if (!token) {
			window.location.href = '/userlogin';
            return;
        }

        axios.get('http://localhost:3000/cartItem', {
            headers: {
                Authorization: token,
            },
        })
        .then((response) => {
            setCart(response.data.cartItems);
        })
        .catch((err) => {
            setMessages(err.response ? err.response.data.message : 'An error occurred');
        });
    }, []);
    
	const fetchCart = async () => {
		const response = await axios.get('http://localhost:3000/cartItem');
		setCart(response.data);
        getTotal(response.data)
        getQuantity(response.data)
	};

    const getTotal = (data) => {
        const sum = data.reduce((acc, item) => acc + item.Amount * item.Quantity, 0)
        setTotalSum(sum)
    }
    const getQuantity = (data) => {
        const sum = data.reduce((acc, item) => acc + item.Quantity, 0)
        setTotalQuantity(sum)
    }

    const handleCheckout = async () => {
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/checkout');
            setMessage(response.data.message || 'Checkout successfully');
            setTimeout(() => {
                setMessage('');
                fetchCart()
            }, 2000)
        } catch (error) {
            console.error('Error inserting data: ', error);
            setMessage('Error inserting data');
        } finally {
            setIsLoading(false)
        }
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

                        {isLoading && <div className="loading">
                            <div class="sending">Placing Order<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></div>
                        </div>}
                    </div>

                    {carts.length === 0 ? (
                        <div className="cart">
                            <h2>{messages}</h2>
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
                                            <button>Delete</button>
                                        </div>
                                    </div>

                                    <div className="info-block text">
                                        <div className="info">
                                            <p className="th">Size</p>
                                            <p className="td">{cart.Size}</p>
                                            <p></p>
                                        </div>

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

                <div className="order-now">
                    <button>Order Now</button>
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

                        <button type='button' onClick={handleCheckout}>Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart