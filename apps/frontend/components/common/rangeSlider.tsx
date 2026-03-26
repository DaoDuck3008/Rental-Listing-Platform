"use client";

import React from "react";
import { Range, getTrackBackground } from "react-range";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  values: number[];
  onChange: (values: number[]) => void;
  formatLabel?: (value: number) => string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step,
  values,
  onChange,
  formatLabel = (val) => val.toLocaleString(),
}) => {
  return (
    <div className="flex flex-col items-center w-full px-2">
      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            className="h-9 flex w-full"
            style={props.style}
          >
            <div
              ref={props.ref}
              className="h-1.5 w-full rounded-full self-center"
              style={{
                background: getTrackBackground({
                  values,
                  colors: ["#ccc", "#137fec", "#ccc"],
                  min,
                  max,
                }),
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ index, props, isDragged }) => {
          const { key, ...thumbProps } = props;
          return (
            <div
              key={key}
              {...thumbProps}
              className="size-5 rounded-full bg-white border-2 border-primary shadow flex justify-center items-center outline-none focus:ring-2 ring-primary/20 group"
              style={{
                ...thumbProps.style,
              }}
            >
              <div
                className={`absolute -top-8 px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap transition-opacity ${
                  isDragged ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {formatLabel(values[index])}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default RangeSlider;
