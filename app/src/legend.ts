import { COLOR_11, COLOR_9_11, COLOR_NADOBY, COLOR_RANY, createClusterElement } from "./addGraveyardsLayer";

/** Create a legend content in .modal-content of #legend modal. */
export function createLegendContent(): void {
    const legendContent = document.querySelector("#legend .modal-content");
    if (!(legendContent instanceof HTMLElement)) throw new Error("legendContent is not an HTMLElement");
    legendContent.innerHTML = `
    <div class="legend-row">
        <div class="canvas">
        </div>
        <div>
            shluk archeologických lokalit
            <div class="small-info">barvy = relativní četnosti kategorií lokalit uvedených níže</div>
            <div class="small-info">číslo = počet lokalit v shluku</div>
        </div>
    </div>
    <div class="legend-row">
        <div class="legend-point" style="background:${COLOR_9_11}"></div>
        <div>pohřebiště 9. až 11. století</div>
    </div>
    <div class="legend-row">
        <div class="legend-point" style="background:${COLOR_11}"></div>
        <div>pohřebiště 11. století</div>
    </div>
    <div class="legend-row">
        <div class="legend-point" style="background:${COLOR_RANY}"></div>
        <div>další pohřebiště raného středověku</div>
    </div>
    <div class="legend-row">
        <div class="legend-point" style="background:${COLOR_NADOBY}"></div>
        <div>nálezy nádob (pravděpodobné pohřebiště)</div>
    </div>`
    legendContent.querySelector(".canvas")?.append(createClusterElement(42, 20, 14, 6, 10));
}