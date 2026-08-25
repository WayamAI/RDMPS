import { Navigate, Routes, Route } from 'react-router';
import { DiagramProvider } from '@/lib/diagram-context';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import DeepDive from '@/pages/DeepDive';
import FieldAssets from '@/pages/FieldAssets';
import DeliveryPlan from '@/pages/DeliveryPlan';
import Spec from '@/pages/Spec';

export default function App() {
  return (
    <DiagramProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="deep-dive" element={<DeepDive />} />
          <Route path="field-assets" element={<FieldAssets />} />
          <Route path="delivery-plan" element={<DeliveryPlan />} />
          <Route path="/poc-roadmap" element={<Navigate to="/delivery-plan" replace />} />
          <Route path="spec" element={<Spec />} />
        </Route>
      </Routes>
    </DiagramProvider>
  );
}
