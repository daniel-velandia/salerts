import type { Permission } from "@/domain/models/auth/Permission";
import { Users, GraduationCap, FileText, Book, Settings, type LucideIcon } from "lucide-react";

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  permissions: Permission[];
}

export const menuItems: MenuItem[] = [
  {
    title: "Estudiantes",
    url: "/students",
    icon: Users,
    permissions: ["STUDENTS_WRITE", "STUDENTS_READ"],
  },
  {
    title: "Personal Académico",
    url: "/academic-staff",
    icon: GraduationCap,
    permissions: ["COORDINATORS_WRITE", "COORDINATORS_READ", "TEACHERS_WRITE", "TEACHERS_READ"],
  },
  {
    title: "Programas",
    url: "/programs",
    icon: GraduationCap,
    permissions: ["PROGRAMS_WRITE", "PROGRAMS_READ"],
  },
  {
    title: "Materias",
    url: "/subjects",
    icon: Book,
    permissions: ["SUBJECTS_WRITE", "SUBJECTS_READ"],
  },
  {
    title: "Calificaciones",
    url: "/grades",
    icon: FileText,
    permissions: ["GRADES_WRITE", "GRADES_READ"],
  },
  {
    title: "Configuración",
    url: "/configuration",
    icon: Settings,
    permissions: ["CONFIGURATION_WRITE"],
  },
  {
    title: "Grupos",
    url: "/groups",
    icon: Users,
    permissions: ["GROUPS_WRITE", "GROUPS_READ"],
  },
];
