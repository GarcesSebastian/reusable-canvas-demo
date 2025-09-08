"use client"

import { useApp } from "@/hooks/useApp";
import { useEffect, useRef, useState } from "react";
import { Test } from "@/test/index.test";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { render, setup } = useApp();
  const [savingProgress, setSavingProgress] = useState<{ p: number; state: boolean } | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<{ p: number; state: boolean } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      setup(canvasRef.current);
    }
  }, [canvasRef]);

  useEffect(() => {
    if (!render) return;

    const test = new Test(render);
    render.allowFps()

    const handleSetup = async () => {
      // Set callbacks BEFORE loadConfiguration
      render.onSavingProgress = (progress) => {
        console.log(progress);
        setSavingProgress(progress);
        setHasUnsavedChanges(progress.state);
        
        if (!progress.state) {
          setTimeout(() => {
            setSavingProgress(null);
          }, 1000);
        }
      }

      render.onLoadProgress = (progress) => {
        console.log(progress);
        setLoadingProgress(progress);
        
        if (!progress.state) {
          setTimeout(() => {
            setLoadingProgress(null);
          }, 1000);
        }
      }

      await render.loadConfiguration({
        history: true,
        zoom: true,
        pan: true,
        snap: true,
        transform: true,
        selection: true,
        save: "indexeddb",
        keywords: {
          undo: "ctrl+z",
          redo: "ctrl+y",
          save: "ctrl+s",
          duplicate: "ctrl+d",
          copy: "ctrl+c",
          cut: "ctrl+x",
          paste: "ctrl+v",
          delete: "backspace",
          selectAll: "ctrl+a",
          top: "ctrl+i",
          bottom: "ctrl+k",
          front: "ctrl+shift+i",
          back: "ctrl+shift+k",
        }
      })

      // test.start();
    }

    handleSetup()

    render.transformer.setConfig({
      borderWidth: 2,
      borderColor: "rgba(0, 255, 255, 0.5)",
      nodeColor: "rgba(0, 255, 255, 0.5)",
      nodeBorderWidth: 2,
      nodeBorderColor: "rgba(0, 255, 255, 0.5)",
      nodeSize: 10,
    })

    render.snapSmart.setConfig({
      color: "rgba(0, 255, 255, 0.5)",
      colorViewport: "rgba(255, 255, 255, 1)",
      lineWidth: 2,
      lineDash: [5, 5],
    })

    render.snapSmart.debug(true);

    return () => {
      render.stop();
    }
  }, [render]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
        return 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const RadialProgress = ({ progress, type }: { progress: { p: number; state: boolean }, type: 'saving' | 'loading' }) => {
    const percentage = Math.round(progress.p * 100);
    const circumference = 2 * Math.PI * 28;
    const strokeDashoffset = circumference - (progress.p * circumference);

    const colors = {
      saving: { active: "#10b981", complete: "#22c55e" },
      loading: { active: "#3b82f6", complete: "#06b6d4" }
    };

    const labels = {
      saving: "Guardando",
      loading: "Cargando"
    };

    return (
      <div className="fixed top-4 right-4 z-50 bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-lg p-4 flex flex-col items-center space-y-2 w-32">
        <div className="relative">
          <svg width="60" height="60" className="transform -rotate-90">
            <circle
              cx="30"
              cy="30"
              r="28"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="30"
              cy="30"
              r="28"
              stroke={progress.state ? colors[type].active : colors[type].complete}
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{`${percentage}%`}</span>
          </div>
        </div>
        <div className="text-center">
          <p className="font-semibold text-white">{labels[type]}</p>
          <p className="text-xs text-gray-300">
            {progress.state ? "En progreso..." : "Completado"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen">
      <canvas ref={canvasRef} className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-emerald-500"></canvas>
      
      {savingProgress && <RadialProgress progress={savingProgress} type="saving" />}
      {loadingProgress && <RadialProgress progress={loadingProgress} type="loading" />}
    </div>
  );
}
