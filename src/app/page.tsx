'use client';

import { JobListings } from '@/components/JobListings';
import { CandidateRegistration } from '@/components/CandidateRegistration';
import { useCandidateContext } from '@/context/CandidateContext';

export default function Home() {
  const { uuid, candidateId } = useCandidateContext();

  const handleSubmitApplication = async (jobId: string, repositoryUrl: string): Promise<void> => {
    if (!uuid || !candidateId) {
      throw new Error('No hay datos de candidato');
    }

    const response = await fetch('/api/submit-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uuid,
        jobId,
        candidateId,
        repoUrl: repositoryUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al enviar la postulación');
    }

    const data = await response.json();
    if (!data.ok) {
      throw new Error('La API respondió con error');
    }
  };

  // Si no hay candidato registrado, mostrar el formulario de registro
  if (!uuid || !candidateId) {
    return <CandidateRegistration />;
  }

  // Si ya está registrado, mostrar las ofertas
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Oportunidades de Empleo
          </h1>
          <p className="text-lg text-gray-600">
            Explora nuestras posiciones disponibles y postúlate con tu repositorio de GitHub
          </p>
        </div>
        <JobListings onSubmitApplication={handleSubmitApplication} />
      </div>
    </main>
  );
}