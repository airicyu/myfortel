import { useCallback, useState } from "react";
import { Button, Card, Segmented, Select } from "antd";
import { LunarDateInput } from "./LunarDateInput";
import { SolarDateInput } from "./SolarDateInput";
import { CalendarType, defaultCalendar, Gender } from "fortel-ziweidoushu";
import { LineSeparator } from "./LineSeparator";
import { ConfigDataStateType } from "../../view/dayBoards/stateMapper";

const genderOptions = [
  { label: "男", value: "M" },
  { label: "女", value: "F" },
];

export const DayDestinyConfigInputPanel = (
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
        }
        setCalendarType(CalendarType.SOLAR);
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
      if (solarYear && solarMonth && solarDay && gender) {
        props.updateConfig({
          calendarType: CalendarType.SOLAR,
          solarYear: solarYear,
          solarMonth: solarMonth,
          solarDay: solarDay,
          lunarYear: null,
          lunarMonth: null,
          lunarDay: null,
          leap: false,
          gender: gender === "F" ? Gender.F : Gender.M,
        });
      }
    } else if (calendarType === CalendarType.LUNAR) {
      if (lunarYear && lunarMonth && lunarDay && gender) {
        props.updateConfig({
          calendarType: CalendarType.LUNAR,
          lunarYear: lunarYear,
          lunarMonth: lunarMonth,
          lunarDay: lunarDay,
          leap: lunarLeap,
          solarYear: null,
          solarMonth: null,
          solarDay: null,
          gender: gender === "F" ? Gender.F : Gender.M,
        });
      }
    }
  }, [
    calendarType,
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
      <Button type="primary" onClick={build}>
        起盤
      </Button>
    </Card>
  );
};
