import React from "react";
import * as Select from "@radix-ui/react-select";
import { styled } from "@stitches/react";
import { violet, mauve, blackA } from "@radix-ui/colors";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

export type MapStyle = { url: string };

export type Props = {
  onChange: (c: MapStyle) => void;
  mapStyle: MapStyle;
};

/**
 * Select from one of https://docs.mapbox.com/api/maps/styles/
 * */
export const SelectMapStyle = (props: Props) => (
  <Select.Root onValueChange={(e) => props.onChange({ url: e })}>
    <SelectTrigger aria-label="Map Style">
      <Select.Value placeholder="Choose a Map Style" />
      <SelectIcon>
        <ChevronDownIcon />
      </SelectIcon>
    </SelectTrigger>
    <Select.Portal>
      <SelectContent>
        <SelectScrollUpButton>
          <ChevronUpIcon />
        </SelectScrollUpButton>
        <SelectViewport>
          <Select.Group>
            <SelectLabel>Satellite Views</SelectLabel>
            <SelectItem value="mapbox://styles/mapbox/satellite-v9">
              Satellite
            </SelectItem>
            <SelectItem value="mapbox://styles/mapbox/satellite-streets-v11">
              Satellite + Streets
            </SelectItem>
          </Select.Group>

          <SelectSeparator />
          <Select.Group>
            <SelectLabel>Topo</SelectLabel>
            <SelectItem value="mapbox://styles/mapbox/outdoors-v11">
              Outdoors
            </SelectItem>
          </Select.Group>
          <SelectSeparator />

          <Select.Group>
            <SelectLabel>Non - Satellite</SelectLabel>
            <SelectItem value="mapbox://styles/mapbox/navigation-day-v1">
              Nav Day
            </SelectItem>
            <SelectItem value="mapbox://styles/mapbox/navigation-night-v1">
              Nav Night
            </SelectItem>
            <SelectItem value="mapbox://styles/mapbox/streets-v11">
              Streets
            </SelectItem>
            <SelectItem value="mapbox://styles/mapbox/light-v10">
              Light
            </SelectItem>
            <SelectItem value="mapbox://styles/mapbox/dark-v10">
              Dark
            </SelectItem>
          </Select.Group>
        </SelectViewport>
        <SelectScrollDownButton>
          <ChevronDownIcon />
        </SelectScrollDownButton>
      </SelectContent>
    </Select.Portal>
  </Select.Root>
);

const SelectTrigger = styled(Select.SelectTrigger, {
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 4,
  padding: "0 15px",
  fontSize: 13,
  lineHeight: 1,
  height: 35,
  gap: 5,
  backgroundColor: "white",
  color: violet.violet11,
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  "&:hover": { backgroundColor: mauve.mauve3 },
  "&:focus": { boxShadow: `0 0 0 2px black` },
  "&[data-placeholder]": { color: violet.violet9 },
});

const SelectIcon = styled(Select.SelectIcon, {
  color: violet.violet11,
});

const SelectContent = styled(Select.Content, {
  overflow: "hidden",
  backgroundColor: "white",
  borderRadius: 6,
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
});

const SelectViewport = styled(Select.Viewport, {
  padding: 5,
});

const SelectItem = React.forwardRef<any, any>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <StyledItem {...props} ref={forwardedRef}>
        <Select.ItemText>{children}</Select.ItemText>
        <StyledItemIndicator>
          <CheckIcon />
        </StyledItemIndicator>
      </StyledItem>
    );
  }
);

const StyledItem = styled(Select.Item, {
  fontSize: 13,
  lineHeight: 1,
  color: violet.violet11,
  borderRadius: 3,
  display: "flex",
  alignItems: "center",
  height: 25,
  padding: "0 35px 0 25px",
  position: "relative",
  userSelect: "none",

  "&[data-disabled]": {
    color: mauve.mauve8,
    pointerEvents: "none",
  },

  "&[data-highlighted]": {
    outline: "none",
    backgroundColor: violet.violet9,
    color: violet.violet1,
  },
});

const SelectLabel = styled(Select.Label, {
  padding: "0 25px",
  fontSize: 12,
  lineHeight: "25px",
  color: mauve.mauve11,
});

const SelectSeparator = styled(Select.Separator, {
  height: 1,
  backgroundColor: violet.violet6,
  margin: 5,
});

const StyledItemIndicator = styled(Select.ItemIndicator, {
  position: "absolute",
  left: 0,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

const scrollButtonStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 25,
  backgroundColor: "white",
  color: violet.violet11,
  cursor: "default",
};

const SelectScrollUpButton = styled(Select.ScrollUpButton, scrollButtonStyles);

const SelectScrollDownButton = styled(
  Select.ScrollDownButton,
  scrollButtonStyles
);

export default SelectMapStyle;
