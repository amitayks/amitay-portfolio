import { EDUCATION, EXPERIENCE } from "../utils/constants";
import TimelineSection from "./TimelineSection";

function ExperienceSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <TimelineSection
            title="Education"
            icon="graduation"
            items={EDUCATION}
            type="education"
          />
          <TimelineSection
            title="Experience"
            icon="briefcase"
            items={EXPERIENCE}
            type="experience"
          />
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
