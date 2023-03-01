import { useCallback, useState } from "react";
import { Button, Card, Segmented, Select } from "antd";
import { LunarDateInput } from "./LunarDateInput";
import { SolarDateInput } from "./SolarDateInput";
import { CalendarType, defaultCalendar, Gender } from "fortel-ziweidoushu";
import { LineSeparator } from "./LineSeparator";
import { ConfigDataStateType } from "../../view/buildBoard/stateMapper";

const bornTimeOptions = [
  { label: "早子 (00:00am-00:59am)", value: 0 },
  { label: "丑 (01:00am-02:59am)", value: 1 },
  { label: "寅 (03:00am-04:59am)", value: 2 },
  { label: "卯 (05:00am-06:59am)", value: 3 },
  { label: "辰 (07:00am-08:59am)", value: 4 },
  { label: "巳 (09:00am-10:59am)", value: 5 },
  { label: "午 (11:00am-12:59pm)", value: 6 },
  { label: "未 (13:00pm-14:59pm)", value: 7 },
  { label: "申 (15:00pm-16:59pm)", value: 8 },
  { label: "酉 (17:00pm-18:59pm)", value: 9 },
  { label: "戌 (19:00pm-20:59pm)", value: 10 },
  { label: "亥 (21:00pm-22:59pm)", value: 11 },
  { label: "夜子 (23:00pm-23:59pm)", value: 12 },
];

const configTypeOptions = [
  { label: "地盤", value: 0 },
  { label: "天盤", value: 1 },
  { label: "人盤", value: 2 },
];

const genderOptions = [
  { label: "男", value: "M" },
  { label: "女", value: "F" },
];

