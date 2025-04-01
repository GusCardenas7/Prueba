"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { PackageOpen, ShoppingBasket, Weight } from "lucide-react";
import { getSession } from "next-auth/react";
import styles from "../../public/CSS/spinner.css";
import { SpaceBetweenHorizontallyIcon } from "@radix-ui/react-icons";
import "../../public/CSS/navbar.css";
import { useUser } from "@/pages/api/hooks";
import { ShoppingBag } from "lucide-react";
export function Navbarv1() {
  const [openSection, setOpenSection] = useState(null);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [idUser, setID] = useState("");
  const [correoUser, setCorreo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenus, setOpenMenus] = useState([]);
  const [openSections, setOpenSections] = useState({});
  const {
    user,
    isLoading,
    isMaster,
    isAdminMkt,
    isAdminGC,
    isITMember,
    isStandardMkt,
    isStandard,
    hasAccessPapeletas,
    hasAccessAutorizarPapeletas,
    hasAccessSolicitudes,
    hasAllAccessVacantes,
    hasAccessVacantes,
    isDadoDeBaja,
    hasAccessCMDProductos,
  } = useUser();
  // Función para abrir/cerrar secciones principales y submenús
  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId], // Cambiar el estado de la sección actual
    }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const session = await getSession();
      if (session) {
        const response = await fetch("/api/Users/getUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ correo: session.user.email }),
        });
        const userData = await response.json();
        if (userData.success) {
          setNombre(userData.user.nombre);
          setApellidos(userData.user.apellidos);
          setDepartamento(userData.departamento.nombre);
          setID(userData.user.id);
          setCorreo(userData.user.correo);
        } else {
          alert("Error al obtener los datos del usuario");
        }
      }
    };
    fetchUserData();
  }, []);

  const { data: session, status } = useSession();

  const toggleMenu = (menuId) => {
    setOpenMenus(
      (prevOpenMenus) =>
        prevOpenMenus.includes(menuId)
          ? prevOpenMenus.filter((id) => id !== menuId) // Cerrar menú
          : [...prevOpenMenus, menuId] // Abrir menú
    );
  };

  if (!session || !session.user) {
    return null;
  }

  const categories = [
    { id: "principal", name: "Principal", href: "#", roles: ["*"] },
    {
      id: 2,
      name: "Inicio",
      href: "/inicio",
      icon: <InicioIcon className="h-6 w-6 text-gray-400" />,
      roles: ["*"],
    },
    {
      id: 3,
      name: "Noticias",
      href: "#",
      icon: <NoticiasIcon className="h-6 w-6 text-gray-400" />,
      roles: ["*"],
    },
    {
      id: 4,
      name: "Ver mis papeletas",
      href: "/papeletas_usuario",
      icon: <PapeletasIcon className="h-6 w-6 text-gray-400" />,
      roles: ["*"],
    },
    {
      id: 5,
      name: "Ayuda",
      href: "#",
      icon: <AyudaIcon className="h-6 w-6 text-gray-400" />,
      roles: ["*"],
    },
    {
      id: "departamentos",
      name: "Departamentos",
      href: "#",
      roles: [
        "master",
        "adminMkt",
        "adminGC",
        "itMember",
        "standardMkt",
        "hasAccessPapeletas",
        "hasAccessAutorizarPapeletas",
        "hasAccessSolicitudes",
        "hasAllAccessVacantes",
        "hasAccessVacantes",
        "hasAccessCMDProductos",
      ],
    },
    {
      id: 7,
      name: "Gente & Cultura",
      href: "#",
      icon: <GenteCulturaIcon className="h-6 w-6 text-gray-400" />,
      roles: [
        "master",
        "adminGC",
        "hasAccessPapeletas",
        "hasAccessAutorizarPapeletas",
        "hasAccessSolicitudes",
        "hasAllAccessVacantes",
        "hasAccessVacantes",
      ],
      subMenu: [
        {
          id: 1,
          name: "Papeletas RH",
          href: "/gente_y_cultura/todas_papeletas",
          icon: <RHIcon className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAccessPapeletas"],
        },
        {
          id: 2,
          name: "Autorizar papeletas",
          href: "/gente_y_cultura/autorizar_papeletas",
          icon: <PermisosSubIcon className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAccessAutorizarPapeletas"],
        },
        {
          id: 3,
          name: "Ver mis solicitudes",
          href: "/gente_y_cultura/solicitudes",
          icon: <SolicitudIcon className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAccessSolicitudes"],
        },

        {
          id: 4,
          name: "Usuarios y empresas",
          href: "#",
          icon: <UsuariosEmpresasIcon className="h-6 w-6 text-gray-400" />,
          roles: ["master", "adminGC"],
          subMenu: [
            {
              id: 1,
              name: "Usuarios",
              href: "/usuario",
              icon: <UsuariosIcon className="h-6 w-6 text-gray-400" />,
              roles: ["master", "adminGC"],
            },
            {
              id: 2,
              name: "Empresas",
              href: "/usuario/empresas",
              icon: <EmpresasIcon className="h-6 w-6 text-gray-400" />,
              roles: ["master", "adminGC"],
            },
          ],
        },
        {
          id: 5,
          name: "Vacantes",
          href: "/gente_y_cultura/vacantes",
          icon: <VacantesIcon className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAllAccessVacantes", "hasAccessVacantes"],
        },
      ],
    },
    {
      id: 8,
      name: "Mercadotecnia",
      href: "#",
      icon: <MarketingIcon className="h-6 w-6 text-gray-400" />,
      roles: ["master", "adminMkt", "standardMkt"],
      subMenu: [
        {
          name: "Estrategias",
          href: "/marketing/estrategias",
          icon: (
            <EstrategiaIcon
              style={{ marginLeft: "20px" }}
              className="h-6 w-6 text-gray-400"
            />
          ),
          roles: ["master", "adminMkt"],
        },
        {
          name: "Firmas",
          href: "/marketing/etiquetas/tabla_general",
          icon: <FirmasIcon className="h-6 w-6 text-gray-400" />,
          roles: ["master", "adminMkt", "standardMkt"],
        },
      ],
    },
    {
      id: 9,
      name: "Operaciones",
      href: "#",
      icon: <OperacionesIcon className="h-6 w-6 text-gray-400" />,
      roles: ["master"],
    },
    {
      id: 10,
      name: "IT",
      href: "#",
      icon: <ITIcon className="h-6 w-6 text-gray-400" />,
      roles: ["master", "itMember"],
      subMenu: [
        {
          name: "Inventario",
          href: "/it/inventario",
          icon: (
            <InventarioIcon
              style={{ marginLeft: "20px" }}
              className="h-6 w-6 text-gray-400"
            />
          ),
          roles: ["master", "itMember"],
        },
      ],
    },
    {
      id: 11,
      name: "Ingeniería de nuevo producto",
      href: "#",
      icon: <IngenieriaNuevoPIcon className="h-6 w-6 text-gray-400" />,
      roles: ["master", "hasAccessCMDProductos"],
      subMenu: [
        {
          id: 1,
          name: "Catálogo de productos",
          href: "/ingenieria_nuevo_producto",
          icon: (
            <ShoppingBag
              style={{ width: "32px", height: "32px" }}
              className="h-6 w-6 text-gray-400"
            />
          ),
          roles: ["master", "hasAccessCMDProductos"],
        },
        {
          id: 2,
          name: "CMD",
          href: "/ingenieria_nuevo_producto/catalogo_productos",
          icon: <ConfigIcon className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAccessCMDProductos"],
        },
      ],
    },
    {
      id: 12,
      name: "Auditorias",
      href: "#",
      icon: <AuditoriasIcon className="h-6 w-6 text-gray-400" />,
      roles: ["master"],
    },
    {
      id: 13,
      name: "Ventas",
      href: "#",
      icon: <VentasIcon className="h-6 w-6 text-gray-400" />,
      roles: ["master"],
    },
    {
      id: 14,
      name: "Contabilidad",
      href: "#",
      icon: <ContabilidadIcon className="h-6 w-6 text-gray-400" />,
      roles: ["master"],
    },
    { id: "cursos", name: "Cursos", href: "#", roles: ["master"] },
    {
      id: 16,
      name: "Capacitaciones",
      href: "#",
      icon: <CapacitacionesIcon className="h-6 w-6 text-gray-400" />,
      roles: ["master"],
    },
    {
      id: "configuraciones",
      name: "Configuraciones",
      href: "#",
      roles: ["master", "hasAccessCMDProductos"],
    },
    {
      id: 18,
      name: "CMD",
      href: "#",
      icon: <ConfigIcon className="h-6 w-6 text-gray-400" />,
      roles: ["master", "hasAccessCMDProductos"],
      subMenu: [
        {
          id: 1,
          name: "CMD Productos",
          href: "/configuraciones/cmd/Productos",
          icon: <ShoppingBasket className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAccessCMDProductos"],
        },
        {
          id: 2,
          name: "CMD Proveedores",
          href: "/configuraciones/cmd/proveedores",
          icon: <PackageOpen className="h-6 w-6 text-gray-400" />,
          roles: ["master", "hasAccessCMDProductos"],
        },
      ],
    },
  ];

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasAccess = (category) => {
    if (category.includes("*")) return true;
    if (isMaster && category.includes("master")) return true;
    if (isDadoDeBaja && category.includes("baja")) return true;
    if (isAdminMkt && category.includes("adminMkt")) return true;
    if (isStandardMkt && category.includes("standardMkt")) return true;
    if (isStandard && category.includes("standard")) return true;
    if (isAdminGC && category.includes("adminGC")) return true;
    if (isITMember && category.includes("itMember")) return true;
    if (hasAccessPapeletas && category.includes("hasAccessPapeletas"))
      return true;
    if (
      hasAccessAutorizarPapeletas &&
      category.includes("hasAccessAutorizarPapeletas")
    )
      return true;
    if (hasAccessSolicitudes && category.includes("hasAccessSolicitudes"))
      return true;
    if (hasAllAccessVacantes && category.includes("hasAllAccessVacantes"))
      return true;
    if (hasAccessVacantes && category.includes("hasAccessVacantes"))
      return true;
    if (hasAccessCMDProductos && category.includes("hasAccessCMDProductos"))
      return true;

    return false;
  };

  const hasSubMenuAccess = (subMenu) => {
    return subMenu.some((item) => hasAccess(item.roles || []));
  };

  return (
    <div className="flex flex-col w-64 h-screen min-h-screen bg-gray-800 text-white">
      <div
        style={{ borderBottomWidth: "2px", marginRight: "6px" }}
        className="flex items-center justify-between h-16 border-gray-700 px-4"
      >
        <div style={{ color: "white" }} className="flex items-center">
          <img
            style={{ marginLeft: "15px" }}
            src="/icon_user.png"
            alt="Logo"
            className="h-8 w-8"
          />
          <a style={{ marginLeft: "15px", textAlign: "center" }} href="/perfil">
            <span className="font-medium">
              {nombre} <br /> {apellidos}
            </span>
          </a>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full pl-12 pr-4 py-2 bg-gray-700 rounded-md text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <nav>
          {filteredCategories.map((category) => {
            if (!hasAccess(category.roles || [])) return null;
            return (
              <div key={category.id} className="group">
                {/* Secciones principales con IDs específicos */}
                {[
                  "principal",
                  "departamentos",
                  "cursos",
                  "configuraciones",
                ].includes(category.id) ? (
                  <div
                    className="text-gray-400 cursor-pointer flex items-center justify-between py-2"
                    onClick={() => toggleSection(category.id)}
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      textDecoration: "underline",
                    }}
                  >
                    {category.name}
                  </div>
                ) : (
                  <div>
                    {/* Menú principal */}
                    <div
                      className="flex items-center justify-between cursor-pointer py-2 px-4 hover:bg-gray-700"
                      onClick={() => toggleSection(category.id)}
                      style={{ color: "white" }}
                    >
                      <div className="flex items-center">
                        {category.icon}
                        <Link href={category.href} className="ml-2">
                          {category.name}
                        </Link>
                      </div>
                      {category.subMenu &&
                        hasSubMenuAccess(category.subMenu) && (
                          <span className="text-gray-400">
                            {openSections[category.id] ? "-" : "+"}
                          </span>
                        )}
                    </div>

                    {/* Submenús dinámicos */}
                    {openSections[category.id] && category.subMenu && (
                      <div className="pl-8">
                        {category.subMenu.map((subItem) => {
                          if (!hasAccess(subItem.roles || [])) return null;
                          return (
                            <div key={subItem.id}>
                              <div
                                className="flex items-center justify-between cursor-pointer py-2 px-4 hover:bg-gray-600"
                                onClick={() => toggleSection(subItem.id)}
                                style={{ color: "white" }}
                              >
                                <div className="flex items-center">
                                  {subItem.icon}
                                  <Link href={subItem.href} className="ml-2">
                                    {subItem.name}
                                  </Link>
                                </div>
                                {subItem.subMenu && (
                                  <span className="text-gray-400">
                                    {openSections[subItem.id] ? "-" : "+"}
                                  </span>
                                )}
                              </div>

                              {/* Segundo nivel de submenús */}
                              {openSections[subItem.id] && subItem.subMenu && (
                                <div className="pl-8">
                                  {subItem.subMenu.map((nestedItem) => (
                                    <Link
                                      key={nestedItem.id}
                                      href={nestedItem.href}
                                      className="block py-2 px-4 hover:bg-gray-500 flex items-center"
                                      style={{ color: "white" }}
                                    >
                                      <div style={{ marginRight: "10px" }}>
                                        {nestedItem.icon}
                                      </div>
                                      {nestedItem.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div
        style={{ borderTopWidth: "2px", marginRight: "6px" }}
        className="mt-auto p-4 border-gray-700"
      >
        <Button
          onClick={() =>
            signOut({ callbackUrl: "https://aionnet.vercel.app/" })
          }
          className="w-full"
          style={{ color: "black", background: "white" }}
        >
          Cerrar sesión
          <LogOutIcon
            style={{ marginLeft: "0.5rem" }}
            className="h-4 w-4 text-gray-400"
          />
        </Button>
      </div>
    </div>
  );
}

function LogOutIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function GenteCulturaIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="7" r="4"></circle>
      <path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"></path>
    </svg>
  );
}

function EstrategiaIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="white"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="6"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="12" cy="12" r="2" fill="white" />
    </svg>
  );
}

function FirmasIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="white"
    >
      <path d="M2 22l2-6 12-12a4 4 0 1 1 6 6L8 22l-6 0zm16.5-16.5a2 2 0 0 0-2.83 0L6 15.17 8.83 18l9.67-9.67a2 2 0 0 0 0-2.83z" />
    </svg>
  );
}

function MarketingIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4H15l-5 5H2v6h8l5 5h7z"></path>
      <path d="M15 12V2"></path>
      <path d="M7 13v6"></path>
      <path d="M4 18v2"></path>
    </svg>
  );
}

function OperacionesIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a2 2 0 0 0 .37 2.21l.06.06a2 2 0 0 1-1.42 3.42h-2a2 2 0 0 0-1.89 1.32l-.03.1a2 2 0 0 1-3.8 0l-.03-.1A2 2 0 0 0 7 20h-2a2 2 0 0 1-1.42-3.42l.06-.06A2 2 0 0 0 4.6 15l.1-.03A2 2 0 0 0 4 13v-2a2 2 0 0 0 1.32-1.89l-.03-.1a2 2 0 0 0-1.37-2.37l-.1-.03A2 2 0 0 1 5 4h2a2 2 0 0 0 1.89-1.32l.03-.1a2 2 0 0 1 3.8 0l.03.1A2 2 0 0 0 17 4h2a2 2 0 0 1 1.42 3.42l-.06.06A2 2 0 0 0 19.4 9l-.1.03A2 2 0 0 0 20 11v2a2 2 0 0 0-1.32 1.89l.03.1z"></path>
    </svg>
  );
}

function ITIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M8 21h8"></path>
      <path d="M12 17v4"></path>
      <path d="M10 9l-2 2l2 2"></path>
      <path d="M14 9l2 2l-2 2"></path>
    </svg>
  );
}

function IngenieriaNuevoPIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18h6"></path>
      <path d="M10 22h4"></path>
      <path d="M12 2a7 7 0 0 0-4 12.65V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.35A7 7 0 0 0 12 2z"></path>
    </svg>
  );
}

function AuditoriasIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
      <path d="M8 10h8"></path>
      <path d="M8 6h4"></path>
      <path d="M9 14h2"></path>
      <path d="M15 14h-2v2a2 2 0 1 0 2-2z"></path>
      <path d="M18.5 18.5 22 22"></path>
    </svg>
  );
}

function VentasIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 17h4v4H3z"></path>
      <path d="M9 13h4v8H9z"></path>
      <path d="M15 9h4v12h-4z"></path>
      <path d="M21 5h2v16h-2z"></path>
      <path d="M6 17l4-4l4 4l4-4"></path>
    </svg>
  );
}

function ContabilidadIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="2" width="18" height="20" rx="2" ry="2"></rect>
      <path d="M7 6h10"></path>
      <path d="M7 10h10"></path>
      <path d="M7 14h10"></path>
      <path d="M7 18h10"></path>
      <path d="M9 8v.01"></path>
      <path d="M9 12v.01"></path>
      <path d="M9 16v.01"></path>
      <path d="M13 8v.01"></path>
      <path d="M13 12v.01"></path>
      <path d="M13 16v.01"></path>
    </svg>
  );
}

function InicioIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7l9 7v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z"></path>
      <path d="M9 22V12h6v10"></path>
    </svg>
  );
}

function NoticiasIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
      <line x1="3" y1="8" x2="21" y2="8"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="16" x2="21" y2="16"></line>
      <line x1="5" y1="20" x2="5" y2="20"></line>
      <line x1="9" y1="20" x2="9" y2="20"></line>
      <line x1="13" y1="20" x2="13" y2="20"></line>
      <line x1="17" y1="20" x2="17" y2="20"></line>
    </svg>
  );
}

