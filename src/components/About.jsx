import React from "react";
import { MapIcon, BarChart2, Database } from "lucide-react";

const About = () => {
  return (
    <div className="w-full">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">About Us</h1>
        
        <p className="text-gray-700 mb-12 text-justify">
          Community Empowerment and Social Justice Network (CEMSOJ) is an
          apolitical, informal and not for profit collective of human rights and
          grassroots development activists founded in 2015 and based in Lalitpur,
          Nepal. It works mainly for socio-economic empowerment and promotion of
          social justice and human rights of marginalized groups of Nepal,
          including indigenous peoples and minorities, rural communities and urban
          poor – with particular focus on women, youth and persons with
          disabilities and children of those groups, towards a just and peaceful
          society.
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
                It provides all the interactive part related with mapping of
                Indigenous Newa Guthi/communal and other lands in the context of
                Fast Track Expressway and other infrastructure projects, which is
                Categorized as Newar, Non-Newar and Goverment lands. It Also Provides
                the Extra Detail Related With The Land Status.
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
                The Guthi Land Mapping Provides All The Statistics Related With The
                Land Numbering and Gives Out on a Summarized Version To Get
                The Best Detail From It. The Vector Layers Helps To Visualize and Analyze The Different Layers.
              </p>
            </div>
          </div>

          {/* Datasets Section */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <Database size={48} color="#E37547" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">
                DATASETS AND TABULAR VIEW
              </h2>
              <p className="text-gray-700 text-justify">
                Every Land and it's Ownership Detail has Been Provided in Datasets Format with
                Different Categories and Also in Tabular Form Which Makes it Easy
                for the User to Download and Use it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Partnership Section */}
      <div className="w-full bg-[#faf0e6] mt-16">
        <div className="max-w-4xl mx-auto py-12 px-6 text-center space-y-12">
          <div>
            <h2 className="text-xl font-medium mb-8">This mapping has been produced in the partnership of</h2>
            <div className="flex justify-center items-center gap-8">
              <img src="/cemsoj.jpg" alt="CEMSOJ logo" className="h-20" />
              <img src="" alt="APINEE logo" className="h-20" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-8">With Support From</h2>
            <div className="flex justify-center items-center gap-8">
              <img src="/api/placeholder/150/80" alt="Right Energy Partnership logo" className="h-16" />
              <img src="/api/placeholder/150/80" alt="The SETO Foundation logo" className="h-16" />
              <img src="/api/placeholder/150/80" alt="Environmental Defenders Collaborative logo" className="h-16" />
            </div>
          </div>

          <p className="text-gray-700 mt-12 text-center max-w-3xl mx-auto">
            This map is based on information from working with the communities or that available online. If 
            you have any comments, you can send to us at cemsoj@gmail.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;