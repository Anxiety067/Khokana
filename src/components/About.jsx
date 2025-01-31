import React from "react";
import { MapIcon, BarChart2 } from "lucide-react";

const About = () => {
  return (
    <div className="w-full">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">About Us</h1>

        <p className="text-gray-700 mb-12 text-justify">
          Community Empowerment and Social Justice Network (CEMSOJ) is an
          apolitical, informal and not for profit collective of human rights and
          grassroots development activists founded in 2015 and based in
          Lalitpur, Nepal. It works mainly for socio-economic empowerment and
          promotion of social justice and human rights of marginalized groups of
          Nepal, including indigenous peoples and minorities, rural communities
          and urban poor – with particular focus on women, youth and persons
          with disabilities and children of those groups, towards a just and
          peaceful society.
        </p>

        <div className="space-y-12">
          {/* Interactive Web Mapping Section */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <MapIcon size={48} color="#E37547" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">
                INTERACTIVE WEB MAPPING
              </h2>
              <p className="text-gray-700 text-justify">
                It provides all the interactive part related with Mapping of
                Guthi and other lands affected by Fast Track Expressway Project
                and other infrastructure projects, which is Categorized as
                Government, Guthi, Non-Newar, Joint Non-Newar, Newar, Joint
                Newar, Institutional, Communal and Unknown Ownership lands. It
                Also Provides the Extra Detail Related With The Land Status.
              </p>
            </div>
          </div>

          {/* Summary Statistics Section */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <BarChart2 size={48} color="#E37547" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">SUMMARY STATISTICS</h2>
              <p className="text-gray-700 text-justify">
                Mapping of Guthi and other lands affected by Fast Track
                Expressway Project Provides All The Statistics Related With The
                Land Numbering and Gives Out on a Summarized Version To Get The
                Best Detail From It. The Map Layers Helps To Visualize and
                Analyze The Different Layers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Partnership Section */}
      <div className="w-full bg-[#faf0e6] mt-16">
        <div className="max-w-4xl mx-auto py-12 px-6 text-center space-y-12">
          <div>
            <h2 className="text-xl font-medium mb-8">
              This mapping has been produced in the partnership of
            </h2>
            <div className="flex justify-center items-center gap-8">
              <img src="/cemsoj.jpg" alt="CEMSOJ logo" className="h-20" />
              <img src="/aipnee.jpg" alt="APINEE logo" className="h-20" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-8">In Collaboration with</h2>
            <div className="flex justify-center items-center gap-8">
              <img
                src="/savenepavalley.jpg"
                alt="savenepavalley logo"
                className="h-16"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-8">With Support From</h2>
            <div className="flex justify-center items-center gap-8">
              <img
                src="/Right+Resources.jpg"
                alt="Right+Resources logo"
                className="h-16"
              />
              <img
                src="/Manushya Foundation.jpg"
                alt="Manushya Foundation logo"
                className="h-16"
              />
              <img
                src="/Environmental Defenders Colaborative.jpg"
                alt="Environmental Defenders Collaborative logo"
                className="h-16"
              />
            </div>
          </div>

          <p className="text-gray-700 mt-12 text-center max-w-3xl mx-auto">
          If you have any comments on the mapping, you can send them to us at cemsoj@gmail.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
