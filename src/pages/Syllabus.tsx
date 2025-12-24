import { Layout } from '@/components/layout/Layout';
import { BookOpen, FileText } from 'lucide-react';

export default function Syllabus() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Syllabus & Study Plan</h1>
            <p className="text-muted-foreground">
              Download official syllabus and study materials
            </p>
          </div>

          {/* PDF Section ONLY */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Available PDFs
            </h2>

            <ul className="space-y-4">
              <li>
                <a
                  href="computer operator.pdf"
                  target="_blank"
                  className="flex items-center gap-3 text-primary hover:underline"
                >
                  <FileText className="w-5 h-5" />
                  Computer Operator
                </a>
              </li>

              <li>
                <a
                  href="computer technician.pdf"
                  target="_blank"
                  className="flex items-center gap-3 text-primary hover:underline"
                >
                  <FileText className="w-5 h-5" />
                  Computer Technician
                </a>
              </li>

              <li>
                <a
                  href="sansad.pdf"
                  target="_blank"
                  className="flex items-center gap-3 text-primary hover:underline"
                >
                  <FileText className="w-5 h-5" />
                  Sansad
                </a>
              </li>

              <li>
                <a
                  href="मानव अधिकार_Syllabus.pdf"
                  target="_blank"
                  className="flex items-center gap-3 text-primary hover:underline"
                >
                  <FileText className="w-5 h-5" />
                  मानव अधिकार (Syllabus)
                </a>
              </li>

              <li>
                <a
                  href="वरिष्ठ सहायक(कम्प्यूटरआइ_1.टी).pdf"
                  target="_blank"
                  className="flex items-center gap-3 text-primary hover:underline"
                >
                  <FileText className="w-5 h-5" />
                  वरिष्ठ सहायक (कम्प्युटराइ IT)
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </Layout>
  );
}
