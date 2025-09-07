"use client"

import { useApp } from "@/hooks/useApp";
import { useEffect, useRef } from "react";
import { Test } from "@/test/index.test";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { render, setup } = useApp();

  useEffect(() => {
    if (canvasRef.current) {
      setup(canvasRef.current);
    }
  }, [canvasRef]);

  useEffect(() => {
    if (!render) return;

    const test = new Test(render);
    render.allowFps()

    render.loadConfiguration({
      history: true,
      zoom: true,
      pan: true,
      snap: true,
      transform: true,
      selection: true,
      save: "cookies",
      keywords: {
        undo: "ctrl+z",
        redo: "ctrl+y",
        save: "ctrl+s",
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

    // test.start();

    return () => {
      render.stop();
    }
  }, [render]);

  return (
    <div className="w-full min-h-screen">
      <canvas ref={canvasRef} className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-emerald-500"></canvas>
    </div>
  );
}
