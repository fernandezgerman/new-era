import React, {useCallback, useRef, useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {PageHeader} from '@/components/H.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {Button} from '@/components/Buttons.jsx';
import {Label, LabelError} from '@/components/Label.jsx';
import {Loading} from '@/components/Loading.jsx';
import {SelectProveedor} from '@/components/selects/SelectProveedor.jsx';
import ProveedoresImportarListasResource from '@/resources/ProveedoresImportarListas.jsx';
import {ImportarListasPasoColumnas} from './ImportarListasPasoColumnas.jsx';
import {ImportarListasPasoColumnasDefinidas} from './ImportarListasPasoColumnasDefinidas.jsx';
import {extractImportarListasError} from './importarListasUtils.jsx';

const proveedoresImportarListasResource = new ProveedoresImportarListasResource();

const cardShellClass =
    'p-4 rounded-lg border border-slate-200/80 bg-white text-slate-900 shadow ' +
    'dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]';

const ACCEPTED_EXTENSIONS = ['.pdf', '.xls', '.xlsx'];
const ACCEPT_ATTR = '.pdf,.xls,.xlsx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const isAcceptedFile = (file) => {
    if (!file?.name) {
        return false;
    }
    const lower = file.name.toLowerCase();
    return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
};

const ImportarListasPasoCargar = ({
    proveedor,
    setProveedor,
    archivo,
    setArchivo,
    uiError,
    isLoading,
    onCargar,
}) => {
    const inputRef = useRef(null);

    const onFileChange = (e) => {
        const file = e.target.files?.[0] ?? null;
        if (file && !isAcceptedFile(file)) {
            setArchivo(null);
            if (inputRef.current) {
                inputRef.current.value = '';
            }
            return;
        }
        setArchivo(file);
    };

    return (
        <div className={cardShellClass}>
            <p className={'mb-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300'}>
                Este proceso es para importar listas de precios de proveedores puntuales.
            </p>

            <SelectProveedor
                proveedor={proveedor}
                setProveedor={setProveedor}
                disabled={isLoading}
            />

            <div className={'mt-6'}>
                <Label className={'mb-2 block pl-0'}>Archivo</Label>
                <input
                    ref={inputRef}
                    type={'file'}
                    accept={ACCEPT_ATTR}
                    disabled={isLoading}
                    onChange={onFileChange}
                    className={
                        'block w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm '
                        + 'text-slate-900 file:mr-4 file:rounded-md file:border-0 file:bg-pink-500 file:px-4 file:py-2 '
                        + 'file:text-xs file:font-semibold file:text-white hover:file:bg-pink-600 '
                        + 'disabled:cursor-not-allowed disabled:opacity-60 '
                        + 'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                    }
                />
                <p className={'mt-2 text-xs text-slate-500 dark:text-slate-400'}>
                    Formatos permitidos: PDF, XLS, XLSX
                </p>
            </div>

            {uiError ? <div className={'mt-4'}><LabelError>{uiError}</LabelError></div> : null}

            {isLoading ? (
                <div className={'mt-4 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200'}>
                    <Loading/>
                    <span>Procesando archivo…</span>
                </div>
            ) : null}

            <div className={'mt-6 flex items-center gap-3'}>
                <Button
                    onClick={onCargar}
                    disabled={isLoading}
                    className={'w-full md:w-auto'}
                >
                    Cargar
                </Button>
            </div>
        </div>
    );
};

export const ProveedoresListasImportar = () => {
    const [paso, setPaso] = useState('cargar');
    const [proveedor, setProveedor] = useState(null);
    const [archivo, setArchivo] = useState(null);
    const [importacion, setImportacion] = useState(null);
    const [uiError, setUiError] = useState(null);

    const cargarMutation = useMutation({
        mutationFn: ({idproveedor, file}) =>
            proveedoresImportarListasResource.importarPorArchivo(idproveedor, file),
        onSuccess: (data) => {
            setUiError(null);
            setImportacion(data);
            setPaso('columnas');
        },
        onError: (err) => {
            setUiError(extractImportarListasError(err));
        },
    });

    const onCargar = useCallback(() => {
        setUiError(null);

        if (!proveedor?.id) {
            setUiError('Seleccione un proveedor.');
            return;
        }
        if (!archivo) {
            setUiError('Seleccione un archivo.');
            return;
        }
        if (!isAcceptedFile(archivo)) {
            setUiError('El archivo debe ser PDF, XLS o XLSX.');
            return;
        }

        cargarMutation.mutate({
            idproveedor: parseInt(proveedor.id, 10),
            file: archivo,
        });
    }, [proveedor, archivo, cargarMutation]);

    const onContinuarColumnasSuccess = useCallback((data) => {
        setImportacion(data);
        setPaso('columnas-definidas');
    }, []);

    const onNuevaLista = useCallback(() => {
        setPaso('cargar');
        setImportacion(null);
        setArchivo(null);
        setUiError(null);
    }, []);

    const isLoading = cargarMutation.isPending;

    return (
        <ErrorBoundary>
            <PageHeader>Importar listas de precios</PageHeader>
            <br/>
            {paso === 'cargar' ? (
                <ImportarListasPasoCargar
                    proveedor={proveedor}
                    setProveedor={setProveedor}
                    archivo={archivo}
                    setArchivo={setArchivo}
                    uiError={uiError}
                    isLoading={isLoading}
                    onCargar={onCargar}
                />
            ) : null}
            {paso === 'columnas' ? (
                <ImportarListasPasoColumnas
                    importacion={importacion}
                    onContinuarSuccess={onContinuarColumnasSuccess}
                />
            ) : null}
            {paso === 'columnas-definidas' ? (
                <ImportarListasPasoColumnasDefinidas
                    importacion={importacion}
                    onNuevaLista={onNuevaLista}
                />
            ) : null}
        </ErrorBoundary>
    );
};
