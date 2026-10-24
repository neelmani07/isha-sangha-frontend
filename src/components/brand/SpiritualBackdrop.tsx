/**
 * Very subtle backdrop — abstract ashram hills silhouette.
 * Optional: add a licensed photo at public/images/ashram-watermark.jpg (e.g. ashram landscape).
 */
export function SpiritualBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <img
        src="/images/ashram-watermark.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-[0.045]"
        onError={(event) => {
          event.currentTarget.remove();
        }}
      />
      <img
        src="/images/ashram-backdrop.svg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-[0.08] mix-blend-multiply"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cream/80 via-cream/90 to-sand/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,rgba(184,134,43,0.10),transparent_58%)]" />
    </div>
  );
}
