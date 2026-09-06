export default function SpinButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded bg-red-600 px-6 py-2 text-[50px] leading-tight text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Spin
    </button>
  )
}
