import holo_01 from "./../assets/holo/holo_01.png";
import holo_02 from "./../assets/holo/holo_02.png";
import holo_03 from "./../assets/holo/holo_03.png";
import holo_04 from "./../assets/holo/holo_04.png";
import holo_05 from "./../assets/holo/holo_05.png";
import holo_06 from "./../assets/holo/holo_06.png";
import holo_07 from "./../assets/holo/holo_07.png";
import holo_08 from "./../assets/holo/holo_08.png";
import holo_09 from "./../assets/holo/holo_09.png";
import holo_10 from "./../assets/holo/holo_10.png";

export const HOLO_BACKGROUND_OPTIONS = [
  { label: "Holo 01", value: holo_01 },
  { label: "Holo 02", value: holo_02 },
  { label: "Holo 03", value: holo_03 },
  { label: "Holo 04", value: holo_04 },
  { label: "Holo 05", value: holo_05 },
  { label: "Holo 06", value: holo_06 },
  { label: "Holo 07", value: holo_07 },
  { label: "Holo 08", value: holo_08 },
  { label: "Holo 09", value: holo_09 },
  { label: "Holo 10", value: holo_10 },
] as const;

export const HOLO_BACKGROUNDS = HOLO_BACKGROUND_OPTIONS.map(
  (item) => item.value,
);

export const getRandomHoloBackground = () =>
  HOLO_BACKGROUNDS[Math.floor(Math.random() * HOLO_BACKGROUNDS.length)];
