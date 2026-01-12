// import React, { useEffect, useState } from "react";
// import { url } from "../utils/constants";
// import axios from "axios";

// const Premium = () => {
//   const [isPremiumUser, setIsPremiumUser] = useState(false);

//   const loadRazorpay = () => {
//   return new Promise((resolve, reject) => {
//     // If already loaded, resolve immediately
//     if (window.Razorpay) {
//       resolve(true);
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;

//     script.onload = () => resolve(true);
//     script.onerror = () => reject(new Error("Razorpay SDK failed to load"));

//     document.body.appendChild(script);
//   })};

//   const handleClick = async (plan) => {
//     try {
//        await loadRazorpay();
//       const order = await axios.post(
//         url + "/payment/create",
//         { plan },
//         { withCredentials: true }
//       );
//       const {amount, currency, notes, keyId, orderId} = order.data;
//       const options = {
//         key: keyId, // Replace with your Razorpay key_id
//         amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
//         currency,
//         name: "DevTinder",
//         description: "Connect to other Developers",
//         order_id: orderId, // This is the order_id created in the backend// Your success URL
//         prefill: {
//           name: notes.firstName+ " "+notes.lastName,
//           email: notes.emailId,
//           contact: "9999999999",
//         },
//         theme: {
//           color: "#F37254",
//         },
//         handler: verifyPremiumUser,
//       };
//       const rzp = new window.Razorpay(options);
//       rzp.open();
     
//     } catch (error) {
//       console.error("Error initiating payment:", error);
//     }
//   };

//   const verifyPremiumUser = async () => {
//   try {
//     const res = await axios.get(url+"/payment/premium/verify", {withCredentials: true});
//     if (res.data.isPremium) {
//       setIsPremiumUser(true);
//     }
//   }
//   catch(err) {

//   }
//   }
//     useEffect(() => {
//       verifyPremiumUser();
//     }, []);
//   return !isPremiumUser ? (
//     <div className="w-full min-h-screen flex items-center justify-center px-6">
//       <div className="flex flex-col lg:flex-row items-center gap-10 w-full max-w-6xl">
//         {/* Silver */}
//         <div className="w-full bg-[#0f172a] border border-blue-900/40 hover:border-blue-400 rounded-2xl p-10 shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300">
//           <h2 className="text-3xl font-semibold text-blue-300 text-center mb-5">
//             Silver Membership
//           </h2>

//           <ul className="text-gray-300 space-y-3 text-center mb-8">
//             <li className="hover:text-blue-300 transition">
//               Verified Account Badge
//             </li>
//             <li className="hover:text-blue-300 transition">
//               Priority Feature Access
//             </li>
//           </ul>

//           <div className="text-center text-blue-400 text-4xl font-bold mb-6">
//             ₹99 <span className="text-lg text-blue-300">/month</span>
//           </div>

//           <button
//             className="w-full py-3 rounded-xl btn btn-primary text-white font-semibold transition"
//             onClick={() => handleClick("silver")}
//           >
//             Choose Silver
//           </button>
//         </div>

//         <div className="text-gray-400 text-lg font-semibold">OR</div>

//         {/* Gold */}
//         <div className="w-full bg-[#0f172a] border border-blue-900/40 hover:border-blue-400 rounded-2xl p-10 shadow-lg hover:shadow-blue-400/40 hover:-translate-y-1 transition-all duration-300">
//           <h2 className="text-3xl font-semibold text-blue-200 text-center mb-5">
//             Gold Membership
//           </h2>

//           <ul className="text-gray-300 space-y-3 text-center mb-8">
//             <li className="hover:text-blue-200 transition">
//               Verified Account Badge
//             </li>
           
//             <li className="hover:text-blue-200 transition">
//               Priority Feature Access
//             </li>
//           </ul>

//           <div className="text-center text-blue-300 text-4xl font-bold mb-6">
//             ₹199 <span className="text-lg text-blue-200">/month</span>
//           </div>

//           <button
//             className="w-full py-3 rounded-xl btn btn-secondary text-slate-900 font-semibold transition"
//             onClick={() => handleClick("gold")}
//           >
//             Choose Gold
//           </button>
//         </div>
//       </div>
//     </div>
//   ) : (
//     "You are a Premium User Now!"
//   );
// };

// export default Premium;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const Premium = () => {
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const handlePayment = async (plan) => {
    try {
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
        setIsPremiumUser(true);
      }
      dispatch(addUser({...user, isPremiumUser: isPremium}) );
    }
    catch(err) {
      console.error("Verification error", err);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col items-center justify-center px-6">
      {/* Title */}
      {isPremiumUser ? (
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

