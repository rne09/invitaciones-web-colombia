# -*- coding: utf-8 -*-
"""
Convierte una imagen de patron ya repetido (por ejemplo un fondo de pantalla
descargado) en UN solo azulejo listo para usar como mosaico en la web.

Que hace:
  1. Detecta cada cuanto se repite el motivo, en horizontal y en vertical.
  2. Recorta exactamente un azulejo.
  3. Opcionalmente vuelve transparente el fondo blanco.
  4. Lo exporta a 1200x1200 px en PNG.

Uso:
    python hacer-tile.py imagen_original.jpg
    python hacer-tile.py imagen.jpg --salida ../assets/patron-toile.png
    python hacer-tile.py imagen.jpg --sin-transparencia
    python hacer-tile.py imagen.jpg --periodo 368x412   (si la deteccion falla)
"""
import os
import sys
import argparse

import cv2
import numpy as np


def periodo_en_eje(gris, eje):
    """Devuelve cada cuantos pixeles se repite la imagen a lo largo de un eje.
    eje=0 -> vertical (filas)   eje=1 -> horizontal (columnas)"""
    if eje == 0:
        largo = gris.shape[0]
    else:
        largo = gris.shape[1]

    # probamos desplazamientos entre el 12% y el 60% del lado
    minimo = max(24, int(largo * 0.12))
    maximo = int(largo * 0.60)

    mejor_d, mejor_error = None, None
    for d in range(minimo, maximo):
        if eje == 0:
            a = gris[:largo - d, :]
            b = gris[d:, :]
        else:
            a = gris[:, :largo - d]
            b = gris[:, d:]
        # error medio absoluto entre la imagen y ella misma desplazada
        error = float(np.mean(np.abs(a.astype(np.float32) - b.astype(np.float32))))
        if mejor_error is None or error < mejor_error:
            mejor_error, mejor_d = error, d

    return mejor_d, mejor_error


def quitar_fondo_blanco(bgr, umbral_claro=238, umbral_oscuro=205):
    """Convierte el blanco del papel en transparencia, dejando un degradado
    suave en los bordes del trazo para que no queden dentados."""
    gris = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY).astype(np.float32)
    # 255 (blanco puro) -> alfa 0 ; <= umbral_oscuro -> alfa 255
    alfa = (umbral_claro - gris) / float(umbral_claro - umbral_oscuro)
    alfa = np.clip(alfa, 0.0, 1.0) * 255.0
    bgra = cv2.cvtColor(bgr, cv2.COLOR_BGR2BGRA)
    bgra[:, :, 3] = alfa.astype(np.uint8)
    return bgra


def main():
    p = argparse.ArgumentParser()
    p.add_argument("imagen")
    p.add_argument("--salida", default=None)
    p.add_argument("--ancho", type=int, default=0,
                   help="ancho final en px; 0 = conservar el nativo del periodo")
    p.add_argument("--periodo", default=None, help="forzar periodo, formato ANCHOxALTO")
    p.add_argument("--sin-transparencia", action="store_true")
    p.add_argument("--desde", default="0,0", help="esquina de recorte: x,y")
    args = p.parse_args()

    if not os.path.isfile(args.imagen):
        print("ERROR: no existe", args.imagen)
        sys.exit(1)

    img = cv2.imread(args.imagen, cv2.IMREAD_COLOR)
    if img is None:
        print("ERROR: no pude leer la imagen")
        sys.exit(1)

    h, w = img.shape[:2]
    print("Imagen original: %dx%d" % (w, h))

    if args.periodo:
        pw, ph = [int(v) for v in args.periodo.lower().split("x")]
        print("Periodo forzado: %dx%d" % (pw, ph))
    else:
        gris = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gris = cv2.GaussianBlur(gris, (3, 3), 0)
        ph, err_v = periodo_en_eje(gris, 0)
        pw, err_h = periodo_en_eje(gris, 1)
        print("Periodo detectado: %dx%d  (error V=%.2f  H=%.2f)" % (pw, ph, err_v, err_h))
        if err_v > 12 or err_h > 12:
            print("AVISO: la deteccion no es fiable. Revisa el resultado o usa --periodo")

    x0, y0 = [int(v) for v in args.desde.split(",")]
    if x0 + pw > w or y0 + ph > h:
        print("ERROR: el azulejo se sale de la imagen. Ajusta --desde o --periodo")
        sys.exit(1)

    tile = img[y0:y0 + ph, x0:x0 + pw]

    # IMPORTANTE: el azulejo conserva su rectangulo completo (ancho x alto del
    # periodo). Recortarlo a cuadrado romperia la repeticion en un eje.
    if args.ancho and args.ancho != pw:
        escala = args.ancho / float(pw)
        nuevo = (args.ancho, max(1, int(round(ph * escala))))
        inter = cv2.INTER_AREA if escala < 1 else cv2.INTER_CUBIC
        tile = cv2.resize(tile, nuevo, interpolation=inter)
        print("Reescalado a %dx%d" % nuevo)
    else:
        print("Se conserva el tamano nativo %dx%d (sin reescalar)" % (pw, ph))

    if args.sin_transparencia:
        salida_def = "patron-toile.jpg"
        final = tile
    else:
        salida_def = "patron-toile.png"
        final = quitar_fondo_blanco(tile)

    destino = args.salida or os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                          "..", "assets", salida_def)
    destino = os.path.normpath(destino)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    cv2.imwrite(destino, final)
    print("Azulejo guardado en:", destino,
          "(%dx%d)" % (final.shape[1], final.shape[0]))

    # hoja de comprobacion: 3x3 repeticiones para ver si se notan las uniones
    alto_chico = max(1, int(round(240 * final.shape[0] / float(final.shape[1]))))
    chico = cv2.resize(final, (240, alto_chico), interpolation=cv2.INTER_AREA)
    if chico.shape[2] == 4:
        fondo = np.full((alto_chico, 240, 3), 250, dtype=np.uint8)
        a = chico[:, :, 3:4].astype(np.float32) / 255.0
        chico = (chico[:, :, :3] * a + fondo * (1 - a)).astype(np.uint8)
    prueba = np.tile(chico, (3, 3, 1))
    ruta_prueba = os.path.join(os.path.dirname(destino), "_prueba-mosaico.png")
    cv2.imwrite(ruta_prueba, prueba)
    print("Comprobacion 3x3 en:", ruta_prueba)


if __name__ == "__main__":
    main()
