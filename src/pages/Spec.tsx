import SpecHero from '@/components/spec/SpecHero';
import ArchitectureFigure from '@/components/spec/ArchitectureFigure';
import RequirementsIndex from '@/components/spec/RequirementsIndex';
import RequirementTraceability from '@/components/spec/RequirementTraceability';
import StandardsRegister from '@/components/spec/StandardsRegister';
import ClosingCTA from '@/components/spec/ClosingCTA';

export default function Spec() {
  return (
    <div className="min-h-[100dvh] bg-page text-text-primary antialiased">
      <SpecHero />
      <div className="border-t border-stroke-default">
        <ArchitectureFigure />
      </div>
      <div className="border-t border-stroke-default">
        <RequirementsIndex />
      </div>
      <div className="border-t border-stroke-default">
        <RequirementTraceability />
      </div>
      <div className="border-t border-stroke-default">
        <StandardsRegister />
      </div>
      <ClosingCTA />
    </div>
  );
}
