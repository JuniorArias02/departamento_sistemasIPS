import { PDFDocument, rgb } from "pdf-lib";
import { URL_PATH } from "../../../const/api";

export async function firmarPDF(arrayBuffer, posiciones, firmasBase64 = [], options = { drawLayout: true }) {
  // dentro de firmarPDF
  const pdfDoc = await PDFDocument.load(arrayBuffer.slice(0));

  // Si no hay posiciones, no podemos firmar
  if (!posiciones || posiciones.length === 0) {
    console.error("No se encontraron posiciones para firmar (buscar palabra 'observacion')");
    return await pdfDoc.save();
  }

  const page = pdfDoc.getPage(posiciones[0].pagina - 1);
  const { height, width } = page.getSize();

  // Convertir firmas a imágenes (ahora son URLs o paths)
  const firmasEmbed = [];
  console.log("firmarPDF - firmasInput:", firmasBase64);

  for (const firmaPath of firmasBase64) {
    if (firmaPath) {
      try {
        // Construir URL completa si es necesario
        const url = firmaPath.startsWith("http") || firmaPath.startsWith("data:")
          ? firmaPath
          : `${URL_PATH}${firmaPath}`;

        console.log("Fetching firma URL:", url);
        const bytes = await fetchImage(url);
        console.log("Firma fetched successfully, bytes:", bytes.length);
        const img = await pdfDoc.embedPng(bytes);
        firmasEmbed.push(img);
      } catch (error) {
        console.error("Error embedding signature for path:", firmaPath, error);
        firmasEmbed.push(null);
      }
    } else {
      firmasEmbed.push(null);
    }
  }

  // Posición base (debajo de "OBSERVACION" - ajustado)
  // El analizador devuelve la posición Y desde abajo (PDF coordinate system usually starts at bottom-left)
  // Pero pdf-lib usa bottom-left origin por defecto también.
  // Ajustamos el offset según necesidad.
  const posYBase = posiciones[0].y - 120;
  const firmaWidth = 120;
  const firmaHeight = 60;

  // Coordenadas izquierda (Gerencia/Autorizado) y derecha (Compras)
  // Regla de Negocio: 
  // [0] = Compras (Derecha) -> Espera, el codigo anterior ponia [0] en Izquierda.
  // Vamos a alinear con la solicitud: "Gerente solo puede firmar si Compras ya firmó".
  // Normalmente: Elaboró (Compras) - Aprobó (Gerente).
  // Ajustemos: 
  // Slot 0 (Compras): Derecha (o Izquierda, depende diseño). Asumiremos Derecha por estandar "Elaboró".
  // Slot 1 (Gerente): Izquierda (o Derecha, "Aprobó").

  // REVISANDO codigo anterior:
  // xIzquierda = 60 (Jefe Autorizado) -> Slot 0
  // xDerecha = ... (Jefe de Compras) -> Slot 1

  // El usuario dijo: 
  // "Compras... visualiza... inserta firma"
  // "Gerente... inserta firma al lado"
  // Vamos a mantener:
  // Slot 0: Compras (Derecha - "Jefe de Compras")
  // Slot 1: Gerente (Izquierda - "Jefe Autorizado") 
  // NOTA: EL CODIGO ANTERIOR TENIA "Jefe Autorizado" en xIzquierda y "Jefe de Compras" en xDerecha.
  // Y usaba firmasEmbed[0] para xIzquierda. IMPLICA -> [0] era Gerente?
  // CAMBIO PARA QUE COINCIDA CON FLUJO LÓGICO DE ARRAYS:
  // Esperaré que el array de entrada sea [FirmaCompras, FirmaGerente].
  // FirmaCompras va a la Derecha (según etiqueta anterior).
  // FirmaGerente va a la Izquierda (según etiqueta anterior).

  const xIzquierda = 60; // Gerente / Autorizado
  const xDerecha = width - firmaWidth - 100; // Compras

  // Dibujar firma Compras (Slot 0 en input, Derecha en PDF)
  if (firmasEmbed[0]) {
    page.drawImage(firmasEmbed[0], {
      x: xDerecha,
      y: posYBase,
      width: firmaWidth,
      height: firmaHeight,
    });
  }

  // Dibujar firma Gerente (Slot 1 en input, Izquierda en PDF)
  if (firmasEmbed[1]) {
    page.drawImage(firmasEmbed[1], {
      x: xIzquierda,
      y: posYBase,
      width: firmaWidth,
      height: firmaHeight,
    });
  }

  // Dibujar líneas y textos (Layout)
  // Solo si drawLayout es true (usualmente solo la primera vez que se firma)
  if (options.drawLayout) {
    const textY = posYBase - 15;
    const lineY = textY + 5;
    const lineLength = 120;

    // Línea izquierda (Gerente)
    page.drawLine({
      start: { x: xIzquierda, y: lineY },
      end: { x: xIzquierda + lineLength, y: lineY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Línea derecha (Compras)
    page.drawLine({
      start: { x: xDerecha, y: lineY },
      end: { x: xDerecha + lineLength, y: lineY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    page.drawText("Jefe Autorizado", { x: xIzquierda + 15, y: textY - 14, size: 10 });
    page.drawText("Jefe de Compras", { x: xDerecha + 25, y: textY - 14, size: 10 });
  }

  return await pdfDoc.save();
}

async function fetchImage(url) {
  if (url.startsWith('data:')) {
    return base64ToUint8Array(url);
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
  const buffer = await res.arrayBuffer();
  return new Uint8Array(buffer);
}

function base64ToUint8Array(base64) {
  const arr = base64.split(',');
  const bstr = atob(arr[1] || arr[0]); // Handle raw base64 or data URI
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return u8arr;
}
