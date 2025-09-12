import { Render } from "reusable-canvas-preview";

export class RenderTest {
    private _render: Render;

    public constructor(render: Render) {
        this._render = render;
    }

    public start() {
        this._render.on("click", (e) => {});
        this._render.on("dblclick", (e) => {});
    }
}
    