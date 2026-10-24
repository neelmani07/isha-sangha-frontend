import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { LinkButton } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { nav, pages } from '../content/copy';

export function NotFoundPage() {
  return (
    <PageLayout
      title={pages.notFound.title}
      description={pages.notFound.description}
      breadcrumbs={[{ label: nav.explore, to: '/' }, { label: 'Not found' }]}
    >
      <EmptyState
        title="Lost on the map"
        message={pages.notFound.message}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <LinkButton to="/">Back to Explore</LinkButton>
            <LinkButton to="/search" variant="secondary">
              Search
            </LinkButton>
          </div>
        }
      />
    </PageLayout>
  );
}
