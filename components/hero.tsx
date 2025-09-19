export default function Hero() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-600 text-white relative overflow-hidden">
      {/* Background video placeholder - will be replaced with actual video */}
      <div className="absolute inset-0 bg-black/20 z-10" />
      
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Recovery When You Need It
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
          Mobile cold plunge & infrared sauna delivered to your door. Weekly sessions for peak performance.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            Book Now
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors">
            Learn More
          </button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm opacity-80">
          <span>🔒 Secure Payments via Bolt</span>
          <span>📅 30-Day Flexibility</span>
          <span>⭐ 4.8/5 Rating</span>
        </div>
      </div>
    </div>
  );
}
