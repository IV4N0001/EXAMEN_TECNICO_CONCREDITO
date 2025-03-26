import React, { useEffect, useState } from 'react';
import { fetchTasks, deleteTask, updateTask, createTask } from '../services/Todo';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaPlus, FaChevronLeft, FaChevronRight, FaKey, FaSignOutAlt, FaEnvelope } from 'react-icons/fa';
import '../assets/styles/Todo.css';
import ChangePassword from '../components/ChangePassword';
import ChangeEmail from '../components/ChangeEmail';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExportDataToExcel from '../components/ExportDataToExcel';

const Todo: React.FC = () => {
  const [tasks, setTasks] = useState<
    { id: number; title: string; completed: boolean; createdAt: string; completedAt: string | null }[]
  >([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { token, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const [searchType, setSearchType] = useState<'title' | 'createdAt'>('title'); // Estado para el tipo de búsqueda
  const navigate = useNavigate();

  const tasksPerPage = 8;
  const maxPageButtons = 5;

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTasks = async () => {
    if (token) {
      try {
        const tasks = await fetchTasks(token);
        setTasks(tasks);
      } catch (err: any) {
        console.error('Error al obtener las tareas:', err);

        if (err.message) {
          toast.error(String(err.message));
        } else {
          toast.error('Error al obtener las tareas. Inicia sesión de nuevo');
        }
      }
    }
  };

  useEffect(() => {
    getTasks();
  }, [token]);

  const handleAddTask = async () => {
    if (token && newTaskTitle.trim()) {
      try {
        const newTask = await createTask(newTaskTitle, token);
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setNewTaskTitle('');
        getTasks();
      } catch (err: any) {
        console.error('Error al agregar la tarea:', err);

        if (err.message) {
          toast.error(String(err.message));
        } else {
          toast.error('Error al agregar la tarea. Por favor, intenta de nuevo.');
        }
      }
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (token) {
      try {
        await deleteTask(id, token);
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      } catch (err: any) {
        console.error('Error al eliminar la tarea:', err);

        if (err.message) {
          toast.error(String(err.message));
        } else {
          toast.error('Error al eliminar la tarea. Por favor, intenta de nuevo.');
        }
      }
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    if (token) {
      try {
        const updatedTask = await updateTask(id, { completed: !completed }, token);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: updatedTask.completed,
                  completedAt: updatedTask.completedAt,
                }
              : task
          )
        );
      } catch (err: any) {
        console.error('Error al actualizar la tarea:', err);

        if (err.message) {
          toast.error(String(err.message));
        } else {
          toast.error('Error al actualizar la tarea. Por favor, intenta de nuevo.');
        }
      }
    }
  };

  const startEditing = (id: number, title: string) => {
    setEditingTaskId(id);
    setNewTitle(title);
  };

  const handleUpdateTitle = async (id: number) => {
    if (token && newTitle.trim()) {
      try {
        const updatedTask = await updateTask(id, { title: newTitle }, token);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  title: updatedTask.title,
                }
              : task
          )
        );
        setEditingTaskId(null);
        setNewTitle('');
      } catch (err: any) {
        console.error('Error al actualizar el nombre de la tarea:', err);

        if (err.message) {
          toast.error(String(err.message));
        } else {
          toast.error('Error al cambiar el titulo de la tarea. Por favor, intenta de nuevo.');
        }
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  }).filter(task => {
    if (!searchTerm) return true; // Si no hay término de búsqueda, mostrar todas las tareas

    const term = searchTerm.toLowerCase();

    switch (searchType) {
      case 'title':
        return task.title.toLowerCase().includes(term);
      case 'createdAt':
        return formatDate(task.createdAt).toLowerCase().includes(term);
      default:
        return true;
    }
  });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handlePageNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageRange = () => {
    const halfMaxButtons = Math.floor(maxPageButtons / 2);
    let start = Math.max(1, currentPage - halfMaxButtons);
    let end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="todo-container">
      <h1>Mis Tareas</h1>
      <div className="add-task">
        <input
          type="text"
          placeholder="Nueva tarea"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button onClick={handleAddTask}>
          <FaPlus />
        </button>
      </div>
  
      {/* Contenedor para la barra de búsqueda y los filtros */}
      <div className="search-and-filters">
        {/* Barra de búsqueda y combo box de tipo de búsqueda */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar tarea"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'title' | 'createdAt')}
          >
            <option value="title">Título</option>
            <option value="createdAt">Fecha de creación</option>
          </select>
        </div>
  
        {/* Filtro de estado (completadas/incompletas) */}
        <div className="filter-select-container">
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'completed' | 'incomplete')}
          >
            <option value="all">Todas</option>
            <option value="completed">Completadas</option>
            <option value="incomplete">No Completadas</option>
          </select>
        </div>
      </div>
  
      {/* Lista de tareas */}
      <ul className="task-list">
        {currentTasks.map((task) => (
          <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task.id, task.completed)}
            />
            {editingTaskId === task.id ? (
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={() => handleUpdateTitle(task.id)}
                onKeyPress={(e) => e.key === 'Enter' && handleUpdateTitle(task.id)}
                autoFocus
              />
            ) : (
              <span onClick={() => startEditing(task.id, task.title)}>{task.title}</span>
            )}
            <div className="task-dates">
              <small>Creada: {formatDate(task.createdAt)}</small>
              {task.completed && task.completedAt && (
                <small>Completada: {formatDate(task.completedAt)}</small>
              )}
            </div>
            <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
  
      {/* Paginación */}
      <div className="pagination">
        <button
          onClick={() => handlePageNavigation('prev')}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>
        {getPageRange().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => paginate(pageNumber)}
            className={currentPage === pageNumber ? 'active' : ''}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() => handlePageNavigation('next')}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>
  
      {/* Botones flotantes */}
      <div className="floating-buttons">
        <ExportDataToExcel tasks={tasks} />
        <button onClick={() => setShowChangeEmail(true)} title="Cambiar email">
          <FaEnvelope />
        </button>
        <button onClick={() => setShowChangePassword(true)}>
          <FaKey />
        </button>
        <button onClick={handleLogout}>
          <FaSignOutAlt />
        </button>
        
      </div>
  
      {/* Formulario flotante para cambiar la contraseña */}
      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}

      {showChangeEmail && (
        <ChangeEmail onClose={() => setShowChangeEmail(false)} />
      )}
      <ToastContainer />
    </div>
  );
};

export default Todo;