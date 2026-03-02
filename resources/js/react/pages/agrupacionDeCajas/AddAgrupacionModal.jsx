import React, {useEffect, useState} from 'react';
import {AddIconButton, H1, H3, PageHeader} from "@/components/H.jsx";
import {Table} from "@/components/Table.jsx";
import {CustomModal} from "@/components/Modal.jsx";
import {Input} from "@/components/Input.jsx";
import {Checkbox} from "@/components/Checkbox.jsx";
import {Hr} from "@/components/Hr.jsx";
import {SelectSucursalUsuarioCaja} from "@/widgets/SelectSucursalUsuarioCaja/index.js";
import {
    AceptarButton,
    Button,
    CancelarButton,
    DeleteIconButton,
    EditIconButton,
    IconButton
} from "@/components/Buttons.jsx";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {SelectUsuario} from "@/components/selects/SelectUsuario.jsx";
import {DeletedItem, LabelError} from "@/components/Label.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {isEmpty, isNumber} from "lodash";
import {arrayIsEmpty, objectIsEmpty} from "@/utils/general.js";

const MainPage = ({errores, setPage, agrupacionCaja, setAgrupacionCaja}) => {

    const [descripcion, setDescripcion] = useState(agrupacionCaja?.descripcion ?? '');
    const [importeInicial, setImporteInicial] = useState(agrupacionCaja?.importeinicial ?? '');
    const [activo, setActivo] = useState(agrupacionCaja?.activo ?? true);
    const deleteUsuario = (index) => {
        let _agrupacionCaja = {...agrupacionCaja};

        _agrupacionCaja.usuarios = _agrupacionCaja.usuarios.map((user) => ({
            ...user, deleted: (
                user.usuario.id === index && user.deleted ? false : (user.usuario.id === index || user.deleted)
            )
        }));

        setAgrupacionCaja(_agrupacionCaja);
    }

    const deleteCaja = (caja) => {
        let _agrupacionCaja = {...agrupacionCaja};

        _agrupacionCaja.cajas = _agrupacionCaja.cajas.map((c) => ({
            ...c, deleted: (
                (c.usuario.id === caja.usuario.id && c.sucursal.id === caja.sucursal.id) && c.deleted
                    ? false
                    : ((c.usuario.id === caja.usuario.id && c.sucursal.id === caja.sucursal.id) || c.deleted)
            )
        }));

        setAgrupacionCaja(_agrupacionCaja);
    }


    const usuarios = agrupacionCaja.usuarios.map((registro) => {
            const usuario = registro.usuario;
            return ({
                key: usuario.id,
                content:
                    [
                        {
                            content: <DeletedItem
                                deleted={registro?.deleted}>{usuario.nombre + ' ' + usuario.apellido}</DeletedItem>,
                            key: usuario.id + '-nombre'
                        },
                        {
                            content: <DeleteIconButton restore={registro?.deleted}
                                                       onClick={() => deleteUsuario(usuario.id)}
                                                       className={' rounded-md text-xs '}/>,
                            className: 'text-right py-1.5 ',
                            key: usuario.id + '-icon'
                        }
                    ]
            })
        }
    );

    const cajas = agrupacionCaja.cajas.map((caja) => ({
            key: caja.usuario.id + '-' + caja.sucursal.id,
            content: [
                {
                    content: <DeletedItem
                        deleted={caja?.deleted}>{caja.usuario.nombre + ' ' + caja.usuario.apellido}</DeletedItem>,
                    key: caja.usuario.id + '-' + caja.sucursal.id + 'nombre',
                }
                ,
                {
                    content: <DeletedItem
                        deleted={caja?.deleted}>{caja.sucursal.nombre}</DeletedItem>,
                    key: caja.usuario.id + '-' + caja.sucursal.id + 'sucursal',
                }
                ,
                {
                    content: <>
                        <DeleteIconButton
                            restore={caja?.deleted}
                            onClick={() => deleteCaja(caja)}
                            className={' rounded-md text-xs '}/>
                        {/*<EditIconButton className={' rounded-md text-xs bg-blue-500! '} />*/}
                    </>,
                    className:
                        'text-right py-1.5 ',
                    key: caja.usuario.id + '-' + caja.sucursal.id + 'icon',
                }
            ]
        }))
    ;

    const header = [
        {
            name: 'Usuario'
        },
        {
            name: 'Sucursal'
        },
        {
            name: ''
        }
    ];

    const usuariosHeader = [
        {
            name: 'Usuario'
        },
        {
            name: ''
        }
    ];

    useEffect(() => {
        setAgrupacionCaja({...agrupacionCaja, descripcion, activo, importeinicial: importeInicial});
    }, [descripcion, activo, importeInicial]);

    useEffect(() => {
    }, [agrupacionCaja]);
    return <>
        <H3>Descripcion</H3>
        <Input setValue={setDescripcion} value={descripcion} type="text" id={'descripcion'}
               errorMessage={errores.descripcion}/>

        <H3 className={'mt-3'}>Importe Inicial</H3>
        <Input selectOnFocus={true} setValue={setImporteInicial} value={importeInicial} type="pesos"
               errorMessage={errores.importeinicial} id={'importeinicial'}/>

        <Checkbox left={false} className={'mt-4'} value={activo} onChange={setActivo} label={'Activo'} type="checkbox"
                  name="email" errorMessage={errores.activo}/>
        <Hr/>
        <H3>
            <i>Cajas asociadas</i>
            <AddIconButton className={'text-sm! p-0.5! px-1!'} onAdd={() => setPage(Pages.AddCajaPage)}/>
        </H3>
        {errores.cajas && <LabelError>{errores.cajas}</LabelError>}
        <Table header={header} data={cajas} emptyText={'No hay cajas asociadas'}></Table>

        <Hr/>

        <H3>
            <i>Usuarios habilitados que pueden ver la agrupacion</i>
            <AddIconButton className={'text-sm! p-0.5! px-1!'} onAdd={() => setPage(Pages.AddUsuarioPage)}/>
        </H3>
        {errores.usuarios && <LabelError>{errores.usuarios}</LabelError>}
        <Table data={usuarios} header={usuariosHeader} emptyText={'No hay usuarios asociados'}></Table>
    </>;
}
const AddCajaPage = ({setPage, onAgregarCaja, caja, agrupacionCaja}) => {

    const [sucursal, setSucursal] = useState(null);
    const [usuario, setUsuario] = useState(null);

    const _onCancelar = () => {
        setPage(Pages.MainPage);
    }
    const _onAceptar = () => {
        onAgregarCaja({
            ...caja,
            usuario: usuario,
            sucursal: sucursal
        });
        _onCancelar();
    }

    const cajaEstaSeleccionado = agrupacionCaja.cajas.filter((c) => c.usuario.id == usuario?.id && c.sucursal.id == sucursal?.id).length > 0;

    return <div className={"flex flex-col  h-[400px]"}>
        <SelectSucursalUsuarioCaja
            sucursal={sucursal}
            setSucursal={setSucursal}
            usuario={usuario}
            setUsuario={setUsuario}
        />

        {cajaEstaSeleccionado && <LabelError>La caja ya fue seleccionado</LabelError>}

        <div className={' justify-end  flex mt-auto'}>
            <CancelarButton onClick={_onCancelar} className={'mr-2'}>Cancelar</CancelarButton>
            <Button
                disabled={usuario === null || cajaEstaSeleccionado}
                onClick={_onAceptar}
                className={' bg-blue-500! text-white! '}>
                Agregar
            </Button>
        </div>
    </div>
}

