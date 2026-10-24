import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { LinkButton } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';

export function NotFoundPage() {
  return (
    <PageLayout
      title="Page not found"
      description="This part of the map hasn't been charted yet. Try searching or return to the globe."
      breadcrumbs={[{ label: 'Globe', to: '/' }, { label: 'Not found' }]}
    >
      <EmptyState
        title="Lost on the map"
        message="The page you're looking for doesn't exist or may have moved."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <LinkButton to="/">Back to globe</LinkButton>
            <LinkButton to="/search" variant="secondary">
              Search
            </LinkButton>
          </div>
        }
      />
    </PageLayout>
  );
}
