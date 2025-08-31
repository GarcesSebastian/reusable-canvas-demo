"use client"

import { Render } from "@/library/Render";
import { createContext, useState } from "react";

interface AppContextProps {
    render: Render | null
    setup: (canvas: HTMLCanvasElement) => void
}

export const AppContext = createContext<AppContextProps | null>(null)

export const AppProvider = ({children}: {children: React.ReactNode}) => {
    const [render, setRender] = useState<Render | null>(null)

    const setup = (canvas: HTMLCanvasElement) => {
        const newRender = new Render(canvas);
        setRender(newRender);
    }
    return (
        <AppContext.Provider value={{ render, setup }}>
            {children}
        </AppContext.Provider>
    )
}