function ForosIcon(props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke="white"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 3C2 1.9 2.9 1 4 1H20C21.1 1 22 1.9 22 3V16C22 17.1 21.1 18 20 18H6.83L4.83 20.83C4.41 21.31 3.68 21.11 3.68 20.5V18H4C2.9 18 2 17.1 2 16V3ZM4 4V16H20V4H4ZM6 14H18V6H6V14Z"
        fill="white"
      />
    </svg>
  );
}

function AyudaIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 17h.01" />
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
      <path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" />
    </svg>
  );
}

function CapacitacionesIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function PapeletasIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-file-text"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function UsuariosIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="8" cy="8" r="3" />
      <path d="M3 21v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2H3z" />
      <circle cx="16" cy="10" r="3" />
      <path d="M12 21v-1.5a4.5 4.5 0 0 1 4.5-4.5h1a4.5 4.5 0 0 1 4.5 4.5V21H12z" />
    </svg>
  );
}

function EmpresasIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="18" rx="1" ry="1"></rect>
      <rect x="14" y="7" width="7" height="14" rx="1" ry="1"></rect>
      <path d="M10 22v-2a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"></path>
      <line x1="6" y1="8" x2="8" y2="8"></line>
      <line x1="6" y1="12" x2="8" y2="12"></line>
      <line x1="6" y1="16" x2="8" y2="16"></line>
      <line x1="17" y1="10" x2="19" y2="10"></line>
      <line x1="17" y1="14" x2="19" y2="14"></line>
      <line x1="17" y1="18" x2="19" y2="18"></line>
    </svg>
  );
}

function PermisosIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-6 w-6 text-gray-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 2h8l5 5v10a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 3v4h4M9 13l2 2 4-4"
      />
    </svg>
  );
}

function VacacionesIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 text-gray-400"
    >
      <circle cx="18" cy="6" r="3" />
      <line x1="18" y1="1" x2="18" y2="3" />
      <line x1="18" y1="9" x2="18" y2="11" />
      <line x1="15" y1="6" x2="13" y2="6" />
      <line x1="21" y1="6" x2="23" y2="6" />
      <line x1="16.5" y1="4.5" x2="15.5" y2="3.5" />
      <line x1="16.5" y1="7.5" x2="15.5" y2="8.5" />
      <line x1="19.5" y1="4.5" x2="20.5" y2="3.5" />
      <line x1="19.5" y1="7.5" x2="20.5" y2="8.5" />
      <path d="M6 10C9 6 15 6 18 10H6z" />
      <line x1="12" y1="10" x2="12" y2="18" />
      <path d="M2 20h20" />
      <path d="M6 18a2 2 0 1 1 4 0" />
    </svg>
  );
}

function FaltasIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 text-gray-400"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
      <line x1="3" y1="8" x2="21" y2="8" />
      <line x1="8" y1="12" x2="16" y2="16" />
      <line x1="16" y1="12" x2="8" y2="16" />
    </svg>
  );
}

function TiempoIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      classNameclass="h-6 w-6 text-gray-400"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="12" x2="12" y2="8" />
      <line x1="12" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function PermisosSubIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 text-gray-400"
    >
      <rect x="4" y="3" width="16" height="18" rx="2" ry="2" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <path d="M8 14l2 2 4-4" />
    </svg>
  );
}

function SuspensionesIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="8" x2="16" y2="16" />
      <line x1="16" y1="8" x2="8" y2="16" />
    </svg>
  );
}

function VacantesIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6H4z" />
      <path d="M22 7h2v2h-2v2h-2V9h-2V7h2V5h2v2z" />
    </svg>
  );
}

function InventarioIcon(props) {
  return (
    <svg
      className="w-[25px] h-[25px] text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 13h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H20M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 13l2-9h12l2 9M9 7h6m-7 3h8"
      />
    </svg>
  );
}

function RHIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-file-user"
    >
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M15 18a3 3 0 1 0-6 0" />
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
      <circle cx="12" cy="13" r="2" />
    </svg>
  );
}

function CatalogoProductosIcon({ width = 24, height = 24, stroke = "white" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={stroke}
      strokeWidth="4"
    >
      {/* Portada del catálogo */}
      <rect x="20" y="20" width="60" height="60" rx="5" fill="none" />

      {/* Líneas simulando texto */}
      <line x1="30" y1="35" x2="70" y2="35" />
      <line x1="30" y1="45" x2="70" y2="45" />
      <line x1="30" y1="55" x2="50" y2="55" />

      {/* Pequeño ícono de caja en la portada */}
      <rect x="55" y="60" width="20" height="15" fill="none" />
      <line x1="55" y1="60" x2="65" y2="50" />
      <line x1="75" y1="60" x2="65" y2="50" />
    </svg>
  );
}

