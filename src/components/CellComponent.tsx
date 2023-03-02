import "./CellComponent.css";
import {
  MajorStar,
  MinorStar,
  MiniStar,
  Luckiness,
  Temple,
  DestinyBoard,
} from "fortel-ziweidoushu";
import * as fortelZiweiDouShu from "fortel-ziweidoushu";
import type { RuntimeContext } from "fortel-ziweidoushu";

const energyLevelSymbolMapping = new Map<number, string>();
energyLevelSymbolMapping.set(2, "⊕");
energyLevelSymbolMapping.set(1, "Ｏ");
energyLevelSymbolMapping.set(0, " ");
energyLevelSymbolMapping.set(-1, "▲");

const minorStarLuckSymbolMapping = new Map<Luckiness, string>();
minorStarLuckSymbolMapping.set(Luckiness.LUCK, "");
minorStarLuckSymbolMapping.set(Luckiness.NEUTRAL, "");
minorStarLuckSymbolMapping.set(Luckiness.BAD_LUCK, "▲");

function CellComponent(props: {
  cellModel: fortelZiweiDouShu.Cell;
  destinyBoardModel: DestinyBoard;
  runtimeContext: RuntimeContext | null;
  runtimeScope: number;
}) {
  const runtimeContext = props.runtimeContext;
  const tenYearStars =
    runtimeContext?.tenYear?.groundStars?.get(props.cellModel.ground) ?? [];
  const yearStars =
    runtimeContext?.year?.groundStars?.get(props.cellModel.ground) ?? [];
  const monthStars =
    runtimeContext?.month?.groundStars?.get(props.cellModel.ground) ?? [];
  const dayStars =
    runtimeContext?.day?.groundStars?.get(props.cellModel.ground) ?? [];

  const showTenYear = props.runtimeScope >= 1;
  const showYear = props.runtimeScope >= 2;
  const showMonth = props.runtimeScope >= 3;
  const showDay = props.runtimeScope >= 4;

  return (
    <div className="cell">
      <div className="cell-top-left">
        {props.destinyBoardModel.startControl.equals(props.cellModel.ground) ? (
          <div className="vertical">子斗</div>
        ) : null}
      </div>
      <div className="cell-top-middle">
        {props.cellModel.majorStars.map((majorStar: MajorStar) => {
          return (
            <div className="vertical left" key={majorStar.key}>
              <div style={{ width: "1em", height: "1.1em" }}>
                {energyLevelSymbolMapping.get(
                  props.destinyBoardModel.getMajorStarEnergyLevel(majorStar)
                )}
              </div>
              {majorStar.displayName +
                (props.destinyBoardModel.getMajorStarDerivative(majorStar)
                  ?.displayName ?? "")}
              {showTenYear &&
                runtimeContext?.tenYear?.starDerivativeMap?.get(majorStar) && (
                  <div className="ten-year-runtime">
                    {
                      runtimeContext?.tenYear?.starDerivativeMap?.get(majorStar)
                        ?.displayName
                    }
                  </div>
                )}
              {showYear &&
                runtimeContext?.year?.starDerivativeMap?.get(majorStar) && (
                  <div className="year-runtime">
                    {
                      runtimeContext?.year?.starDerivativeMap?.get(majorStar)
                        ?.displayName
                    }
                  </div>
                )}
              {showMonth &&
                runtimeContext?.month?.starDerivativeMap?.get(majorStar) && (
                  <div className="month-runtime">
                    {
                      runtimeContext?.month?.starDerivativeMap?.get(majorStar)
                        ?.displayName
                    }
                  </div>
                )}
              {showDay &&
                runtimeContext?.day?.starDerivativeMap?.get(majorStar) && (
                  <div className="day-runtime">
                    {
                      runtimeContext?.day?.starDerivativeMap?.get(majorStar)
                        ?.displayName
                    }
                  </div>
                )}
            </div>
          );
        })}
      </div>
      <div className="cell-top-right">
        <div style={{ float: "right", width: "6em", height: "1em" }}>
          {props.cellModel.minorStars.map((minorStar: MinorStar) => {
            return (
              <div className="vertical right" key={minorStar.key}>
                <div className="space-char-block">
                  {minorStarLuckSymbolMapping.get(minorStar.luck)}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ float: "right", width: "6em" }}>
          {props.cellModel.minorStars.map((minorStar: MinorStar) => {
            return (
              <div className="vertical right" key={minorStar.key}>
                {minorStar.displayName}
                <div className="space-char-block">
                  {props.destinyBoardModel.getMajorStarDerivative(minorStar)
                    ?.displayName ?? ""}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ float: "right", width: "6em" }}>
          {showTenYear &&
            tenYearStars.map((minorStar: MinorStar) => {
              return (
                <div
                  className="vertical right ten-year-runtime"
                  key={minorStar.key + "_ten"}
                >
                  {minorStar.displayName}
                  <div className="space-char-block">
                    {runtimeContext?.tenYear?.starDerivativeMap?.get(minorStar)
                      ?.displayName ?? ""}
                  </div>
                </div>
              );
            })}
          {showYear &&
            yearStars.map((minorStar: MinorStar) => {
              return (
                <div
                  className="vertical right year-runtime"
                  key={minorStar.key + "_year"}
                >
                  {minorStar.displayName}
                  <div className="space-char-block">
                    {runtimeContext?.year?.starDerivativeMap?.get(minorStar)
                      ?.displayName ?? ""}
                  </div>
                </div>
              );
            })}
          {showMonth &&
            monthStars.map((minorStar: MinorStar) => {
              return (
                <div
                  className="vertical right month-runtime"
                  key={minorStar.key + "_month"}
                >
                  {minorStar.displayName}
                  <div className="space-char-block">
                    {runtimeContext?.month?.starDerivativeMap?.get(minorStar)
                      ?.displayName ?? ""}
                  </div>
                </div>
              );
            })}
          {showDay &&
            dayStars.map((minorStar: MinorStar) => {
              return (
                <div
                  className="vertical right day-runtime"
                  key={minorStar.key + "_day"}
                >
                  {minorStar.displayName}
                  <div className="space-char-block">
                    {runtimeContext?.day?.starDerivativeMap?.get(minorStar)
                      ?.displayName ?? ""}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="cell-middle">
        {props.cellModel.miniStars.map((miniStar: MiniStar) => {
          return (
            <div className="vertical" key={miniStar.key}>
              {miniStar.displayName}
            </div>
          );
        })}
      </div>
      <div className="cell-bottom">
        <div className="cell-bottom-left">
          <div className="vertical">
            {props.cellModel.scholarStar.displayName}
          </div>
          <div className="vertical">
            {props.cellModel.yearGodStar.displayName}
          </div>
          <div className="vertical">
            {props.cellModel.leaderStar.displayName}
          </div>
        </div>
        <div className="cell-bottom-middle">
          <div>
            {props.cellModel.ageStart} - {props.cellModel.ageEnd}
          </div>
          <div>{props.cellModel.lifeStage.displayName}</div>
        </div>
        <div className="cell-bottom-right">
          <div className="vertical right">
            {props.cellModel.sky.displayName}
            {props.cellModel.ground.displayName}
          </div>
          {props.cellModel.temples
            .slice()
            .reverse()
            .map((temple: Temple) => {
              return (
                <div key={temple.key} className="vertical right">
                  {temple.displayName}
                </div>
              );
            })}
          {showTenYear &&
            runtimeContext?.tenYear?.cellGround?.equals(
              props.cellModel.ground
            ) && (
              <div
                key={"temple_ten"}
                className="vertical right ten-year-runtime"
              >
                {"限命"}
              </div>
            )}
          {showYear &&
            runtimeContext?.year?.cellGround?.equals(
              props.cellModel.ground
            ) && (
              <div key={"temple_year"} className="vertical right year-runtime">
                {"年命"}
              </div>
            )}
          {showMonth &&
            runtimeContext?.month?.cellGround?.equals(
              props.cellModel.ground
            ) && (
              <div
                key={"temple_month"}
                className="vertical right month-runtime"
              >
                {"月命"}
              </div>
            )}
          {showDay &&
            runtimeContext?.day?.cellGround?.equals(props.cellModel.ground) && (
              <div key={"temple_day"} className="vertical right day-runtime">
                {"日命"}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export { CellComponent };
