import React, {useState} from 'react';

import {PageHeader} from "@/components/H.jsx";
import {AceptarButton, Button, CancelarButton} from "@/components/Buttons.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {ContainerWithFooter} from "@/components/Containers/ContainerWithFooter.jsx";
import {ReactMenu} from "@/widgets/menu/ReactMenu.jsx";

const inicio = () => {
    return (<>
        <p>
            Rust desk es una aplicacion de escritorio para controlar de forma remota cada computadora de la cadena.
            <br/>
            El siguiente tutorial está orientado a instalar y configurar Rust desk para poder ingresar en cualquier
            momento que el usuario con permisos (que conozca la clave) lo requiera.
            <br/>
        </p>
        <p>
            <h4>El tutorial se compone por las siguientes etapas:<br/></h4>
            1 - Descarga e instalación de Rust desk.<br/>
            2 - Configuracion de la clave de acceso y acceso remoto.<br/>
            3 - Rust desk como servicio de windows para que inicie automaticamente al prender la PC<br/>
        </p>
    </>);
}
const etapas = {
    inicio: {
        nombre: '',
        componente: inicio,
    },
    etapa1: {
        nombre: 'Descarga e instalación de Rust desk.',
        etapa_siguiente: 'etapa2'
    },
    etapa2: {
        nombre: 'Configuracion de la clave de acceso.',
        etapa_siguiente: 'etapa1'
    },
    etapa3: {
        nombre: 'Configurar como servicio',
        etapa_siguiente: null
    }
}

export const RustDeskInstalacionDocumentacion = () => {

    const [etapa, setEtapa] = useState('inicio');

    const footer = <>
        <CancelarButton
            format={'xs'}
            className={'mt-0! px-3! py-1.5! text-xs!'}
        >
            Anterior
        </CancelarButton>
        <AceptarButton
            format={'xs'}
            className={'mt-0! px-3! py-1.5! text-xs!'}

        >
            Siguiente
        </AceptarButton>
    </>;


    const GenerateComponent = ({etapa}) => {
        const SpecificComponent = etapas[etapa].componente;
        return SpecificComponent ? <SpecificComponent /> : <></>
    }

    return (<ErrorBoundary>
            <PageHeader>Instalacion y configuracion de <b>Rust Desk </b></PageHeader>
            <ContainerWithFooter
                className={'h-full'}
                footer={footer}
            >
                <GenerateComponent etapa={etapa} />
            </ContainerWithFooter>
        </ErrorBoundary>
    );
}