const AddUsuarioPage = ({setPage, onAgregarUsuario, agrupacionCaja}) => {
    const [usuario, setUsuario] = useState(null);

    const onAceptar = () => {
        onAgregarUsuario(usuario);
        onCancelar();
    }

    const onCancelar = () => {
        setPage(Pages.MainPage);
    }

    const usuarioEstaSeleccionado = agrupacionCaja.usuarios.filter((user) => user?.usuario?.id === usuario?.id).length > 0;
    return <div className={"flex flex-col  h-[400px]"}>
        <SelectUsuario setUsuario={setUsuario} usuario={usuario}/>
        {usuarioEstaSeleccionado && <LabelError>El usuario ya fue seleccionado</LabelError>}
        <div className={' justify-end  flex mt-auto'}>
            <CancelarButton onClick={onCancelar} className={'mr-2'}>Cancelar</CancelarButton>
            <Button
                disabled={usuario === null || usuarioEstaSeleccionado}
                onClick={onAceptar}
                className={' bg-blue-500! text-white! '}>
                Agregar
            </Button>
        </div>
    </div>
}
const Pages = {
    MainPage: {
        copete: 'Las agrupaciones de cajas se utilizan para monitorizar un grupo de caja desde un lugar. En general, se utilizan para auditar cuentas de Mercado Pago versus las cajas involucradas',
        titulo: 'Agregar Agrupacion De Caja',
        footer: undefined,
        component: MainPage
    },
    AddCajaPage: {
        copete: 'Seleccione el usuario y lsa sucursal de la caja que desea agregar a la agrupacion.',
        titulo: 'Agregar Caja a La Agrupacion',
        footer: false,
        component: AddCajaPage
    },
    AddUsuarioPage: {
        copete: 'Seleccione un usuario al que desea darle permisos para visualizar la agrupacion.',
        titulo: 'Agregar Usuario Autorizado',
        footer: false,
        component: AddUsuarioPage
    }

}
export const AddAgrupacionModal = ({onSave, agrupacionSeleccionada, addAgrupacionCaja, setAddAgrupacionCaja}) => {

    const [page, setPage] = useState(Pages.MainPage)
    const [saving, setSaving] = useState(false)
    const [agrupacionCaja, setAgrupacionCaja] = useState({
        descripcion: '',
        importeinicial: 0,
        activo: true,
        cajas: [],
        usuarios: [],
    })

    const [errores, setErrores] = useState({
        descripcion: '',
        importeinicial: '',
        activo: '',
        cajas: '',
        usuarios: '',
    })


    useEffect(() => {
        if (agrupacionSeleccionada === null) {
            return;
        }

        if (agrupacionSeleccionada?.id) {
            setAgrupacionCaja(agrupacionSeleccionada);
        } else {
            setAgrupacionCaja({
                descripcion: '',
                importeinicial: 0,
                activo: true,
                cajas: [],
                usuarios: [],
            });
        }
        setErrores({
            descripcion: '',
            importeinicial: '',
            activo: '',
            cajas: '',
            usuarios: '',
        });

        setAddAgrupacionCaja(true);

    }, [agrupacionSeleccionada]);

    const onAgregarCaja = (data) => {
        let cajas = [...agrupacionCaja.cajas];
        cajas.push(data);

        setAgrupacionCaja({
            ...agrupacionCaja,
            cajas: cajas
        })
    }

    const onAgregarUsuario = (data) => {
        let usuarios = [...agrupacionCaja.usuarios];
        usuarios.push({
            id: null,
            usuario: data
        });

        setAgrupacionCaja({
            ...agrupacionCaja,
            usuarios: usuarios
        })

    }

    const onAceptar = async () => {
        console.log('importeinicial', agrupacionCaja);
        const newError = {
            descripcion: isEmpty(agrupacionCaja.descripcion) ? 'Debe ingresar una descripcion' : null,
            activo: null,
            cajas: arrayIsEmpty(agrupacionCaja.cajas) ? 'Debe seleccionar al menos una caja ' : null,
            importeinicial: isNumber(agrupacionCaja.importeinicial) ? null : 'El valor no es correcto, ingrese un numero',
            usuarios: arrayIsEmpty(agrupacionCaja.usuarios) ? 'Debe seleccionar al menos un usuario ' : null,
        };
        setErrores(newError);

        if (objectIsEmpty(newError)) {
            setSaving(true);
            const error = await onSave(agrupacionCaja);

            if (error !== '') {
                setErrores({...errores, descripcion: error});
            } else {
                setAddAgrupacionCaja(false);
            }
            setSaving(false);
        }
    }
    return (
        <ErrorBoundary>
            <CustomModal
                onAceptar={onAceptar}
                isOpen={addAgrupacionCaja}
                setIsOpen={setAddAgrupacionCaja}
                copete={page.copete}
                footer={page.footer}
                titulo={page.titulo}
                loading={saving}
            >
                {<page.component
                    setPage={setPage}
                    onAgregarUsuario={onAgregarUsuario}
                    onAgregarCaja={onAgregarCaja}
                    agrupacionCaja={agrupacionCaja}
                    setAgrupacionCaja={setAgrupacionCaja}
                    errores={errores}
                />}
            </CustomModal>
        </ErrorBoundary>
    );
}
