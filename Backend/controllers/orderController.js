import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Set Frontend URL
const FRONTEND_URL = "http://localhost:5174";

// 🛒 Place Order & Create Stripe Checkout Session
const placeOrder = async (req, res) => {
    try {
        // ✅ Create New Order
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            paymentStatus: false // ✅ Ensure payment starts as false
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // ✅ Create Stripe Line Items
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 // ✅ Fixed price calculation
            },
            quantity: item.quantity
        }));

        // ✅ Add Delivery Charges
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 200 * 100 // ✅ Fixed amount (200 INR)
            },
            quantity: 1
        });

        // ✅ Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: line_items,
            mode: 'payment',
            success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.status(200).json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("❌ Error in placeOrder:", error);
        res.status(500).json({ success: false, message: "Order Placement Failed" });
    }
};

// ✅ Verify Order Payment Status
const verifyOrder = async (req, res) => {
    try {
        const { orderId, success } = req.body;

        if (!orderId) {
            return res.status(400).json({ success: false, message: "Missing orderId" });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (success === "true") {
            order.paymentStatus = true;
            await order.save();
            res.status(200).json({ success: true, message: "Payment Successful" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.status(200).json({ success: false, message: "Payment Failed, Order Cancelled" });
        }

    } catch (error) {
        console.error("❌ Error in verifyOrder:", error);
        res.status(500).json({ success: false, message: "Payment Verification Failed" });
    }
};

// ✅ Get User Orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("❌ Error in userOrders:", error);
        res.status(500).json({ success: false, message: "Error Fetching Orders" });
    }
};

// ✅ List All Orders (For Admin)
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("❌ Error in listOrders:", error);
        res.status(500).json({ success: false, message: "Error Fetching Orders" });
    }
};

// ✅ Update Order Status (For Admin)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "Missing orderId or status" });
        }

        await orderModel.findByIdAndUpdate(orderId, { status });
        res.status(200).json({ success: true, message: "Order Status Updated" });

    } catch (error) {
        console.error("❌ Error in updateStatus:", error);
        res.status(500).json({ success: false, message: "Error Updating Status" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
