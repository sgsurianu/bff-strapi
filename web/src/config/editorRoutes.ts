/**
 * Configuración de rutas del editor
 * Preparado para futura implementación de permisos y roles
 */

export interface EditorRoute {
  path: string;
  label: string;
  icon?: string;
  description?: string;
  group?: string; // Grupo al que pertenece la ruta
  isSubRoute?: boolean; // Si es una subruta que no se muestra en el menú principal
  // Futuro: permisos y roles
  // requiredRole?: string[];
  // requiredPermission?: string[];
}

export const editorRoutes: EditorRoute[] = [
  // GRUPO: INICIO (contenido de la página principal)
  {
    path: "/editor/inicio",
    label: "Inicio",
    icon: "🏠",
    description: "Dashboard de la página de inicio",
    group: "inicio",
  },
  {
    path: "/editor/inicio/carrusel",
    label: "Carrusel",
    icon: "🖼️",
    description: "Gestionar imágenes del carrusel",
    group: "inicio",
    isSubRoute: true,
  },
  {
    path: "/editor/inicio/banner",
    label: "Banner",
    icon: "🎨",
    description: "Editar banner superior del portal",
    group: "inicio",
    isSubRoute: true,
  },
  {
    path: "/editor/inicio/info-blocks",
    label: "Info Blocks",
    icon: "📋",
    description: "Gestionar bloques de información institucional",
    group: "inicio",
    isSubRoute: true,
  },
  
  // GRUPO: SERVICIOS (separado de Inicio)
  {
    path: "/editor/servicios",
    label: "Servicios",
    icon: "⚙️",
    description: "Gestionar servicios del portal",
    group: "servicios",
  },
  
  // Futuras rutas se agregarán aquí con sus respectivos grupos
  // {
  //   path: "/editor/noticias",
  //   label: "Noticias",
  //   icon: "📰",
  //   description: "Gestionar noticias del portal",
  //   group: "noticias",
  // },
];

/**
 * Obtiene una ruta por su path
 */
export function getRouteByPath(path: string): EditorRoute | undefined {
  return editorRoutes.find((route) => route.path === path);
}

/**
 * Obtiene todas las rutas (futuro: filtrado por permisos)
 */
export function getAvailableRoutes(): EditorRoute[] {
  // Futuro: filtrar por permisos del usuario
  return editorRoutes;
}

/**
 * Obtiene solo las rutas principales (no subrutas)
 */
export function getMainRoutes(): EditorRoute[] {
  return editorRoutes.filter((route) => !route.isSubRoute);
}

/**
 * Obtiene subrutas de un grupo específico
 */
export function getSubRoutesByGroup(group: string): EditorRoute[] {
  return editorRoutes.filter((route) => route.group === group && route.isSubRoute);
}
