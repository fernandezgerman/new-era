import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {AlternativeCard} from '@/components/Card.jsx';
import {Button} from '@/components/Buttons.jsx';

export const ArticulosAOrdenarGenerarHeader = ({
    onGuardarYEnviar,
    onSoloGuardar,
    disabled = false,
    isSaving = false,
    saveStarted = false,
}) => {
    const actionsDisabled = disabled || isSaving || saveStarted;

    return (
        <ErrorBoundary>
            <AlternativeCard className={'mb-4'}>
                <div className={'flex flex-wrap items-center justify-end gap-3'}>
                    <div>
                        <Button
                            onClick={onGuardarYEnviar}
                            disabled={actionsDisabled}
                            className={'mt-0! px-4! py-1.5! text-xs!'}
                        >
                            {isSaving ? 'Guardando y enviando...' : 'Guardar y enviar por email'}
                        </Button>

                        <Button
                            onClick={onSoloGuardar}
                            disabled={actionsDisabled}
                            className={'ml-2 mt-0! px-4! py-1.5! text-xs!'}
                        >
                            {isSaving ? 'Guardando...' : 'Solo guardar'}
                        </Button>
                    </div>
                </div>
            </AlternativeCard>
        </ErrorBoundary>
    );
};
