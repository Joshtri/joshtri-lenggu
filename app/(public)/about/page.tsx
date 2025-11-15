import { Code2, BookOpen, Lightbulb, Coffee } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b-2 border-dashed border-gray-300 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="text-center">
            <h1 className="text-6xl sm:text-7xl font-bold mb-8 leading-none tracking-tight text-gray-900 dark:text-white">
              About
              <br />
              <span className="relative inline-block">
                This Blog
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gray-900 dark:bg-white"></div>
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
              Sharing knowledge, experiences, and insights
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* Introduction */}
          <div className="mb-16">
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
              Welcome to this corner of the internet where I share my thoughts, experiences, and learnings. 
              This blog is a personal space dedicated to documenting my journey through technology, 
              development, and creative exploration.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 hover:border-gray-900 dark:hover:border-gray-400 transition-colors">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-full">
                  <Code2 className="h-6 w-6 text-gray-900 dark:text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Development</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                Exploring modern web technologies, best practices, and sharing code solutions.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 hover:border-gray-900 dark:hover:border-gray-400 transition-colors">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-full">
                  <BookOpen className="h-6 w-6 text-gray-900 dark:text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Learning</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                Documenting the learning process and sharing tutorials to help others grow.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 hover:border-gray-900 dark:hover:border-gray-400 transition-colors">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-full">
                  <Lightbulb className="h-6 w-6 text-gray-900 dark:text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Ideas</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                Sharing thoughts, perspectives, and creative explorations.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 hover:border-gray-900 dark:hover:border-gray-400 transition-colors">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-full">
                  <Coffee className="h-6 w-6 text-gray-900 dark:text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Personal</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                Life experiences, reflections, and stories beyond code.
              </p>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg p-12 bg-gray-50 dark:bg-gray-900">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">What You&apos;ll Find Here</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed font-light">
              <p>
                This blog covers a variety of topics including web development, programming tutorials, 
                technology insights, and personal reflections. Each article is crafted with care to 
                provide value, whether you&apos;re looking for technical solutions or just some interesting reads.
              </p>
              <p>
                I believe in continuous learning and sharing knowledge with the community. If you find 
                something useful here, feel free to share it with others who might benefit from it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="border-t-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">
            Let&apos;s Connect
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 font-light">
            Have questions or want to collaborate? Feel free to reach out.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:your@email.com"
              className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors border-2 border-gray-900 dark:border-white"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
