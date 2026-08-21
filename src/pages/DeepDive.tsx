import DeepDiveDivider from '@/components/home/DeepDiveDivider';
import SectionIdentifiers from '@/components/home/SectionIdentifiers';
import SectionPackets from '@/components/home/SectionPackets';
import SectionAlerts from '@/components/home/SectionAlerts';
import SectionHardLogic from '@/components/home/SectionHardLogic';
import SectionSecurity from '@/components/home/SectionSecurity';
import SectionScope from '@/components/home/SectionScope';

export default function DeepDive() {
  return (
    <>
      <DeepDiveDivider />
      <SectionIdentifiers />
      <SectionPackets />
      <SectionAlerts />
      <SectionHardLogic />
      <SectionSecurity />
      <SectionScope />
    </>
  );
}