export const DestinyConfigInputPanel = (
  props: ConfigDataStateType & {
    updateConfig: (dataState: ConfigDataStateType) => void;
  }
) => {
  const [calendarType, setCalendarType] = useState<CalendarType>(
    props.calendarType ?? CalendarType.LUNAR
  );

  const [lunarYear, setLunarYear] = useState<number | null>(
    props.lunarYear ?? 1990
  );
  const [lunarMonth, setLunarMonth] = useState<number | null>(
    props.lunarMonth ?? 1
  );
  const [lunarDay, setLunarDay] = useState<number | null>(props.lunarDay ?? 1);
  const [lunarLeap, setLunarLeap] = useState<boolean>(props.leap ?? false);

  const [solarYear, setSolarYear] = useState<number | null>(
    props.solarYear ?? 1990
  );
  const [solarMonth, setSolarMonth] = useState<number | null>(
    props.solarMonth ?? 1
  );
  const [solarDay, setSolarDay] = useState<number | null>(props.solarDay ?? 1);

  const [bornTime, setBornTime] = useState<number | null>(
    props.bornTime ?? null
  );

  const [configType, setConfigType] = useState<number | null>(
    props.configType ?? 1
  );
  const [gender, setGender] = useState<string | null>(props.gender ?? null);

  const onChangeCalendarType = useCallback(
    (value: string | number) => {
      if (calendarType === CalendarType.LUNAR && value === CalendarType.SOLAR) {
        if (lunarYear && lunarMonth && lunarDay) {
          try {
            const solarDate = defaultCalendar.lunar2solar(
              lunarYear,
              lunarMonth,
              lunarDay,
              lunarLeap
            );
            if (solarDate) {
              setSolarYear(solarDate.solarYear);
              setSolarMonth(solarDate.solarMonth);
              setSolarDay(solarDate.solarDay);
            }
          } catch (e) {
            console.debug("convert date error", e);
          }
          setCalendarType(CalendarType.SOLAR);
        }
      } else if (
        calendarType === CalendarType.SOLAR &&
        value === CalendarType.LUNAR
      ) {
        try {
          if (solarYear && solarMonth && solarDay) {
            const lunarDate = defaultCalendar.solar2lunar(
              solarYear,
              solarMonth,
              solarDay
            );
            if (lunarDate) {
              setLunarYear(lunarDate.lunarYear);
              setLunarMonth(lunarDate.lunarMonth);
              setLunarDay(lunarDate.lunarDay);
              setLunarLeap(lunarDate.isLeapMonth);
            }
          }
        } catch (e) {
          console.debug("convert date error", e);
        }
        setCalendarType(CalendarType.LUNAR);
      }
    },
    [
      calendarType,
      lunarDay,
      lunarLeap,
      lunarMonth,
      lunarYear,
      solarDay,
      solarMonth,
      solarYear,
    ]
  );

  const build = useCallback(() => {
    if (calendarType === CalendarType.SOLAR) {
      if (
        solarYear &&
        solarMonth &&
        solarDay &&
        typeof bornTime === "number" &&
        typeof configType === "number" &&
        gender
      ) {
        props.updateConfig({
          calendarType: CalendarType.SOLAR,
          solarYear: solarYear,
          solarMonth: solarMonth,
          solarDay: solarDay,
          lunarYear: null,
          lunarMonth: null,
          lunarDay: null,
          leap: false,
          bornTime,
          configType,
          gender: gender === "F" ? Gender.F : Gender.M,
        });
      }
    } else if (calendarType === CalendarType.LUNAR) {
      if (
        lunarYear &&
        lunarMonth &&
        lunarDay &&
        typeof bornTime === "number" &&
        typeof configType === "number" &&
        gender
      ) {
        props.updateConfig({
          calendarType: CalendarType.LUNAR,
          lunarYear: lunarYear,
          lunarMonth: lunarMonth,
          lunarDay: lunarDay,
          leap: lunarLeap,
          solarYear: null,
          solarMonth: null,
          solarDay: null,
          bornTime,
          configType,
          gender: gender === "F" ? Gender.F : Gender.M,
        });
      }
    }
  }, [
    bornTime,
    calendarType,
    configType,
    gender,
    lunarDay,
    lunarLeap,
    lunarMonth,
    lunarYear,
    props,
    solarDay,
    solarMonth,
    solarYear,
  ]);

  return (
    <Card title="命盤設定" style={{ width: 600 }}>
      {"性別: "}
      <div className="inline-block">
        <Select
          placeholder=""
          onChange={setGender}
          options={genderOptions}
          defaultValue={gender}
          style={{ width: 60 }}
        />
      </div>
      <LineSeparator />

      <div>
        <Segmented
          options={[
            { label: "農曆", value: CalendarType.LUNAR },
            { label: "西曆", value: CalendarType.SOLAR },
          ]}
          defaultValue={calendarType}
          onChange={onChangeCalendarType}
        />
        <div
          className="inline-block"
          style={{ paddingLeft: 20, paddingRight: 0 }}
        >
          <div className={calendarType !== CalendarType.LUNAR ? "hide" : ""}>
            <LunarDateInput
              year={lunarYear}
              month={lunarMonth}
              day={lunarDay}
              leap={lunarLeap}
              onChangeYear={setLunarYear}
              onChangeMonth={setLunarMonth}
              onChangeDay={setLunarDay}
              onChangeLeap={setLunarLeap}
            />
          </div>

          <div className={calendarType !== CalendarType.SOLAR ? "hide" : ""}>
            <SolarDateInput
              year={solarYear}
              month={solarMonth}
              day={solarDay}
              onChangeYear={setSolarYear}
              onChangeMonth={setSolarMonth}
              onChangeDay={setSolarDay}
            />
          </div>
        </div>
      </div>
      <LineSeparator />
      <div>
        <div className="inline-block">
          {"時辰: "}
          <Select
            placeholder="時辰"
            onChange={setBornTime}
            options={bornTimeOptions}
            defaultValue={bornTime}
            style={{ width: 200 }}
          />
        </div>

        <div
          className="inline-block"
          style={{ paddingLeft: 20, paddingRight: 0 }}
        ></div>

        {"盤: "}
        <div className="inline-block">
          <Select
            placeholder="盤"
            onChange={setConfigType}
            options={configTypeOptions}
            defaultValue={configType}
            style={{ width: 80 }}
          />
        </div>

        <div
          className="inline-block"
          style={{ paddingLeft: 20, paddingRight: 0 }}
        ></div>
      </div>
      <LineSeparator />
      <Button type="primary" onClick={build}>
        起盤
      </Button>
    </Card>
  );
};
