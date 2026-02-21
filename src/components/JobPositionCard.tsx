'use client';

import { useState } from 'react';
import { useCandidateContext } from '@/context/CandidateContext';

interface JobPositionCardProps {
  title: string;
  id: string;
  onSubmit: (jobId: string, gitHubUrl: string) => Promise<void>;
}

export default function JobPositionCard({ title, id, onSubmit }: JobPositionCardProps) {
  const [gitHubUrl, setGitHubUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { uuid, candidateId } = useCandidateContext();

  const isValidUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('github.com');
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!uuid || !candidateId) {
      setError('Debes registrarte primero');
      return;
    }

    if (!gitHubUrl.trim()) {
      setError('Por favor ingresa una URL');
      return;
    }

    if (!isValidUrl(gitHubUrl)) {
      setError('Ingresa una URL válida de GitHub');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(id, gitHubUrl);
      setSuccess(true);
      setGitHubUrl('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar la postulación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={`url-${id}`} className="block text-sm font-medium text-gray-700 mb-2">
            URL de tu repositorio de GitHub
          </label>
          <input
            id={`url-${id}`}
            type="url"
            placeholder="https://github.com/usuario/repositorio"
            value={gitHubUrl}
            onChange={(e) => setGitHubUrl(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            ¡Postulación enviada exitosamente!
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !gitHubUrl.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          {isLoading ? 'Enviando...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}