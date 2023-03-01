export const arrayRange = (start: number, stop: number, step: number = 1) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );

const ZERO_TO_NINE_CHINESE_NUMBER_CHARACTERS = "零一二三四五六七八九";

export const CHINESE_ONE_TO_TWELVE = [
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
];

const CHINESE_ONE_TO_NINE = CHINESE_ONE_TO_TWELVE.slice(0, 9);

export const CHINESE_DAYS_OF_MONTH = [
  ...CHINESE_ONE_TO_NINE.map((_) => "初" + _),
  "初十",
  ...CHINESE_ONE_TO_NINE.map((_) => "十" + _),
  "二十",
  ...CHINESE_ONE_TO_NINE.map((_) => "二十" + _),
  "三十",
];

const digit2ChiMap = (digit: number) => {
  return ZERO_TO_NINE_CHINESE_NUMBER_CHARACTERS.charCodeAt(digit);
};

export const digits2ChiMap = (num: number) => {
  const numStr = "" + num;
  return numStr
    .split("")
    .map((digitChar) => digit2ChiMap(+digitChar))
    .join();
};

export function strToNumOrNull(str: string | null | undefined): number | null {
  if (typeof str === "string") {
    if (str.trim() !== "") {
      return +str;
    } else {
      return null;
    }
  } else if (typeof str === "number") {
    return str;
  } else {
    return null;
  }
}

export function numToStrOrEmpty(num: number | null | undefined): string {
  if (typeof num === "number") {
    return "" + num;
  } else {
    return "";
  }
}
