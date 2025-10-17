import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

export async function analizarPDF(arrayBuffer) {
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const totalPaginas = pdf.numPages;
  const coincidencias = [];

  for (let i = 1; i <= totalPaginas; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    for (const item of textContent.items) {
      const texto = item.str?.trim().toLowerCase();
      if (texto && texto.includes("observacion")) {
        coincidencias.push({
          pagina: i,
          x: item.transform[4],
          y: item.transform[5],
          texto: item.str
        });
      }

    }
  }

  return { paginas: totalPaginas, coincidencias };
}
