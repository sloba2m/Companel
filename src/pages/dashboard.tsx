import { Helmet } from 'react-helmet-async';

import { ProgressBar } from 'src/components/progress-bar';

import { BlankView } from 'src/sections/blank/view';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BlankView title="Page ones" />
      <ProgressBar />
    </>
  );
}