function UsuariosEmpresasIcon({ width = 35, height = 35, stroke = "white" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 48 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="translate(0, 0)">
        <path d="M18 21a8 8 0 0 0-16 0" />
        <circle cx="10" cy="8" r="5" />
        <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
      </g>
      <g transform="translate(24, 0)">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        <path d="M10 6h4" />
        <path d="M10 10h4" />
        <path d="M10 14h4" />
        <path d="M10 18h4" />
      </g>
    </svg>
  );
}

function SolicitudIcon(props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="white"
      strokeWidth="3"
    >
      <polygon points="10,30 50,60 90,30 90,80 10,80" fill="white" />
      <line x1="10" y1="30" x2="50" y2="10" />
      <line x1="90" y1="30" x2="50" y2="10" />
      <line x1="10" y1="80" x2="40" y2="55" />
      <line x1="90" y1="80" x2="60" y2="55" />

      <rect x="25" y="20" width="50" height="50" fill="none" />
      <line x1="30" y1="30" x2="70" y2="30" />
      <line x1="30" y1="40" x2="70" y2="40" />
      <line x1="30" y1="50" x2="70" y2="50" />
    </svg>
  );
}

function ConfigIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-square-terminal"
    >
      <path d="m7 11 2-2-2-2" />
      <path d="M11 13h4" />
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    </svg>
  );
}
