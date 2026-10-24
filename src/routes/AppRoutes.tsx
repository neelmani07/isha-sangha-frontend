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
import { AdminReviewPage } from '../features/admin/pages/AdminReviewPage';
import { CenterSubmissionPage } from '../features/join/pages/CenterSubmissionPage';
import { JoinPage } from '../features/join/pages/JoinPage';
import { MeditatorProfilePage } from '../features/join/pages/MeditatorProfilePage';
import { MyAccountPage } from '../features/join/pages/MyAccountPage';
import { TeacherSubmissionPage } from '../features/join/pages/TeacherSubmissionPage';
import { InitiativeSubmissionPage } from '../features/join/pages/InitiativeSubmissionPage';
import { ResourcesPage } from '../features/resources/pages/ResourcesPage';
import { SuggestResourcePage } from '../features/resources/pages/SuggestResourcePage';

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
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="resources/suggest" element={<SuggestResourcePage />} />
        <Route path="resources/suggest/:id" element={<SuggestResourcePage />} />
        <Route path="donate" element={<DonatePage />} />

        {/* Joining the map */}
        <Route path="join" element={<JoinPage />} />
        <Route path="join/meditator" element={<MeditatorProfilePage />} />
        <Route path="join/teacher" element={<TeacherSubmissionPage />} />
        <Route path="join/teacher/:id" element={<TeacherSubmissionPage />} />
        <Route path="join/center" element={<CenterSubmissionPage />} />
        <Route path="join/center/:id" element={<CenterSubmissionPage />} />
        <Route path="join/initiative" element={<InitiativeSubmissionPage />} />
        <Route path="join/initiative/:id" element={<InitiativeSubmissionPage />} />
        <Route path="me" element={<MyAccountPage />} />

        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="admin" element={<AdminDashboardPage />} />
      <Route path="admin/login" element={<AdminLoginPage />} />
      <Route path="admin/review" element={<AdminReviewPage />} />
    </Routes>
  );
}
