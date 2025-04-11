import React, { useContext, useEffect } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                console.log("🔹 Verifying payment for order:", orderId); // Debug log

                if (!orderId) {
                    console.error("❌ Error: Missing orderId!");
                    return navigate("/");
                }

                const response = await axios.post(url + "/api/order/verify", { orderId });

                console.log("🔹 Payment Verification Response:", response.data); // Debug log

                if (response.data.success) {
                    console.log("✅ Payment verified successfully!");
                    navigate("/myorders");
                } else {
                    console.error("❌ Payment verification failed:", response.data.message);
                    navigate("/");
                }
            } catch (error) {
                console.error("❌ Error verifying payment:", error);
                navigate("/");
            }
        };

        if (success === "true" && orderId) {
            verifyPayment();
        } else {
            console.error("❌ Payment verification failed: Missing parameters.");
            navigate("/");
        }
    }, [success, orderId]); // ✅ Fix: Add dependencies to `useEffect`

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    );
};

export default Verify;
