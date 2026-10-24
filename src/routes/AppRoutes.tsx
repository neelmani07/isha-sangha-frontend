import { Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { AdminLoginPage } from '../features/admin/pages/AdminLoginPage';
import { CenterPage } from '../features/center/pages/CenterPage';
import { CentersPage } from '../features/center/pages/CentersPage';
import { CityPage } from '../features/city/pages/CityPage';
import { DonatePage } from '../features/donate/pages/DonatePage';
import { ExplorePage } from '../features/explore/pages/ExplorePage';
import { FeedbackPage } from '../features/feedback/pages/FeedbackPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { SearchPage } from '../features/search/pages/SearchPage';
import { StoriesPage } from '../features/stories/pages/StoriesPage';
import { TeacherPage } from '../features/teacher/pages/TeacherPage';
import { TeachersPage } from '../features/teacher/pages/TeachersPage';
import { InitiativePage } from '../features/initiatives/pages/InitiativePage';
import { InitiativesPage } from '../features/initiatives/pages/InitiativesPage';
import { StoryPage } from '../features/stories/pages/StoryPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        {/* Explore */}
        <Route index element={<ExplorePage />} />
        <Route path="nearby" element={<Navigate to="/#nearby" replace />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="city/:slug" element={<CityPage />} />
        <Route path="teacher/:slug" element={<TeacherPage />} />
        <Route path="teachers" element={<TeachersPage />} />
        <Route path="center/:slug" element={<CenterPage />} />
        <Route path="centers" element={<CentersPage />} />

        {/* Community */}
        <Route path="stories" element={<StoriesPage />} />
        <Route path="stories/:slug" element={<StoryPage />} />
        <Route path="initiatives" element={<InitiativesPage />} />
        <Route path="initiatives/:slug" element={<InitiativePage />} />
        <Route path="volunteers" element={<Navigate to="/initiatives" replace />} />
        <Route path="donate" element={<DonatePage />} />

        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="admin" element={<AdminDashboardPage />} />
      <Route path="admin/login" element={<AdminLoginPage />} />
    </Routes>
  );
}
