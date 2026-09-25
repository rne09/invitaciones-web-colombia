"""Genera canciones instrumentales propias (sin derechos de autor) para las plantillas de muestra.

Uso: python herramientas/musica_libre.py <nombre> <salida.mp3>
Cada estilo cambia tonalidad, tempo, acordes e instrumento.
"""
import subprocess, sys, wave, os
import numpy as np

SR = 32000

NOTAS = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}


def freq(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def acorde(nombre, octava=4):
    raiz = nombre.rstrip("m7")
    menor = nombre.endswith("m") or nombre.endswith("m7")
    base = 12 * (octava + 1) + NOTAS[raiz]
    iv = [0, 3 if menor else 4, 7]
    if nombre.endswith("7"):
        iv.append(10 if menor else 11)
    return [base + i for i in iv]


def envolvente(n, ataque, caida):
    t = np.arange(n) / SR
    return np.minimum(1, t / ataque) * np.exp(-t * caida)


def instrumento(tipo, f, dur):
    n = int(SR * dur)
    t = np.arange(n) / SR
    if tipo == "cajita":      # caja musical
        o = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 4.02 * t) * np.exp(-t * 9)
        return o * envolvente(n, 0.004, 3.2)
    if tipo == "piano":
        o = sum(np.sin(2 * np.pi * f * k * t) * (0.55 ** (k - 1)) for k in range(1, 6))
        return o * envolvente(n, 0.006, 2.4) * 0.6
    if tipo == "marimba":
        o = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * f * 3.9 * t) * np.exp(-t * 20)
        return o * envolvente(n, 0.003, 6)
    if tipo == "arpa":
        o = sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, 5))
        return o * envolvente(n, 0.01, 1.6) * 0.7
    raise ValueError(tipo)


def pad(midis, dur, brillo):
    n = int(SR * dur)
    t = np.arange(n) / SR
    o = np.zeros(n)
    for m in midis:
        f = freq(m - 12)
        for det in (-0.12, 0.12):
            o += np.sin(2 * np.pi * (f + det) * t) + brillo * np.sin(2 * np.pi * 2 * (f + det) * t)
    env = np.minimum(1, t / 0.8) * np.minimum(1, (dur - t) / 0.8)
    return o * env * 0.05


def reverb(x):
    out = x.copy()
    for d, g in ((0.031, .45), (0.047, .4), (0.071, .35), (0.113, .3), (0.167, .25), (0.241, .2)):
        k = int(SR * d)
        y = np.zeros_like(x)
        y[k:] = x[:-k] * g
        out += y
    return out


ESTILOS = {
    # nombre: (acordes, bpm, instrumento, patron, brillo_pad, octava)
    "boda-floral":   (["D", "A", "Bm", "G"], 72, "piano", [0, 1, 2, 1, 3, 2, 1, 2], .2, 4),
    "boda-ivory":    (["F", "C", "Dm", "A#"], 66, "arpa", [0, 2, 1, 2, 3, 2, 1, 0], .15, 4),
    "boda-mesa":     (["G", "Em", "C", "D"], 80, "piano", [0, 2, 1, 3, 2, 1, 2, 3], .25, 4),
    "quince-rosa":   (["A", "F#m", "D", "E"], 88, "cajita", [0, 1, 2, 3, 2, 1, 2, 3], .3, 5),
    "quince-gala":   (["Am", "F", "C", "G"], 76, "piano", [0, 2, 3, 2, 1, 2, 3, 2], .35, 4),
    "baby-safari":   (["C", "G", "Am", "F"], 96, "marimba", [0, 1, 2, 1, 2, 3, 2, 1], .1, 5),
    "revelacion":    (["G", "D", "Em", "C"], 104, "marimba", [0, 2, 1, 2, 3, 2, 1, 2], .1, 5),
    "bautizo-nubes": (["E", "B", "C#m", "A"], 64, "cajita", [0, 1, 2, 1, 3, 2, 1, 2], .2, 5),
    "bautizo-capilla": (["C", "Am", "F", "G"], 60, "arpa", [0, 1, 2, 3, 2, 1, 2, 1], .2, 4),
    "comunion":      (["D", "Bm", "G", "A"], 62, "arpa", [0, 2, 1, 3, 1, 2, 3, 2], .25, 4),
    "cumple-fiesta": (["F", "Dm", "A#", "C"], 120, "marimba", [0, 1, 2, 3, 0, 2, 1, 3], .1, 5),
    "cumple-garden": (["G", "C", "Em", "D"], 92, "piano", [0, 2, 1, 2, 3, 1, 2, 1], .2, 4),
}


def componer(nombre, vueltas=6):
    acordes, bpm, inst, patron, brillo, octv = ESTILOS[nombre]
    corchea = 60 / bpm / 2
    compas = corchea * 8
    total = compas * len(acordes) * vueltas + 3
    mezcla = np.zeros(int(SR * total))
    rng = np.random.default_rng(len(nombre))
    for v in range(vueltas):
        for i, a in enumerate(acordes):
            notas = acorde(a, octv)
            inicio = (v * len(acordes) + i) * compas
            p = pad(acorde(a, octv - 1), compas + 0.8, brillo)
            j = int(SR * inicio)
            mezcla[j:j + len(p)] += p[: len(mezcla) - j]
            for k, idx in enumerate(patron):
                m = notas[idx % len(notas)] + (12 if idx >= len(notas) else 0)
                if v % 2 == 1 and k == 7:  # pequeña variación
                    m += 12
                o = instrumento(inst, freq(m), 1.8) * (0.8 + 0.2 * rng.random())
                j = int(SR * (inicio + k * corchea))
                mezcla[j:j + len(o)] += o[: len(mezcla) - j] * 0.22
            # bajo suave
            o = instrumento("piano", freq(notas[0] - 24), compas) * 0.35
            j = int(SR * inicio)
            mezcla[j:j + len(o)] += o[: len(mezcla) - j]
    mezcla = reverb(mezcla)
    n = len(mezcla)
    fade = int(SR * 2.5)
    mezcla[:int(SR * .3)] *= np.linspace(0, 1, int(SR * .3))
    mezcla[-fade:] *= np.linspace(1, 0, fade)
    mezcla /= np.max(np.abs(mezcla)) * 1.15
    return mezcla


if __name__ == "__main__":
    nombre, salida = sys.argv[1], sys.argv[2]
    audio = componer(nombre)
    wav = salida + ".wav"
    with wave.open(wav, "w") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((audio * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-b:a", "96k", salida], check=True)
    os.remove(wav)
    print("ok", salida)
