'use client';

import { useEffect, useState } from 'react';
import JobPositionCard from './JobPositionCard';

interface Job {
  id: string;
  title: string;
}

interface JobListingsProps {
  onSubmitApplication: (jobId: string, repositoryUrl: string) => Promise<void>;
}

export function JobListings({ onSubmitApplication }: JobListingsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/jobs/get-list');

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Formato de respuesta inválido: se esperaba un array');
        }

        setJobs(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        console.error('[JobListings] Error fetching jobs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando posiciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-destructive mb-2">Error al cargar las posiciones</h3>
        <p className="text-destructive/80 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-destructive text-white rounded hover:bg-destructive/90 transition"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No hay posiciones disponibles en este momento</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobPositionCard
          key={job.id}
          id={job.id}
          title={job.title}
          onSubmit={onSubmitApplication}
        />
      ))}
    </div>
  );
}