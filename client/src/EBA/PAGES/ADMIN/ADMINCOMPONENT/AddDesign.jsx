import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

const AddDesign = () => {
    return (
        <div className='admin-content'>
            <h1>Design</h1>

            <div className="design main-content">
                <div className="sidebar">
                    <div className="btn">
                        <button>
                            <img src="logo.png" alt="" />
                            <p>button</p>
                        </button>
                        <button>
                            <img src="logo.png" alt="" />
                            <p>button</p>
                        </button>
                        <button>
                            <img src="logo.png" alt="" />
                            <p>button</p>
                        </button>
                        <button>
                            <img src="logo.png" alt="" />
                            <p>button</p>
                        </button>
                        <button>
                            <img src="logo.png" alt="" />
                            <p>button</p>
                        </button>
                    </div>

                    <div className="btn">
                        <button>
                            <img src="logo.png" alt="" />
                            <p>button</p>
                        </button>
                        <button>
                            <img src="logo.png" alt="" />
                            <p>button</p>
                        </button>
                    </div>
                </div>

                <div className="technical-sketch panel">
                    <div className="top-container">
                        <div className="top">
                            <h3>TECHNICAL SKETCH</h3>

                            <FontAwesomeIcon icon={faEllipsisVertical} className='icon' />
                        </div>

                        <div className="btns">
                            <button>BOTH</button>
                            <button>FRONT</button>
                            <button>BACK</button>
                        </div>
                    </div>

                    <div className="img-block">
                        <img src="clothes/MaleUniform.png" alt="" />
                    </div>
                </div>

                <div className="flat-pattern panel">
                    <div className="top-container">
                        <div className="top">
                            <h3>FLAT PATTERN</h3>

                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </div>
                    </div>

                    <div className="img-block">
                        <img src="clothes/MaleUniform.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddDesign