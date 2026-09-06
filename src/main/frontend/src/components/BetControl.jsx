export default function BetControl({ betAmount, onIncrease, disabled }) {
  return (
    <div className="flex flex-col gap-3">
      <div>下注金額</div>
      <div className="flex items-center">
        <div className="text-5xl">{betAmount}</div>
        <button
          type="button"
          onClick={onIncrease}
          disabled={disabled}
          className="px-3 text-3xl text-casino-gold disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  )
}
