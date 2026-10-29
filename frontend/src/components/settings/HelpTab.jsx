import ComingSoonList from './ComingSoonList';

const helpItems = [
  { label: 'FAQ' },
  { label: 'Report a problem' },
  { label: 'Contact support' },
  { label: 'Send feedback' },
];

export default function HelpTab() {
  return <ComingSoonList items={helpItems} />;
}
