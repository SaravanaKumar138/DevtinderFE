const FeatureCard = ({ icon, title, desc }) => (
  <div
    className="
      bg-white/5
      border border-white/10
      rounded-xl
      p-6
      text-center
      transition-all
      duration-300
      transform
      hover:scale-110
      hover:border-indigo-400
      hover:shadow-xl
      hover:shadow-indigo-500/30
    "
  >
    <div className="text-indigo-400 text-2xl mb-4 flex justify-center">
      {icon}
    </div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);

export default FeatureCard;
