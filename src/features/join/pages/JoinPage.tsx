import { ArrowRight, Building2, GraduationCap, Lightbulb, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { symbols } from '../../../components/maps/mapSymbols';
import { useAuth } from '../../auth/context/AuthContext';
import { JoinLayout } from '../components/JoinLayout';

const paths = [
  {
    to: '/join/meditator',
    icon: Sparkles,
    color: symbols.MEDITATOR.color,
    title: 'I meditate',
    text: 'Add yourself to the map so meditators nearby know they are not alone. Goes live right away.',
    note: 'Shown at an approximate spot in your city, with your first name and initial.',
  },
  {
    to: '/join/teacher',
    icon: GraduationCap,
    color: symbols.TEACHER.color,
    title: 'I teach',
    text: 'List yourself as an Isha Hatha Yoga or programme teacher so people can find your classes.',
    note: 'Needs a certificate or other proof. Reviewed before it appears.',
  },
  {
    to: '/join/center',
    icon: Building2,
    color: symbols.CITY_CENTER.color,
    title: 'I run a centre, temple or shop',
    text: 'Add an Isha centre, a Devi temple or an Isha shop with its address, hours and contacts.',
    note: 'Needs proof such as a letter from Isha. Reviewed before it appears.',
  },
  {
    to: '/join/initiative',
    icon: Lightbulb,
    color: '#0b4a63',
    title: 'I started an initiative',
    text: 'Seva, a class or a venture: tell people what you are building and how they can help.',
    note: 'Reviewed before it appears. Supporters reach you directly.',
  },
];

export function JoinPage() {
  const { user } = useAuth();

  return (
    <JoinLayout
      title="Join the map"
      subtitle="so others can find you"
      back={null}
      requireSignIn={false}
      intro="Choose what describes you. You'll need to sign in, and you can change or remove your entry at any time."
    >
      <div className="grid gap-4">
        {paths.map((path) => (
          <Link
            key={path.to}
            to={path.to}
            className="group flex items-start gap-4 rounded-xl border border-border bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-saffron/30 hover:shadow-card-hover sm:p-6"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg text-cream" style={{ background: path.color }}>
              <path.icon size={22} />
            </span>
            <span className="flex-1">
              <span className="block font-display text-2xl group-hover:text-saffron-dark">{path.title}</span>
              <span className="mt-1 block text-[15px] leading-relaxed text-muted">{path.text}</span>
              <span className="mt-2 block text-xs font-semibold text-gold">{path.note}</span>
            </span>
            <ArrowRight className="mt-3 shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-saffron" size={20} />
          </Link>
        ))}
      </div>
      {user && (
        <p className="mt-6 text-sm text-muted">
          Already added something?{' '}
          <Link to="/me" className="font-semibold text-saffron-dark hover:text-saffron">
            See your profile and listings
          </Link>
          .
        </p>
      )}
    </JoinLayout>
  );
}
