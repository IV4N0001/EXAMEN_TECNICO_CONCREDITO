import React from 'react';
import * as XLSX from 'xlsx-js-style';
import { FaFileExcel } from 'react-icons/fa';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
}

interface ExportDataToExcelProps {
  tasks: Task[];
}

const ExportDataToExcel: React.FC<ExportDataToExcelProps> = ({ tasks }) => {
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const exportToExcel = () => {
    // Definición de estilos
    const styles = {
      header: {
        fill: { fgColor: { rgb: "00ee9f" } },
        font: { bold: true, color: { rgb: "000000" }, sz: 14 },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      },
      title: {
        fill: { fgColor: { rgb: "dde635" } },
        font: { bold: true, color: { rgb: "000000" }, sz: 16 },
        alignment: { horizontal: "center", vertical: "center" }
      },
      columnHeader: {
        fill: { fgColor: { rgb: "3a3a3a" } },
        font: { bold: true, color: { rgb: "FFFFFF" } },
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      },
      completedTask: {
        fill: { fgColor: { rgb: "e8f5e9" } },
        font: { color: { rgb: "2e7d32" } }
      },
      pendingTask: {
        fill: { fgColor: { rgb: "ffebee" } },
        font: { color: { rgb: "c62828" } }
      },
      summary: {
        fill: { fgColor: { rgb: "dde635" } },
        font: { bold: true },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } }
        }
      },
      defaultCell: {
        border: {
          top: { style: "thin", color: { rgb: "dddddd" } },
          bottom: { style: "thin", color: { rgb: "dddddd" } },
          left: { style: "thin", color: { rgb: "dddddd" } },
          right: { style: "thin", color: { rgb: "dddddd" } }
        }
      }
    };

    // Preparar los datos con estilos
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    
    const data = [
      // Fila 1: Título principal
      [
        { v: "Reporte de Tareas", t: "s", s: styles.title },
        { v: "", t: "s", s: styles.title },
        { v: "", t: "s", s: styles.title },
        { v: "", t: "s", s: styles.title }
      ],
      // Fila 2: Espacio en blanco
      [{ v: "", t: "s" }, { v: "", t: "s" }, { v: "", t: "s" }, { v: "", t: "s" }],
      // Fila 3: Encabezados de columna
      [
        { v: "Tarea", t: "s", s: styles.columnHeader },
        { v: "Estado", t: "s", s: styles.columnHeader },
        { v: "Fecha Creación", t: "s", s: styles.columnHeader },
        { v: "Fecha Completado", t: "s", s: styles.columnHeader }
      ],
      // Filas de tareas
      ...tasks.map(task => [
        { v: task.title || 'Sin título', t: "s", s: styles.defaultCell },
        { 
          v: task.completed ? 'Completada' : 'Pendiente', 
          t: "s", 
          s: task.completed ? styles.completedTask : styles.pendingTask 
        },
        { v: formatDate(task.createdAt), t: "s", s: styles.defaultCell },
        { 
          v: task.completed ? formatDate(task.completedAt) : 'N/A', 
          t: "s", 
          s: styles.defaultCell 
        }
      ]),
      // Fila de espacio
      [{ v: "", t: "s" }, { v: "", t: "s" }, { v: "", t: "s" }, { v: "", t: "s" }],
      // Resumen
      [
        { v: "Resumen", t: "s", s: styles.summary },
        { v: "", t: "s", s: styles.summary },
        { v: "", t: "s", s: styles.summary },
        { v: "", t: "s", s: styles.summary }
      ],
      [
        { v: "Tareas Completadas", t: "s", s: styles.defaultCell },
        { v: completedTasks, t: "n", s: styles.defaultCell },
        { v: "", t: "s", s: styles.defaultCell },
        { v: "", t: "s", s: styles.defaultCell }
      ],
      [
        { v: "Tareas Pendientes", t: "s", s: styles.defaultCell },
        { v: totalTasks - completedTasks, t: "n", s: styles.defaultCell },
        { v: "", t: "s", s: styles.defaultCell },
        { v: "", t: "s", s: styles.defaultCell }
      ],
      [
        { v: "Total Tareas", t: "s", s: styles.defaultCell },
        { v: totalTasks, t: "n", s: styles.defaultCell },
        { v: "", t: "s", s: styles.defaultCell },
        { v: "", t: "s", s: styles.defaultCell }
      ]
    ];

    // Crear hoja de trabajo
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Añadir merges para celdas
    ws['!merges'] = [
      XLSX.utils.decode_range("A1:D1"), // Título principal
      XLSX.utils.decode_range("A6:D6"), // Resumen
      XLSX.utils.decode_range("A7:D7"),
      XLSX.utils.decode_range("A8:D8"),
      XLSX.utils.decode_range("A9:D9")
    ];

    // Ajustar anchos de columnas
    ws['!cols'] = [
      { wch: 40 }, // Columna Tarea
      { wch: 20 }, // Columna Estado
      { wch: 20 }, // Columna Fecha Creación
      { wch: 20 }  // Columna Fecha Completado
    ];

    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte Tareas");

    // Exportar archivo
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    XLSX.writeFile(wb, `Reporte_Tareas_${dateStr}.xlsx`, { bookType: 'xlsx' });
  };

  return (
    <button 
      onClick={exportToExcel}
      className="excel-button"
      title="Exportar a Excel"
    >
      <FaFileExcel size={20} />
    </button>
  );
};

export default ExportDataToExcel;