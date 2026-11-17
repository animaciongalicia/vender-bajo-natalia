// Listado de propiedades. Para añadir una, copia un bloque y cambia los datos.
// tipo: 'local' o 'vivienda'. "ejemplo: true" marca las fichas inventadas para ver el diseño.
const G = 'https://cdn.gamma.app/69qkpmgsd3rf2vl/design-anything/';
window.FOTOS = {
  fachada: G + 'yeeshGkTKRJGyEjVqM9X3/fF89Qw7L6MBuC-9Oo-o9A.jpg',
  interior: G + 'NB7l1GMgl5FgQXNgw1mXy/lqW7Vl-VLj6CN6DOdnppL.jpg',
  negocio: G + 'p0EeBNKSfowDdc2KpDkYN/UEOrLgsfkWNfQW8dTA4Q4.jpg',
  calle: G + 'zOiZ2BtaMeIJX7GHjRUbg/q0xwH8LgWZWZcSKFU3pSH.jpg',
};
window.PROPIEDADES = [
  {
    id: 'bajo-bugallal-marchesi', tipo: 'local', zona: 'Monelos',
    titulo: 'Bajo a pie de calle en Bugallal Marchesi',
    m2: 70, extras: ['5 m de escaparate', 'Sin comunidad'],
    precio: 120000, foto: FOTOS.fachada,
    url: 'propiedades/bajo-bugallal-marchesi.html',
  },
  {
    id: 'piso-os-mallos', tipo: 'vivienda', zona: 'Os Mallos', ejemplo: true,
    titulo: 'Piso luminoso de tres dormitorios',
    m2: 92, dormitorios: 3, banos: 2, extras: ['Ascensor', 'Exterior', 'Calefacción'],
    precio: 215000, foto: FOTOS.interior,
    descripcion: 'Piso exterior con mucha luz, distribución cómoda y todos los servicios a pie de calle. Para entrar a vivir o actualizar a tu gusto.',
  },
  {
    id: 'piso-monte-alto', tipo: 'vivienda', zona: 'Monte Alto', ejemplo: true,
    titulo: 'Piso reformado junto al mar',
    m2: 68, dormitorios: 2, banos: 1, extras: ['Reformado', 'Exterior', 'Cerca de la playa'],
    precio: 189000, foto: FOTOS.calle,
    descripcion: 'Reforma reciente, a pocos minutos andando del paseo marítimo. Una casa pequeña en gastos y grande en calidad de vida.',
  },
  {
    id: 'piso-cuatro-caminos', tipo: 'vivienda', zona: 'Cuatro Caminos', ejemplo: true,
    titulo: 'Piso familiar con trastero',
    m2: 110, dormitorios: 4, banos: 2, extras: ['Garaje', 'Trastero', 'Ascensor'],
    precio: 298000,
    descripcion: 'Cuatro dormitorios, garaje y trastero en una de las zonas mejor comunicadas de la ciudad.',
  },
  {
    id: 'apartamento-agra', tipo: 'vivienda', zona: 'Agra do Orzán', ejemplo: true,
    titulo: 'Apartamento para entrar a vivir',
    m2: 55, dormitorios: 1, banos: 1, extras: ['Amueblado', 'Ascensor'],
    precio: 139000,
    descripcion: 'Apartamento amueblado y listo. Primera vivienda o inversión para alquilar.',
  },
  {
    id: 'piso-elvina', tipo: 'vivienda', zona: 'Elviña', ejemplo: true,
    titulo: 'Piso con terraza y vistas',
    m2: 85, dormitorios: 3, banos: 2, extras: ['Terraza', 'Garaje', 'Vistas'],
    precio: 245000,
    descripcion: 'Tres dormitorios y una terraza para usar todo el año, cerca de la universidad y de las zonas verdes.',
  },
];
