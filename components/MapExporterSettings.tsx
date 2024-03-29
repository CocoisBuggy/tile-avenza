import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { styled, keyframes } from "@stitches/react";
import { violet, mauve, blackA } from "@radix-ui/colors";
import { MixerHorizontalIcon, Cross2Icon } from "@radix-ui/react-icons";
import SelectMapStyle, { MapStyle } from "./SelectMapStyle";

const slideUpAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideRightAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(-2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const slideDownAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(-2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideLeftAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const PopoverContent = styled(Popover.Content, {
  borderRadius: 4,
  padding: 20,
  width: 260,
  backgroundColor: "white",
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity",
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
  "&:focus": {
    boxShadow: `hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px, 0 0 0 2px ${violet.violet7}`,
  },
});

const PopoverArrow = styled(Popover.Arrow, {
  fill: "white",
});

const PopoverClose = styled(Popover.Close, {
  all: "unset",
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 25,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: violet.violet11,
  position: "absolute",
  top: 5,
  right: 5,

  "&:hover": { backgroundColor: violet.violet4 },
  "&:focus": { boxShadow: `0 0 0 2px ${violet.violet7}` },
});

const Flex = styled("div", { display: "flex" });

const IconButton = styled("button", {
  all: "unset",
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 35,
  width: 35,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: violet.violet11,
  backgroundColor: "white",
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  "&:hover": { backgroundColor: violet.violet3 },
  "&:focus": { boxShadow: `0 0 0 2px black` },
});
const Fieldset = styled("fieldset", {
  all: "unset",
  display: "flex",
  gap: 20,
  alignItems: "center",
});

const Label = styled("label", {
  fontSize: 13,
  color: violet.violet11,
  width: 75,
});

const Input = styled("input", {
  all: "unset",
  width: "100%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "1",
  borderRadius: 4,
  padding: "0 10px",
  fontSize: 13,
  lineHeight: 1,
  color: violet.violet11,
  boxShadow: `0 0 0 1px ${violet.violet7}`,
  height: 25,

  "&:focus": { boxShadow: `0 0 0 2px ${violet.violet8}` },
});

const Text = styled("p", {
  margin: 0,
  color: mauve.mauve12,
  fontSize: 15,
  lineHeight: "19px",
  fontWeight: 500,
});

export type MapSettings = {
  maxZoom: number;
  minZoom: number;
  showExports: boolean;
  mapStyle: MapStyle;
};

type Props = {
  mapSettings: MapSettings;
  onChange: (mapSettings: MapSettings) => void;
};

export const defaultMapSettings: MapSettings = {
  mapStyle: { url: "mapbox://styles/mapbox/satellite-v9" },
  maxZoom: 15,
  minZoom: 7,
  showExports: true,
};

export default function MapExporterSettings({ mapSettings, onChange }: Props) {
  function quickReg(k: keyof MapSettings) {
    return {
      id: k,
      value: mapSettings[k] as any,
      onChange: (v: any) => {
        onChange({ ...mapSettings, [k]: v });
      },
    };
  }

  function SimpleField({ k, label }: { k: keyof MapSettings; label: string }) {
    return (
      <Fieldset>
        <Label htmlFor={k}>{label}</Label>
        <Input {...quickReg(k)} />
      </Fieldset>
    );
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton aria-label="Update settings">
          <MixerHorizontalIcon />
        </IconButton>
      </Popover.Trigger>
      <Popover.Portal>
        <PopoverContent sideOffset={5}>
          <Flex css={{ flexDirection: "column", gap: 10 }}>
            <Text css={{ marginBottom: 10 }}>Exporter Settings</Text>

            <SimpleField k="maxZoom" label="Max. Zoom" />
            <SimpleField k="minZoom" label="Min. Zoom" />

            <SelectMapStyle
              mapStyle={mapSettings.mapStyle}
              onChange={(ns) => onChange({ ...mapSettings, mapStyle: ns })}
            />
          </Flex>
          <PopoverClose aria-label="Close">
            <Cross2Icon />
          </PopoverClose>
          <PopoverArrow />
        </PopoverContent>
      </Popover.Portal>
    </Popover.Root>
  );
}
