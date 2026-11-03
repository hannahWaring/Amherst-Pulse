import ComingSoonList from './ComingSoonList';

const aboutItems = [
  { label: 'About AmherstPulse' },
  { label: 'Version', value: 'v0.1.0' },
  { label: 'Terms of Service' },
  { label: 'Privacy Policy' },
  { label: 'Acknowledgments' },
];

export default function AboutTab() {
  return <ComingSoonList items={aboutItems} />;
}
