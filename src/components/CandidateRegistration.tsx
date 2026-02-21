'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCandidateContext } from '@/context/CandidateContext';

export function CandidateRegistration() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCandidateInfo } = useCandidateContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !name.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Obtener datos del candidato desde la API
      const response = await fetch(`/api/candidate/get-by-email?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener datos del candidato');
      }

      const candidateData = await response.json();
      
      // 2. Guardar en el contexto (uuid y candidateId son los que vienen de la API)
      setCandidateInfo(
        candidateData.uuid,
        candidateData.candidateId,
        candidateData.firstName,
        candidateData.lastName,
        candidateData.email
      );

      // 3. (Opcional) Podrías redirigir al listado de trabajos automáticamente
      // o simplemente dejar que el componente padre muestre la lista
      console.log('Candidato registrado:', candidateData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-foreground mb-2">Bienvenido</h1>
          <p className="text-muted-foreground mb-8">
            Completa tu registro para comenzar a postularte a nuestras posiciones
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Nombre Completo
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Registrando...' : 'Continuar'}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Al registrarte, aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    </main>
  );
}