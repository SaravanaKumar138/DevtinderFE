
import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import Loading from "./Loading";
import loadRazorpay from "../utils/loadRazorPay";

const Premium = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
 const user = useSelector((store) => store.user);
  const handlePayment = async (plan) => {
    try {
       const isLoaded = await loadRazorpay();

       if (!isLoaded) {
         throw new Error("Razorpay SDK failed to load");
       }
      const res = await axios.post(
        url + "/payment/create",
        { plan },
        { withCredentials: true }
      );

      const { amount, currency, notes, keyId, orderId } = res.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "DevTinder",
        description: "Connect to other Developers",
        order_id: orderId,
        prefill: {
          name: `${notes.firstName} ${notes.lastName}`,
          email: notes.emailId,
          contact: "9999999999",
        },
        theme: {
          color: "#6366F1",
        },
        handler: verifyPremiumUser,
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error", err);
    }
  };

  useEffect(() => {
  verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(url+"/payment/premium/verify", {withCredentials: true});
      console.log(res.data);
      const {isPremium} = res.data;
 if (isPremium) {
        setIsPremium(true);
      }
      dispatch(addUser({...user, isPremium}));
     setLoading(false);
    }
    catch(err) {
      console.error("Verification error", err);
    }
  }
  if (loading) return <Loading />;
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col items-center justify-center px-6">
      {/* Title */}
      {isPremium ? (
        <h1 className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          You are a Premium Member! 🚀
        </h1>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-white mb-12">
            Premium Membership
          </h1>

          {/* Cards */}
          <div className="flex flex-col lg:flex-row gap-10 w-full max-w-5xl">
            {/* Silver */}
            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl p-10 shadow-xl hover:shadow-indigo-500/30 transition">
              <h2 className="text-2xl font-semibold text-indigo-300 text-center mb-6">
                Silver Membership
              </h2>

              <ul className="text-gray-300 space-y-3 text-center mb-8">
                <li>✔ Verified Account Badge</li>
                <li>✔ Priority Feature Access</li>
                <li>✔ 3 Months Validity</li>
              </ul>

              <div className="text-center text-4xl font-bold text-indigo-400 mb-6">
                ₹99
              </div>

              <button
                onClick={() => handlePayment("silver")}
                className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition"
              >
                Buy Silver
              </button>
            </div>

            {/* OR */}
            <div className="hidden lg:flex items-center text-gray-400 font-semibold">
              OR
            </div>

            {/* Gold */}
            <div className="flex-1 bg-slate-900 border border-yellow-700/40 rounded-2xl p-10 shadow-xl hover:shadow-yellow-500/30 transition">
              <h2 className="text-2xl font-semibold text-yellow-300 text-center mb-6">
                Gold Membership
              </h2>

              <ul className="text-gray-300 space-y-3 text-center mb-8">
                <li>✔ Verified Account Badge</li>
                <li>✔ Priority Feature Access</li>
                <li>✔ 12 Months Validity</li>
              </ul>

              <div className="text-center text-4xl font-bold text-yellow-400 mb-6">
                ₹199
              </div>

              <button
                onClick={() => handlePayment("gold")}
                className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold transition"
              >
                Buy Gold
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Premium;

