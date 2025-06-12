const ThinkingDot = () => {
  return (
    <svg
      width="100"
      height="30"
      viewBox="0 0 100 30"
      xmlns="http://www.w3.org/2000/svg"
      className="text-violet-500"
    >
      <circle cx="10" cy="15" r="0" fill="currentColor">
        <animate
          attributeName="r"
          values="0;3;0"
          dur="2.2s"
          repeatCount="indefinite"
          begin="0s"
        />
      </circle>
      <circle cx="20" cy="15" r="0" fill="currentColor">
        <animate
          attributeName="r"
          values="0;4;0"
          dur="2.2s"
          repeatCount="indefinite"
          begin="0.3s"
        />
      </circle>
      <circle cx="30" cy="15" r="0" fill="currentColor">
        <animate
          attributeName="r"
          values="0;3;0"
          dur="2.2s"
          repeatCount="indefinite"
          begin="0.6s"
        />
      </circle>
    </svg>
  );
};
export default ThinkingDot;
