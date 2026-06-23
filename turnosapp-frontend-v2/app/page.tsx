"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/publico/HeroSection";
import ServicioCard from "@/components/publico/ServicioCard";
import CalendarioFecha from "@/components/publico/CalendarioFecha";
import SlotsHorarios from "@/components/publico/SlotsHorarios";
import FormularioCliente from "@/components/publico/FormularioCliente";
import ConfirmacionTurno from "@/components/publico/ConfirmacionTurno";
import { getServicios, getDisponibilidad, crearTurnoPublico } from "@/lib/api";
import { Servicio, SlotHorario, Turno } from "@/types";
import { ChevronRight, Loader2, Calendar, Clock, LayoutGrid, UserCheck, AlertCircle } from "lucide-react";

export default function Home() {
  // Estados del flujo
  const [paso, setPaso] = useState(1);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [loadingDispo, setLoadingDispo] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Datos
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [slots, setSlots] = useState<SlotHorario[]>([]);
  const [turnoCreado, setTurnoCreado] = useState<Turno | null>(null);

  // Selección
  const [servicioId, setServicioId] = useState<number | null>(null);
  const [fecha, setFecha] = useState<string>("");
  const [hora, setHora] = useState<string>("");

  // Cargar servicios al inicio
  useEffect(() => {
    async function load() {
      try {
        const data = await getServicios();
        setServicios(data.filter(s => s.activo));
      } catch (error) {
        setError("No se pudieron cargar los servicios. Reintentá base de datos.");
      } finally {
        setLoadingServicios(false);
      }
    }
    load();
  }, []);

  // Cargar disponibilidad cuando cambia la fecha o el servicio
  useEffect(() => {
    if (servicioId && fecha) {
      async function loadDispo() {
        setLoadingDispo(true);
        setError(null);
        try {
          const data = await getDisponibilidad(servicioId!, fecha);
          setSlots(data);
        } catch (error) {
          setError("Error al cargar horarios disponibles.");
          setSlots([]);
        } finally {
          setLoadingDispo(false);
        }
      }
      loadDispo();
    }
  }, [servicioId, fecha]);

  const handleCrearTurno = async (datosCliente: any) => {
    setLoadingSubmit(true);
    setError(null);
    try {
      const payload = {
        servicioId,
        fecha,
        hora,
        ...datosCliente
      };
      const result = await crearTurnoPublico(payload);
      setTurnoCreado(result);
      setPaso(5); // Éxito
    } catch (err: any) {
      setError(err.message || "No se pudo reservar el turno. Por favor reintentá.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const siguientePaso = () => {
    setError(null);
    setPaso(p => p + 1);
  };

  const volverPaso = () => {
    setError(null);
    setPaso(p => p - 1);
  };

  const servicioSeleccionado = servicios.find(s => s.id === servicioId);

  // Si ya se creó el turno, mostrar solo confirmación (sin Hero)
  if (paso === 5 && turnoCreado && servicioSeleccionado) {
    return (
      <div className="flex flex-col min-h-screen bg-bg text-white px-4">
        <div className="max-w-md mx-auto w-full">
          <ConfirmacionTurno turno={turnoCreado} servicio={servicioSeleccionado} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg text-white pb-10">
      <HeroSection />

      <div className="flex-1 px-4 py-6">
        {/* Progress Bar */}
        {paso < 5 && (
          <div className="max-w-md mx-auto mb-8 flex items-center justify-between px-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500
                    ${paso >= i ? "bg-rojo text-white shadow-[0_0_15px_rgba(204,0,0,0.5)]" : "bg-surface-2 text-texto-muted"}
                  `}
                >
                  {i}
                </div>
                {i < 4 && (
                  <div className={`flex-1 h-[2px] mx-2 ${paso > i ? "bg-rojo" : "bg-surface-2"}`}></div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="max-w-md mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-rojo/10 border border-rojo/20 rounded-xl flex items-center gap-3 text-rojo text-sm animate-shake">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* PASO 1: SERVICIOS */}
            {paso === 1 && (
              <motion.div
                key="paso1"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-xl font-black uppercase italic tracking-tight flex items-center justify-center gap-2">
                    <LayoutGrid size={20} className="text-rojo" /> 1. Elegí el <span className="text-rojo">Servicio</span>
                  </h2>
                </div>

                {loadingServicios ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-rojo animate-spin" />
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {servicios.map((s) => (
                      <ServicioCard
                        key={s.id}
                        servicio={s}
                        seleccionado={servicioId === s.id}
                        onSelect={(id) => {
                          setServicioId(id);
                          setFecha("");
                          setHora("");
                        }}
                      />
                    ))}
                  </div>
                )}

                <div className="pt-4">
                  <button
                    disabled={!servicioId}
                    onClick={siguientePaso}
                    className={`
                      w-full h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all
                      ${servicioId
                        ? "bg-rojo text-white active:scale-95 shadow-lg shadow-rojo/30"
                        : "bg-surface-2 text-texto-muted cursor-not-allowed"}
                    `}
                  >
                    Siguiente <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* PASO 2: FECHA */}
            {paso === 2 && (
              <motion.div
                key="paso2"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-xl font-black uppercase italic tracking-tight flex items-center justify-center gap-2">
                    <Calendar size={20} className="text-rojo" /> 2. Elegí la <span className="text-rojo">Fecha</span>
                  </h2>
                  <p className="text-texto-muted text-[10px] mt-2 uppercase tracking-[0.2em] font-bold">
                    {servicioSeleccionado?.nombre} · {servicioSeleccionado?.duracion} min
                  </p>
                </div>

                <CalendarioFecha
                  fechaSeleccionada={fecha}
                  onSelect={(f) => { setFecha(f); setHora(""); }}
                />

                <div className="flex gap-4">
                  <button onClick={volverPaso} className="w-1/3 h-14 rounded-xl border border-borde font-bold text-texto-muted active:scale-95">
                    Volver
                  </button>
                  <button
                    disabled={!fecha}
                    onClick={siguientePaso}
                    className={`
                      flex-1 h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all
                      ${fecha
                        ? "bg-rojo text-white active:scale-95 shadow-lg shadow-rojo/30"
                        : "bg-surface-2 text-texto-muted cursor-not-allowed"}
                    `}
                  >
                    Siguiente <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* PASO 3: HORARIO */}
            {paso === 3 && (
              <motion.div
                key="paso3"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-xl font-black uppercase italic tracking-tight flex items-center justify-center gap-2">
                    <Clock size={20} className="text-rojo" /> 3. Elegí el <span className="text-rojo">Horario</span>
                  </h2>
                  <p className="text-texto-muted text-[10px] mt-2 uppercase tracking-[0.2em] font-bold">
                    {new Date(fecha + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                </div>

                <SlotsHorarios slots={slots} horaSeleccionada={hora} onSelect={setHora} loading={loadingDispo} />

                <div className="flex gap-4 pt-4">
                  <button onClick={volverPaso} className="w-1/3 h-14 rounded-xl border border-borde font-bold text-texto-muted active:scale-95">
                    Volver
                  </button>
                  <button
                    disabled={!hora}
                    onClick={siguientePaso}
                    className={`
                      flex-1 h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all
                      ${hora
                        ? "bg-rojo text-white active:scale-95 shadow-lg shadow-rojo/30"
                        : "bg-surface-2 text-texto-muted cursor-not-allowed"}
                    `}
                  >
                    Siguiente <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* PASO 4: DATOS */}
            {paso === 4 && (
              <motion.div
                key="paso4"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-xl font-black uppercase italic tracking-tight flex items-center justify-center gap-2">
                    <UserCheck size={20} className="text-rojo" /> 4. Tus <span className="text-rojo">Datos</span>
                  </h2>
                  <p className="text-texto-muted text-[10px] mt-2 uppercase tracking-[0.2em] font-bold">
                    {servicioSeleccionado?.nombre} · {new Date(fecha + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short" })} · {hora} hs
                  </p>
                </div>

                <FormularioCliente onSubmit={handleCrearTurno} loading={loadingSubmit} />

                <button onClick={volverPaso} className="w-full text-texto-muted text-sm font-bold uppercase tracking-widest mt-4">
                  Volver a Horarios
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
