import { PDFDocument, rgb } from "pdf-lib";

export async function firmarPDF(arrayBuffer, posiciones, firmasBase64 = []) {
  // dentro de firmarPDF
const pdfDoc = await PDFDocument.load(arrayBuffer.slice(0));

  const page = pdfDoc.getPage(posiciones[0].pagina - 1);
  const { height, width } = page.getSize();

  // Convertir firmas a imágenes
  const firmasEmbed = [];
  for (const base64 of firmasBase64) {
    const bytes = base64ToUint8(base64);
    const img = await pdfDoc.embedPng(bytes);
    firmasEmbed.push(img);
  }

  // Posición base (debajo de "OBSERVACION")
  const posYBase = posiciones[0].y - 100;
  const firmaWidth = 120;
  const firmaHeight = 60;

  // Coordenadas izquierda y derecha
  const xIzquierda = 60;
  const xDerecha = width - firmaWidth - 100;

  // Dibujar firma izquierda
  if (firmasEmbed[0]) {
    page.drawImage(firmasEmbed[0], {
      x: xIzquierda,
      y: posYBase,
      width: firmaWidth,
      height: firmaHeight,
    });
  }

  // Dibujar firma derecha
  if (firmasEmbed[1]) {
    page.drawImage(firmasEmbed[1], {
      x: xDerecha,
      y: posYBase,
      width: firmaWidth,
      height: firmaHeight,
    });
  }

  // Dibujar líneas y textos
  const textY = posYBase - 15;
  const lineY = textY + 5;
  const lineLength = 120;

  // Línea izquierda
  page.drawLine({
    start: { x: xIzquierda, y: lineY },
    end: { x: xIzquierda + lineLength, y: lineY },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  // Línea derecha
  page.drawLine({
    start: { x: xDerecha, y: lineY },
    end: { x: xDerecha + lineLength, y: lineY },
    thickness: 1,
    color: rgb(0, 0, 0),
  });


  page.drawText("Jefe de Compras", { x: xIzquierda + 15, y: textY - 14, size: 10 });
  page.drawText("Jefe Autorizado", { x: xDerecha + 25, y: textY - 14, size: 10 });

  return await pdfDoc.save();
}

function base64ToUint8(base64) {
  const arr = base64.split(",");
  const data = atob(arr[arr.length - 1]);
  const u8 = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) u8[i] = data.charCodeAt(i);
  return u8;
}
