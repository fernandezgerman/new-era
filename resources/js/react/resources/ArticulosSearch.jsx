import Resource from '@/resources/Resource.jsx';

export const searchArticulos = async ({filtros, page = 1, perPage = 20} = {}) => {
    const resource = new Resource();
    return resource.getEntities(
        'articulo',
        ['rubro', 'listaDetalles'],
        filtros,
        {orden1: {name: 'nombre', direction: 'asc'}},
        null,
        page,
        perPage,
    );
};
