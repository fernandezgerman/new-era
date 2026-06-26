import React, {useState, useMemo} from 'react';

import {PageHeader} from "@/components/H.jsx";
import {AceptarButton, CancelarButton} from "@/components/Buttons.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {ContainerWithFooter} from "@/components/Containers/ContainerWithFooter.jsx";
import {Inicio} from "./Inicio.jsx";
import {Instalacion} from "./Instalacion.jsx";
import {ConfigurarClaveDeAcceso} from "./ConfigurarClaveDeAcceso.jsx";
import {ConfigurarComoServicio} from "./ConfigurarComoServicio.jsx";

export default function RustDeskInstalacionDocumentacion() {
    const [etapa, setEtapa] = useState('inicio');

    const etapas = useMemo(() => ({
        inicio: {
            nombre: '',
            componente: Inicio,
            etapa_siguiente: 'etapa1',
            etapa_anterior: null,
        },
        etapa1: {
            nombre: 'Descarga e instalación de Rust desk.',
            componente: Instalacion,
            etapa_siguiente: 'etapa2',
            etapa_anterior: 'inicio',
        },
        etapa2: {
            nombre: 'Configuracion de la clave de acceso.',
            componente: ConfigurarClaveDeAcceso,
            etapa_siguiente: 'etapa3',
            etapa_anterior: 'etapa1',
        },
        etapa3: {
            nombre: 'Configurar como servicio',
            componente: ConfigurarComoServicio,
            etapa_siguiente: null,
            etapa_anterior: 'etapa2',
        }
    }), []);

    const footer = <>
        <CancelarButton
            format={'xs'}
            className={'mt-0! px-3! py-1.5! text-xs!'}
            disabled={etapas[etapa].etapa_anterior === null}
            onClick={()=> {
                setEtapa(etapas[etapa].etapa_anterior ?? etapa)
            }}
        >
            Anterior
        </CancelarButton>
        <AceptarButton
            format={'xs'}
            className={'mt-0! px-3! py-1.5! text-xs!'}
            disabled={etapas[etapa].etapa_siguiente === null}
            onClick={()=> {
                setEtapa(etapas[etapa].etapa_siguiente ?? etapa)
            }}
        >
            Siguiente
        </AceptarButton>
    </>;


    return (<ErrorBoundary>
            <PageHeader>Instalacion y configuracion de <b>Rust Desk </b></PageHeader>
            <ContainerWithFooter
                scrolleableClassName={'min-h-160'}
                footer={footer}
            >
                {(() => {
                    const SpecificComponent = etapas[etapa].componente;
                    return SpecificComponent ? <SpecificComponent /> : <></>;
                })()}
            </ContainerWithFooter>
        </ErrorBoundary>
    );
}
