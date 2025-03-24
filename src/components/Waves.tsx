const Waves = () => {
    return (
      <div className="w-full h-[150px] overflow-hidden pointer-events-none z-0">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-full transform rotate-180"
        >
          <path
            d="M0.00,92.27 C216.83,192.92 304.30,8.39 500.00,109.03 L500.00,0.00 L0.00,0.00 Z"
            className="animate-pulse"
            style={{ fill: "#06b6d4" }} // Manually setting the cyan color
          />
          <path
            d="M0.00,92.27 C150.00,152.45 271.49,-28.38 500.00,109.03 L500.00,0.00 L0.00,0.00 Z"
            className="animate-wave"
            style={{ fill: "#22d3ee" }} // Manually setting a lighter cyan color
          />
          <path
            d="M0.00,108.27 C200.00,152.45 371.49,-48.38 500.00,89.03 L500.00,0.00 L0.00,0.00 Z"
            className="animate-wave"
            style={{ fill: "#3b82f6" }} // Manually setting blue color
          />
        </svg>
      </div>
    );
  };
  
  export default Waves;
  