"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/publico/HeroSection";
import ServicioCard from "@/components/publico/ServicioCard";
import CalendarioFecha from "@/components/publico/CalendarioFecha";
import SlotsHorarios from "@/components/publico/SlotsHorarios";
import FormularioCliente from "@/components/publico/FormularioCliente";
import ConfirmacionTurno from "@/components/publico/ConfirmacionTurno";
import { getServicios, getDisponibilidad, crearTurnoPublico } from "@/lib/api";
import { Servicio, SlotHorario, Turno } from "@/types";
import {
  IconChevronRight,
  IconLoader,
  IconCalendar,
  IconClock,
  IconGear,
  IconCheck,
  IconWarning
} from "@/components/icons";

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

      <div className="flex-1 px-4 pt-4 pb-10">
        {/* Progress Bar — linear */}
        {paso < 5 && (
          <div className="max-w-md mx-auto mb-8 px-2">
            {/* Track + dots row */}
            <div className="relative flex items-center justify-between">
              {/* Background track */}
              <div className="absolute left-0 right-0 h-[2px] bg-[#1e1e1e]" style={{ top: "5px" }} />
              {/* Filled track */}
              <div
                className="absolute left-0 h-[2px] bg-[#CC0000] transition-all duration-300 ease-out"
                style={{ top: "5px", width: `${((paso - 1) / 3) * 100}%` }}
              />
              {/* Dots */}
              {[
                { step: 1, label: "SERVICIO" },
                { step: 2, label: "FECHA" },
                { step: 3, label: "HORA" },
                { step: 4, label: "DATOS" },
              ].map(({ step, label }) => (
                <div key={step} className="relative flex flex-col items-center gap-1.5 z-10">
                  <div
                    className={`w-[10px] h-[10px] rounded-full transition-all duration-300 flex items-center justify-center ${
                      paso > step
                        ? "bg-[#CC0000]"
                        : paso === step
                        ? "bg-[#CC0000]"
                        : "bg-[#2a2a2a]"
                    }`}
                  >
                    {paso > step && (
                      <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                        <path d="M1 2.5L2.8 4L6 1" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-[9px] font-bold tracking-wider uppercase"
                    style={{ color: paso >= step ? "#ffffff" : "#4a4a4a" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-md mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-rojo/10 border border-rojo/20 rounded-xl flex items-center gap-3 text-rojo text-sm animate-shake">
              <IconWarning size={18} />
              <span>{error}</span>
            </div>
          )}

          <div>
            {/* PASO 1: SERVICIOS */}
            {paso === 1 && (
              <div key="paso1" className="space-y-6 step-enter" style={{ overflowX: "hidden" }}>
                <div className="text-center">
                  <h2 className="text-xl font-black uppercase italic tracking-tight flex items-center justify-center gap-2">
                    <IconGear size={20} className="text-rojo" /> 1. Elegí el <span className="text-rojo">Servicio</span>
                  </h2>
                </div>

                {loadingServicios ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <IconLoader className="w-8 h-8 text-rojo" />
                  </div>
                ) : (
                  <div className="grid gap-[10px]">
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
                    Siguiente <IconChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 2: FECHA */}
            {paso === 2 && (
              <div key="paso2" className="space-y-8 step-enter" style={{ overflowX: "hidden" }}>
                <div className="text-center">
                  <h2 className="text-xl font-black uppercase italic tracking-tight flex items-center justify-center gap-2">
                    <IconCalendar size={20} className="text-rojo" /> 2. Elegí la <span className="text-rojo">Fecha</span>
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
                    Siguiente <IconChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3: HORARIO */}
            {paso === 3 && (
              <div key="paso3" className="space-y-8 step-enter" style={{ overflowX: "hidden" }}>
                <div className="text-center">
                  <h2 className="text-xl font-black uppercase italic tracking-tight flex items-center justify-center gap-2">
                    <IconClock size={20} className="text-rojo" /> 3. Elegí el <span className="text-rojo">Horario</span>
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
                    Siguiente <IconChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 4: DATOS */}
            {paso === 4 && (
              <div key="paso4" className="space-y-6 step-enter" style={{ overflowX: "hidden" }}>
                <div className="text-center">
                  <h2 className="text-xl font-black uppercase italic tracking-tight flex items-center justify-center gap-2">
                    <IconCheck size={20} className="text-rojo" /> 4. Tus <span className="text-rojo">Datos</span>
                  </h2>
                  <p className="text-texto-muted text-[10px] mt-2 uppercase tracking-[0.2em] font-bold">
                    {servicioSeleccionado?.nombre} · {new Date(fecha + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short" })} · {hora} hs
                  </p>
                </div>

                <FormularioCliente onSubmit={handleCrearTurno} loading={loadingSubmit} />

                <button onClick={volverPaso} className="w-full text-texto-muted text-sm font-bold uppercase tracking-widest mt-4">
                  Volver a Horarios
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
