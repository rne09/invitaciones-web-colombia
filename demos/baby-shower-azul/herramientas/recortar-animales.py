# -*- coding: utf-8 -*-
"""
Recorta la jirafa y el elefante del mosaico original y los deja con fondo
transparente, para usarlos como ilustracion suelta dentro de la invitacion.
"""
import os
import cv2
import numpy as np

BASE   = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")
ORIGEN = os.path.normpath(os.path.join(BASE, "mosaico-original.jpg"))

# recortes localizados a mano sobre el mosaico (x0, y0, x1, y1)
PIEZAS = {
    "jirafa.png":   (243, 330, 358, 518),
    "elefante.png": (112, 502, 272, 658),
}

ESCALA = 2  # el motivo es pequeno en el original; lo subimos para pantallas retina


def transparentar(bgr, claro=246, oscuro=200):
    gris = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY).astype(np.float32)
    alfa = np.clip((claro - gris) / float(claro - oscuro), 0, 1) * 255
    bgra = cv2.cvtColor(bgr, cv2.COLOR_BGR2BGRA)
    bgra[:, :, 3] = alfa.astype(np.uint8)
    return bgra


def main():
    img = cv2.imread(ORIGEN, cv2.IMREAD_COLOR)
    if img is None:
        raise SystemExit("No pude leer " + ORIGEN)

    for nombre, (x0, y0, x1, y1) in PIEZAS.items():
        trozo = img[y0:y1, x0:x1]
        trozo = cv2.resize(trozo, None, fx=ESCALA, fy=ESCALA,
                           interpolation=cv2.INTER_CUBIC)
        final = transparentar(trozo)
        destino = os.path.normpath(os.path.join(BASE, nombre))
        cv2.imwrite(destino, final)
        print("%-14s %dx%d  ->  %s" % (nombre, final.shape[1], final.shape[0], destino))


if __name__ == "__main__":
    main()
