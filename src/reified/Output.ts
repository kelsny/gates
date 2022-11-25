import { DraggingManager } from "../managers/DraggingManager";
import { SandboxManager } from "../managers/SandboxManager";
import { WiringManager } from "../managers/WiringManager";
import { html, Reified } from "./Reified";

export class Output extends Reified {
    readonly element;

    readonly #contextmenu = () => {
        SandboxManager.queueNewContext((prev) => [
            {
                "delete-output": {
                    label: "Delete output",
                    callback: () => {
                        this.detach();

                        WiringManager.wires.forEach((wire) => {
                            if (wire.to === this.element) wire.destroy();
                        });

                        this.element.classList.remove("activated");
                    },
                },
                "delete-connections": {
                    label: "Delete connections",
                    callback: () => {
                        WiringManager.wires.forEach((wire) => {
                            if (wire.to === this.element) wire.destroy();
                        });

                        this.element.classList.remove("activated");
                    },
                },
            },
            ...prev,
        ]);
    };

    constructor(pos: { x: number; y: number } = { x: 0, y: 0 }) {
        super();

        this.element = html`<button class="board-output">O</button>`;

        this.move(pos);
    }

    attach() {
        super.attach();

        this.element.addEventListener("contextmenu", this.#contextmenu);

        DraggingManager.watch(this.element);

        return this;
    }

    detach() {
        super.detach();

        this.element.removeEventListener("contextmenu", this.#contextmenu);

        DraggingManager.forget(this.element, true);

        return this;
    }
}
