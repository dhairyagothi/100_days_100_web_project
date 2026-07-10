export default function BackButton({ label = "Back" }) {
  return (
    <button
      onClick={() => (window.location.href = "/")}
      className="flex items-center gap-1.5 text-[#64748B] hover:text-white transition-colors group"
      aria-label={label}
    >
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
      >
        <path
          fillRule="evenodd"
          d="M14 8a.75.75 0 0 1-.75.75H4.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 1.06L4.56 7.25h8.69A.75.75 0 0 1 14 8Z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-xs font-medium hidden sm:block">{label}</span>
    </button>
  );
}
