"use client"

import { useState, useMemo } from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useSession,  signOut } from "next-auth/react";
import styles from '../../../../public/CSS/spinner.css';

export function Ventas() {
  const products = [
    {
      id: 1,
      name: "Camiseta de Algodón",
      description: "Camiseta de algodón suave y cómoda",
      price: 24.99,
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Pantalón de Lino",
      description: "Pantalón de lino ligero y fresco",
      price: 39.99,
      image: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Vestido de Seda",
      description: "Vestido de seda elegante y fluido",
      price: 59.99,
      image: "/placeholder.svg",
    },
    {
      id: 4,
      name: "Chaqueta de Cuero",
      description: "Chaqueta de cuero suave y duradera",
      price: 99.99,
      image: "/placeholder.svg",
    },
    {
      id: 5,
      name: "Zapatos de Gamuza",
      description: "Zapatos de gamuza cómodos y estilosos",
      price: 49.99,
      image: "/placeholder.svg",
    },
    {
      id: 6,
      name: "Bolso de Piel",
      description: "Bolso de piel elegante y resistente",
      price: 79.99,
      image: "/placeholder.svg",
    },
  ]
  const [sortBy, setSortBy] = useState("featured")
  const [filters, setFilters] = useState({
    category: [],
    price: {
      min: 0,
      max: Infinity,
    },
  })
  const handleSortChange = (value) => {
    setSortBy(value)
  }
  const handleFilterChange = (type, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }))
  }
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (filters.category.length > 0) {
          return filters.category.includes(product.category);
        }
        return true
      })
      .filter((product) => {
        return product.price >= filters.price.min && product.price <= filters.price.max
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "featured":
            return b.featured - a.featured
          case "low":
            return a.price - b.price
          case "high":
            return b.price - a.price
          case "newest":
            return new Date(b.date) - new Date(a.date);
          default:
            return 0
        }
      });
  }, [products, filters, sortBy])

  const [openSection, setOpenSection] = useState(null)
  
  const {data: session,status}=useSession ();
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }
  if (status=="loading") {
    return <p>cargando...</p>;
  }
  if (!session || !session.user) {
    return (
      window.location.href = "/",
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">No has iniciado sesión</p>
      </div>
    );
  }

  const ventas = "ventas";

  return (
    (<div className="container mx-auto px-4 py-8">
      <Link href={`/explorador_archivos?id=${ventas}`}>
        <Button variant="outline" size="sm" className="fixed h-9 gap-2 right-4 bottom-10 bg-blue-500 text-white p-2 rounded-lg shadow-lg">
          <div className="h-3.5 w-3.5" />
          <FolderIcon className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Explorador de archivos</span>
        </Button>
      </Link>
      <div
        className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">Explora nuestra selección de productos de moda.</p>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <ArrowUpDownIcon className="w-4 h-4 mr-2" />
                Ordenar por
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]" align="end">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={handleSortChange}>
                <DropdownMenuRadioItem value="featured">Destacados</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="newest">Más nuevos</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="low">Precio: Bajo a Alto</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="high">Precio: Alto a Bajo</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Accordion
            type="single"
            collapsible
            className="w-full md:w-auto"
            defaultValue="filters">
            <AccordionItem value="filters">
              <AccordionTrigger className="text-base">Filtros</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Categoría</h3>
                    <div className="grid gap-2">
                      <Label className="flex items-center gap-2 font-normal">
                        <Checkbox
                          onCheckedChange={(checked) => handleFilterChange("category", checked ? ["Camisetas"] : [])} />
                        Camisetas
                      </Label>
                      <Label className="flex items-center gap-2 font-normal">
                        <Checkbox
                          onCheckedChange={(checked) => handleFilterChange("category", checked ? ["Pantalones"] : [])} />
                        Pantalones
                      </Label>
                      <Label className="flex items-center gap-2 font-normal">
                        <Checkbox
                          onCheckedChange={(checked) => handleFilterChange("category", checked ? ["Vestidos"] : [])} />
                        Vestidos
                      </Label>
                      <Label className="flex items-center gap-2 font-normal">
                        <Checkbox
                          onCheckedChange={(checked) => handleFilterChange("category", checked ? ["Chaquetas"] : [])} />
                        Chaquetas
                      </Label>
                      <Label className="flex items-center gap-2 font-normal">
                        <Checkbox
                          onCheckedChange={(checked) => handleFilterChange("category", checked ? ["Zapatos"] : [])} />
                        Zapatos
                      </Label>
                      <Label className="flex items-center gap-2 font-normal">
                        <Checkbox
                          onCheckedChange={(checked) => handleFilterChange("category", checked ? ["Bolsos"] : [])} />
                        Bolsos
                      </Label>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Precio</h3>
                    <div />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="relative group">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View</span>
            </Link>
            <Card>
              <img
                src="/placeholder.svg"
                alt={product.name}
                width={300}
                height={300}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity" />
              <CardContent className="py-4">
                <h3 className="font-semibold tracking-tight">{product.name}</h3>
                <p className="text-sm leading-none text-muted-foreground">{product.description}</p>
                <h4 className="font-semibold">${product.price}</h4>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>)
  );
}

function ArrowUpDownIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </svg>)
  );
}

function FolderIcon(props) {
  return(
    <svg
      className="h-4 w-4 text-gray-600"
      fill="none"
      stroke="black"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8l-6-4z"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}
