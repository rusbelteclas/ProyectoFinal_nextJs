"use client";

import { useEffect, useState } from "react";
import Modal from "react-modal";
import Slider from "react-slick";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from 'next/navigation';

export default function Page() {
  const [notes, setNotes] = useState(null);
  const [filter, setFilter] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supabase, setSupabase] = useState(null);
  const [sliderImages, setSliderImages] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const router = useRouter();


  useEffect(() => {
    const supabaseClient = createClient(
      "https://umnmtzhlkgrgcdgloyjd.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbm10emhsa2dyZ2NkZ2xveWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYzMDc3MDYsImV4cCI6MjAyMTg4MzcwNn0.MfVq1rAxqekqMdoCBoQDVjJwZKHxx_x-zqqFqls3Uwk"
    );
    setSupabase(supabaseClient);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!supabase) return;

        const { data, error } = await supabase.from("notes").select();
        if (error) {
          console.error("Error al cargar notas:", error);
          return;
        }
        
        const notesWithImages = await Promise.all(
          data.map(async (note) => {
            try {
              const { data: imagesData, error: imagesError } = await supabase
                .from("notes")
                .select("gallery")
                .eq("id", note.id)
                .single();

              if (imagesError) {
                console.error("Error al cargar imágenes:", imagesError);
                return note;
              } else {
                return { ...note, images: imagesData?.gallery || [] };
              }
            } catch (imagesError) {
              console.error(
                "Error inesperado al cargar imágenes:",
                imagesError
              );
              return note;
            }
          })
        );

        setNotes(notesWithImages);
      } catch (error) {
        console.error("Error inesperado al cargar notas:", error);
      }
    };

    fetchData();
  }, [supabase]);
  const loadNotes = async (filter) => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .ilike("title", `%${filter}%`);

      if (error) {
        console.error("Error al cargar notas:", error);
        return { error: "Error al cargar notas" };
      } else {
        return { data };
      }
    } catch (error) {
      console.error("Error inesperado al cargar notas:", error);
      return { error: "Error inesperado al cargar notas" };
    }
  };

  const saveNote = async (noteId, noteData) => {
    try {
      const action = noteId ? "update_note" : "add_note";
      const { data, error } = await supabase.rpc(action, noteData);

      if (error) {
        console.error(
          `Error al ${noteId ? "actualizar" : "agregar"} nota:`,
          error
        );
        return {
          error: `Error al ${noteId ? "actualizar" : "agregar"} nota`,
        };
      } else {
        return { data };
      }
    } catch (error) {
      console.error(
        `Error inesperado al ${noteId ? "actualizar" : "agregar"} nota:`,
        error
      );
      return {
        error: `Error inesperado al ${
          noteId ? "actualizar" : "agregar"
        } nota`,
      };
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errorList = {};
    if (!title.trim()) {
      errorList.title = "El título es obligatorio";
    }
    if (!content.trim()) {
      errorList.content = "El contenido es obligatorio";
    }

    setErrors(errorList);

    if (Object.keys(errorList).length > 0) {
      return;
    }

    const noteData = { title, content };

    try {
      const { error } = await saveNote(selectedNoteId, noteData);

      if (error) {
        console.error(
          `Error al ${selectedNoteId ? "actualizar" : "agregar"} nota:`,
          error
        );
        alert(
          `Error al ${
            selectedNoteId ? "actualizar" : "agregar"
          } nota. Por favor, inténtalo de nuevo.`
        );
      } else {
        alert(
          `Nota ${selectedNoteId ? "actualizada" : "agregada"} exitosamente`
        );
        setSelectedNoteId(null);
      }

      setTitle("");
      setContent("");

      const { data, error: loadError } = await loadNotes(filter);
      if (!loadError) {
        setNotes(data);
      } else {
        console.error(loadError);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error(
        `Error inesperado al ${
          selectedNoteId ? "actualizar" : "agregar"
        } nota:`,
        error
      );
    }
  };

  const openDetailsModal = async (noteId) => {
    console.log("Abriendo detalles para la nota con ID:", noteId);
    try {
      const note = notes.find((note) => note.id === noteId);
      console.log("Nota encontrada:", note);
      setSelectedNoteId(noteId);

      if (note) {
        const { data: imagesData, error: imagesError } = await supabase
          .from("notes")
          .select("gallery")
          .eq("id", noteId)
          .single();

        if (imagesError) {
          console.error("Error al cargar imágenes:", imagesError);
          return;
        }

        setSliderImages(imagesData?.gallery || []);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error inesperado al abrir detalles:", error);
    }
  };

  const handleDelete = async (noteId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta nota?"
    );

    if (confirmDelete) {
      const { error } = await supabase.rpc("delete_note", { id: noteId });

      if (error) {
        console.error(error);
        alert("Error al eliminar la nota. Por favor, inténtalo de nuevo.");
      } else {
        alert("Nota eliminada exitosamente");
        const { data, error } = await loadNotes(filter);
        if (!error) {
          setNotes(data);
        } else {
          console.error(error);
        }
      }
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="font-bold text-center text-4xl mb-8 text-green-600">
        Notitas
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-blue-600">
            Listado de Notas
          </h2>
          <input
            type="text"
            placeholder="Filtrar por título..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-3 mb-6 text-black"
          />
          <ul>
            {notes &&
              notes.map((note) => (
                <li key={note.id} className="mb-6 border p-4 rounded">
                  <h3 className="text-xl font-bold mb-3 text-blue-900">
                    {note.title}
                  </h3>
                  <p className="text-gray-700">{note.content}</p>
                  <div className="mt-4 flex items-center">
                    <button
                      onClick={() => handleEdit(note.id)}
                      className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        openDeleteModal();
                        setSelectedNoteId(note.id);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => openDetailsModal(note.id)}
                      className="bg-green-500 text-white px-4 py-2 ml-2 rounded"
                    >
                      Ver Detalles
                    </button>
                  </div>
                  {selectedNoteId === note.id && sliderImages.length > 0 && (
                    <div className="mt-4">
                      <h2 className="text-2xl font-bold mb-2 text-blue-600">
                        Detalles de la Nota
                      </h2>
                      <Slider>
                        {sliderImages.map((image, index) => (
                          <div
                            key={index}
                            className="w-[300px] 
                          h-[400px] bg-gray-200 
                          p-4 border rounded-md"
                          >
                            <img
                              src={image.url}
                              alt={image.description || `Imagen ${index + 1}`}
                              className="mb-2"
                              style={{ maxWidth: "100%", height: "auto" }}
                            />
                            <p className="text-gray-700">
                              {image.description || `Imagen ${index + 1}`}
                            </p>
                          </div>
                        ))}
                      </Slider>
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            setIsModalOpen(false);
                            setSelectedNoteId(null);
                          }}
                          className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                          Cerrar Detalles
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6 text-green-600">
            {selectedNoteId ? "Actualizar Nota" : "Agregar Nueva Nota"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Título</label>
              <input
                name="title"
                placeholder="Título de la nota"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-3 w-full text-black"
              />
              {errors.title && <p className="text-red-500">{errors.title}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Contenido
              </label>
              <textarea
                name="content"
                placeholder="Contenido de la nota"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border p-3 w-full h-32 text-black"
              />
              {errors.content && (
                <p className="text-red-500">{errors.content}</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-3 rounded"
            >
              {selectedNoteId ? "Actualizar Nota" : "Agregar Nota"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded mt-4 ml-2"
            >
              Cerrar Sesión
            </button>
          </form>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Editar Nota"
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="text-3xl font-bold mb-6 text-green-600">Editar Nota</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Título</label>
            <input
              name="title"
              placeholder="Título de la nota"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 w-full text-black"
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Contenido
            </label>
            <textarea
              name="content"
              placeholder="Contenido de la nota"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border p-3 w-full h-32 text-black"
            />
            {errors.content && <p className="text-red-500">{errors.content}</p>}
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded"
          >
            Actualizar Nota
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Confirmar Eliminación"
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="text-3xl font-bold mb-6 text-red-600">
          Confirmar Eliminación
        </h2>
        <p className="text-gray-700">
          ¿Estás seguro de que deseas eliminar esta nota?
        </p>
        <div className="mt-6 flex">
          <button
            onClick={() => {
              handleDelete(selectedNoteId);
              closeDeleteModal();
            }}
            className="bg-red-500 text-white px-6 py-3 rounded mr-4"
          >
            Sí, Eliminar
          </button>
          <button
            onClick={closeDeleteModal}
            className="bg-gray-500 text-white px-6 py-3 rounded"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}
