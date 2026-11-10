# Higgsfield — vídeo da entrada (porta abre, câmara entra, acaba numa só cor)

Gerar **4 vídeos**: Noite e Dia × telemóvel (9:16) e desktop (16:9).

## Definições
- **Modelo:** Cinema Studio Video 3.0. Alternativas com frame inicial + final: Seedance 2.0 (modo *std*), MiniMax H3, Kling.
- **Start image:** a fotografia da fachada usada no site (Noite para os vídeos Noite, Dia para os vídeos Dia), na resolução mais alta disponível.
  Para 9:16, usar o recorte vertical centrado na porta, com a lanterna, a placa e os vasos dentro do enquadramento.
- O vídeo parte da fotografia sem a redesenhar: as janelas, a varanda, a faixa cinzenta, a placa, os vasos e as cores mantêm-se fiéis à imagem.
- **End image:** `end-noite-9x16.png` / `end-noite-16x9.png` (cor `#FCE7BC`) ou `end-dia-9x16.png` / `end-dia-16x9.png` (cor `#F2DEC4`).
- **Duração:** 6 s (fachada → porta → interior → cor) · **Resolução:** 1080p (4K se o plano permitir) · **Som:** desligado · **Genre:** auto.

## Prompt — Noite
Photorealistic architectural film shot at night. The first frame is exactly the start image: the façade of a historic
Portuguese townhouse. Locked, perfectly steady camera slowly dollies straight forward toward the arched stone doorway.
The façade, windows, balcony, lantern, brass plaque, plants and pots stay exactly as they are, with no warping and no redesign. The two dark walnut door leaves swing smoothly inward and open fully.
Warm golden light from the interior hallway grows and floods the doorway. The camera keeps moving forward through the doorway
into the soft warm light until the whole frame becomes one uniform, even warm colour, matching the end frame exactly.
Gentle, continuous, unhurried motion; no cuts; consistent lighting; no people.

## Prompt — Dia
Photorealistic architectural film shot in soft morning daylight. The first frame is exactly the start image: the façade of a
historic Portuguese townhouse. Locked, perfectly steady camera slowly dollies straight forward toward the arched stone doorway.
The façade, windows, balcony, lantern, brass plaque, plants and pots stay exactly as they are, with no warping and no redesign. The two walnut door leaves swing smoothly inward and open fully,
revealing a calm sunlit hallway with warm light. The camera keeps moving forward through the doorway into the warm light until the
whole frame becomes one uniform, even warm sand colour, matching the end frame exactly.
Gentle, continuous, unhurried motion; no cuts; consistent lighting; no people.

## Negative prompt (se o modelo tiver)
people, person, hands, animals, new text, changed signage, changed plaque, watermark, extra doors, extra windows, warped architecture,
bent lines, melting, morphing façade, flicker, camera shake, handheld, fast motion, zoom jump, cut, scene change, cartoon, illustration, oversaturated.

## Depois
Os 4 vídeos são convertidos para scroll (sequência de frames leve para iPhone e desktop) e ligados à animação atual.
