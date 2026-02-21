'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CandidateContextType {
  uuid: string | null;
  candidateId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  setCandidateInfo: (uuid: string, candidateId: string, firstName: string, lastName: string, email: string) => void;
  clearCandidateInfo: () => void;
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

export function CandidateProvider({ children }: { children: ReactNode }) {
  const [uuid, setUuid] = useState<string | null>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const setCandidateInfo = (uuid: string, candidateId: string, firstName: string, lastName: string, email: string) => {
    setUuid(uuid);
    setCandidateId(candidateId);
    setFirstName(firstName);
    setLastName(lastName);
    setEmail(email);
  };

  const clearCandidateInfo = () => {
    setUuid(null);
    setCandidateId(null);
    setFirstName(null);
    setLastName(null);
    setEmail(null);
  };

  return (
    <CandidateContext.Provider
      value={{
        uuid,
        candidateId,
        firstName,
        lastName,
        email,
        setCandidateInfo,
        clearCandidateInfo,
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
}

export function useCandidateContext() {
  const context = useContext(CandidateContext);
  if (context === undefined) {
    throw new Error('useCandidateContext must be used within CandidateProvider');
  }
  return context;
}