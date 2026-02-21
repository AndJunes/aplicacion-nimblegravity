import { NextRequest, NextResponse } from 'next/server';

const APPLY_API_URL = 'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net/api/candidate/apply-to-job';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { uuid, jobId, candidateId, repoUrl } = body;

    // Validar que todos los campos estén presentes
    if (!uuid || !jobId || !candidateId || !repoUrl) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: uuid, jobId, candidateId, repoUrl' },
        { status: 400 }
      );
    }

    // Validar formato de UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid) || !uuidRegex.test(candidateId)) {
      return NextResponse.json(
        { error: 'Formato de UUID inválido' },
        { status: 400 }
      );
    }

    // Validar que sea una URL válida
    try {
      new URL(repoUrl);
    } catch {
      return NextResponse.json(
        { error: 'repoUrl debe ser una URL válida' },
        { status: 400 }
      );
    }

    console.log('[submit-application] Enviando postulación:', {
      uuid,
      jobId,
      candidateId,
      repoUrl,
    });

    // Hacer la llamada al API externo
    const response = await fetch(APPLY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uuid,
        jobId,
        candidateId,
        repoUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text().catch(() => '');
      console.error('[submit-application] Error desde API:', response.status, errorData);
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    console.log('[submit-application] Respuesta exitosa:', data);

    return NextResponse.json(
      { ok: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error('[submit-application] Error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la postulación' },
      { status: 500 }
    );
  }
}