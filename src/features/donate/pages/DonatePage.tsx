import { HandCoins, HeartHandshake, Lock, ScrollText, Sprout } from 'lucide-react';
import { useState } from 'react';
import { Ornament } from '../../../components/brand/Ornament';
import { BackdropPhoto } from '../../../components/ui/BackdropPhoto';
import { sitePhotos } from '../../../content/sitePhotos';
import { SampleNotice } from '../../../components/ui/SampleNotice';
import { TwoToneHeading } from '../../../components/ui/TwoToneHeading';
import { useSiteConfig } from '../../site/useSiteConfig';

const presetAmounts = [500, 1000, 2500, 5000];

const causes = [
  { value: 'general', label: 'Where it is needed most' },
  { value: 'initiatives', label: 'Community initiatives' },
  { value: 'platform', label: 'Keeping this platform running' },
];

// Illustrative figures for the preview.
const impact = [
  { value: '₹4.2L', label: 'raised this year' },
  { value: '27', label: 'initiatives supported' },
  { value: '1,900+', label: 'donors' },
];

const uses = [
  { icon: Sprout, share: '60%', title: 'Community initiatives', text: 'Small grants for saplings, tuition, meals and yoga sessions run by volunteers.' },
  { icon: HeartHandshake, share: '25%', title: 'Seva support', text: 'Materials, travel and food for volunteers during large community events.' },
  { icon: ScrollText, share: '15%', title: 'Running the platform', text: 'Hosting, maps, email and moderation tools that keep this site free for everyone.' },
];

const faqs = [
  {
    q: 'Will I get a receipt?',
    a: 'Yes. A receipt is emailed to you as soon as your donation is confirmed, and you can download all your receipts at the end of the financial year.',
  },
  {
    q: 'Is my donation tax-deductible?',
    a: 'Once our organisation has its 80G registration, donations from Indian taxpayers will qualify for a deduction under Section 80G. The registration details will be shown on this page.',
  },
  {
    q: 'Can I donate from outside India?',
    a: 'Foreign contributions need FCRA registration. Until we have it, we can only accept donations from Indian citizens using Indian payment methods.',
  },
  {
    q: 'Can I stop a monthly donation?',
    a: 'Yes, at any time, from the link in your receipt email or by writing to us. No questions asked.',
  },
];

