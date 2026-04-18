export default function Button({ children, type = 'button', variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
