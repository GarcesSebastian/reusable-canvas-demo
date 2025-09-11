"use client"

import { useApp } from "@/hooks/useApp";
import { useEffect, useRef, useState } from "react";
import { Test } from "@/test/index.test";
import { Rect } from "../../../reusable-canvas/dist/library/instances/_shapes/Rect";
import { RenderConfiguration } from "../../../reusable-canvas/dist/library/helpers/Render.config";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { render, setup } = useApp();
  const [cutting, setCutting] = useState(false);
  const [savingProgress, setSavingProgress] = useState<{ p: number; state: boolean } | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<{ p: number; state: boolean } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = () => {
    if (!render) return;
    
    render.exporter.startExportCut();
    setCutting(true);
  };

  const handleEndDownload = async () => {
    if (!render) return;

    const dimensions = render.exporter.getDimension();
    if (!dimensions) return;
    
    setIsExporting(true);
    
    try {
      await render.exporter.download({
        format: "png",
        quality: "high",
        name: "mi-lienzo",
        scale: 2,
        jpegQuality: 0.98,
        cutStart: dimensions.start,
        cutEnd: dimensions.end
      });
      
      render.exporter.endExportCut();
      setCutting(false);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. The image might be too large. Try reducing the quality or crop area.");
    } finally {
      setIsExporting(false);
    }
  };

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
        },
        properties: {
          minZoom: 0.1,
          maxZoom: 30,
          zoomFactor: 1.1
        }
      })

      console.log(RenderConfiguration.defaultProperties())

      render.transformer.setConfig({
        borderWidth: 2,
        borderColor: "#0c89e4",
        nodeBorderColor: "#0c89e4",
        nodeColor: "rgba(255, 255, 255, 1)",
        nodeBorderWidth: 1,
        nodeSize: 8,
        target: true,
        targetColor: "rgba(255, 255, 255, 1)",
        targetBackgroundColor: "#0c89e4",
        targetBorderWidth: 2,
        targetBorderColor: "#0c89e4",
        targetRadius: 10,
        targetFontSize: 12,
        targetFontFamily: "sans-serif",
        targetFontWeight: "500",
        targetFontStyle: "normal"
      })

      test.start();
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

  const ExportButton = () => {
    return (
      <div className="flex items-center space-x-2 z-50 fixed top-4 left-4">
        <button
          onClick={cutting ? handleEndDownload : handleDownload}
          className={`${
            isExporting 
              ? "bg-orange-600 cursor-not-allowed" 
              : cutting 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-colors duration-200 flex items-center space-x-2`}
          disabled={!render || isExporting}
        >
          {isExporting ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Exportando...</span>
            </>
          ) : (
            <>
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              <span>{cutting ? "Exportar" : "Seleccionar área"}</span>
            </>
          )}
        </button>
      
        {cutting && !isExporting && (
          <button
            onClick={() => {
              render?.exporter.abort()
              setCutting(false)
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-colors duration-200 flex items-center space-x-2"
            disabled={!render}
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
            <span>Cancelar</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen">
      <canvas ref={canvasRef} className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-emerald-500"></canvas>
      
      <ExportButton/>
      
      {savingProgress && <RadialProgress progress={savingProgress} type="saving" />}
      {loadingProgress && <RadialProgress progress={loadingProgress} type="loading" />}
    </div>
  );
}