export function DonatePage() {
  const site = useSiteConfig();
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [cause, setCause] = useState(causes[0].value);
  const [notice, setNotice] = useState(false);

  const effectiveAmount = customAmount ? Number(customAmount) : amount;
  const org = site.organization;
  const orgDetails = [
    { label: 'Organisation', value: org.legalName },
    { label: 'Registration no.', value: org.registrationNumber },
    { label: 'Tax exemption', value: org.taxExemption },
    { label: 'Address', value: org.address },
  ].filter((item) => item.value);

  return (
    <main className="font-body text-ink">
      <section className="relative isolate overflow-hidden bg-maroon-texture pt-[var(--header-h)] text-cream clip-slant-bottom">
        <BackdropPhoto photo={sitePhotos.adiyogiWide} variant="fade-left" position="center 35%" className="-z-10 opacity-30 mix-blend-luminosity" />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-28 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1fr_420px] lg:px-8">
          <div className="lg:pt-8">
            <TwoToneHeading
              as="h1"
              size="lg"
              tone="light"
              eyebrow="Donate"
              title="Your contribution"
              subtitle="can change someone's life"
            />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/80">
              {site.name} is run entirely by volunteers. Your support turns small local ideas into lasting seva, and keeps
              this space free for everyone who comes looking.
            </p>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {impact.map((item) => (
                <div key={item.label}>
                  <dt className="sr-only">{item.label}</dt>
                  <dd className="font-display text-3xl text-gold-light sm:text-4xl">{item.value}</dd>
                  <dd className="mt-1 text-sm text-cream/70">{item.label}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 [&>p]:border-cream/20 [&>p]:bg-cream/10 [&>p]:text-cream/80">
              <SampleNotice>Figures are illustrative</SampleNotice>
            </div>
          </div>

          <form
            className="rounded-xl bg-cream p-6 text-ink shadow-panel sm:p-7"
            onSubmit={(event) => {
              event.preventDefault();
              setNotice(true);
            }}
          >
            <div className="grid grid-cols-2 rounded-md bg-sand p-1 text-sm font-semibold" role="radiogroup" aria-label="Donation frequency">
              {(['once', 'monthly'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={frequency === value}
                  onClick={() => setFrequency(value)}
                  className={`rounded px-3 py-2 transition ${frequency === value ? 'bg-white text-ink shadow-card' : 'text-muted hover:text-ink'}`}
                >
                  {value === 'once' ? 'One time' : 'Monthly'}
                </button>
              ))}
            </div>

            <p className="mt-6 text-sm font-semibold">Choose an amount</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {presetAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setAmount(value);
                    setCustomAmount('');
                  }}
                  className={`rounded-md border px-3 py-3 font-display text-lg transition ${
                    !customAmount && amount === value
                      ? 'border-saffron bg-saffron-light text-saffron-dark ring-1 ring-saffron/30'
                      : 'border-border bg-white hover:border-saffron/40'
                  }`}
                >
                  ₹{value.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
            <label className="mt-3 flex items-center gap-2 rounded-md border border-border bg-white px-4 focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/20">
              <span className="font-display text-lg text-muted">₹</span>
              <input
                inputMode="numeric"
                value={customAmount}
                onChange={(event) => setCustomAmount(event.target.value.replace(/\D/g, '').slice(0, 7))}
                placeholder="Other amount"
                aria-label="Other amount in rupees"
                className="w-full bg-transparent py-3 outline-none placeholder:text-muted"
              />
            </label>

            <label className="mt-5 grid gap-2 text-sm font-semibold">
              Support
              <select
                value={cause}
                onChange={(event) => setCause(event.target.value)}
                className="w-full rounded-md border border-border bg-white px-4 py-3 font-normal outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20"
              >
                {causes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              disabled={!effectiveAmount || effectiveAmount < 1}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-saffron px-5 py-4 text-base font-semibold text-cream shadow-card transition hover:bg-saffron-dark disabled:opacity-50"
            >
              <HandCoins size={18} />
              Donate ₹{(effectiveAmount || 0).toLocaleString('en-IN')}
              {frequency === 'monthly' ? ' / month' : ''}
            </button>
            {notice ? (
              <p role="status" className="mt-3 text-center text-sm text-muted">
                Online donations open once our payment gateway is live. Thank you for wanting to help.
              </p>
            ) : (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
                <Lock size={12} /> UPI, cards and net banking · secure checkout
              </p>
            )}
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <TwoToneHeading align="center" title="Where your gift goes" subtitle="every rupee, accounted for" />
        <Ornament className="mx-auto mt-6" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {uses.map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <item.icon className="text-gold" size={26} />
                <span className="font-display text-3xl text-saffron">{item.share}</span>
              </div>
              <p className="mt-4 font-display text-xl">{item.title}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-display text-3xl">Who receives your donation</h2>
            <div className="mt-6 rounded-lg border border-border bg-white p-6 text-[15px] shadow-card">
              {orgDetails.length > 0 ? (
                <dl className="grid gap-3 sm:grid-cols-[150px_1fr]">
                  {orgDetails.map((item) => (
                    <div key={item.label} className="contents">
                      <dt className="text-muted">{item.label}</dt>
                      <dd className="font-semibold">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-muted">Organisation and registration details will be published here before donations open.</p>
              )}
              <p className="mt-5 border-t border-border pt-4 text-sm leading-6 text-muted">{site.disclaimer}</p>
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl">Questions</h2>
            <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-white shadow-card">
              {faqs.map((faq) => (
                <details key={faq.q} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {faq.q}
                    <span className="text-xl text-gold transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
