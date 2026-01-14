/**
 * Configuración de rutas del editor
 * Preparado para futura implementación de permisos y roles
 */

export interface EditorRoute {
  path: string;
  label: string;
  icon?: string;
  description?: string;
  // Futuro: permisos y roles
  // requiredRole?: string[];
  // requiredPermission?: string[];
}

export const editorRoutes: EditorRoute[] = [
  {
    path: "/editor/home",
    label: "Home",
    icon: "🏠",
    description: "Editar contenido de la página principal",
  },
  {
    path: "/editor/home/carrusel",
    label: "Carrusel",
    icon: "🖼️",
    description: "Gestionar imágenes del carrusel",
  },
  {
    path: "/editor/banner",
    label: "Banner",
    icon: "🎨",
    description: "Editar banner superior del portal",
  },
  {
    path: "/editor/info-blocks",
    label: "Info Blocks",
    icon: "📋",
    description: "Gestionar bloques de información institucional",
  },
  {
    path: "/editor/services",
    label: "Servicios",
    icon: "⚙️",
    description: "Gestionar servicios del portal",
  },
  // Futuras rutas se agregarán aquí
  // {
  //   path: "/editor/posts",
  //   label: "Posts",
  //   icon: "📝",
  //   description: "Gestionar artículos del blog",
  //   requiredRole: ["editor", "admin"],
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
