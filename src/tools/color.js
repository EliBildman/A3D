const max = Math.pow(16, 6);

const multi = 10000000; // make small differences into big differences

const pastel = (color) => {
  const components = [
    color.substring(0, 2),
    color.substring(2, 4),
    color.substring(4, 6),
  ].map((comp) => {
    const comp_n = parseInt(comp, 16);
    return Math.floor((comp_n + 255) / 2); // average w white
  });
  return components.reduce((acc, comp) => {
    let s = comp.toString(16);
    if (s.length === 1) s = '0' + s;
    return acc + s;
  }, '');
};

const getContrastColor = (color) => {
  const components = [
    color.substring(0, 2),
    color.substring(2, 4),
    color.substring(4, 6),
  ];
  const sum = components.reduce((acc, cur) => acc + parseInt(cur, 16), 0);
  if (sum / 3 < 128) {
    return 'white';
  } else {
    return 'black';
  }
};

//turn a word (0-9, 'A'-'z') into a hex color value
export const wordToColor = (word) => {
  word = word.toLowerCase();
  const num = (parseInt(word, 36) * multi) % max;
  let hex = num.toString(16);

  while (hex.length < 6) hex = '0' + hex;

  const pastelColor = pastel(hex);
  const contrastColor = getContrastColor(pastelColor);

  return ['#' + pastelColor, contrastColor];
};
