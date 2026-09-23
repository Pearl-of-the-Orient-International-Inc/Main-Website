"use client";

import * as React from "react";
import PhoneNumberInput from "react-phone-number-input/input";
import {
  formatPhoneNumberIntl,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumber,
  type Country,
} from "react-phone-number-input";
import { validatePhoneNumberLength } from "libphonenumber-js/max";
import { Metadata } from "libphonenumber-js/core";
import phoneMetadata from "libphonenumber-js/metadata.max.json";
import countryLabels from "react-phone-number-input/locale/en";
import flags from "react-phone-number-input/flags";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const countries = getCountries().sort((left, right) =>
  countryLabels[left].localeCompare(countryLabels[right]),
);

function CountryFlag({ country }: { country: Country }) {
  const Flag = flags[country];

  if (!Flag) return null;

  return (
    <span
      aria-hidden="true"
      className="inline-flex w-5 shrink-0 overflow-hidden rounded-xs border border-black/10 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
    >
      <Flag title={countryLabels[country]} />
    </span>
  );
}

type RestrictedPhoneInputProps = React.ComponentProps<"input"> & {
  maxNationalDigits?: number;
};

const countDigits = (value: string) => value.replace(/\D/g, "").length;

type PhoneNumberTypeMetadata = {
  possibleLengths: () => number[];
};

type NumberingPlanWithTypes = {
  possibleLengths: () => number[];
  type: (
    type: "MOBILE" | "FIXED_LINE",
  ) => PhoneNumberTypeMetadata | undefined;
};

const ShadcnPhoneInput = React.forwardRef<
  HTMLInputElement,
  RestrictedPhoneInputProps
>(
  (
    {
      className,
      maxNationalDigits,
      onBeforeInput,
      onPaste,
      ...props
    },
    ref,
  ) => {
    const wouldExceedLimit = (
      input: HTMLInputElement,
      insertedText: string,
    ) => {
      if (!maxNationalDigits) return false;

      const selectionStart = input.selectionStart ?? input.value.length;
      const selectionEnd = input.selectionEnd ?? selectionStart;
      const selectedDigits = countDigits(
        input.value.slice(selectionStart, selectionEnd),
      );
      const currentDigits = countDigits(input.value);
      const insertedDigits = countDigits(insertedText);

      if (
        currentDigits === selectedDigits &&
        insertedText.replace(/\D/g, "").startsWith("0")
      ) {
        return true;
      }

      return (
        currentDigits - selectedDigits + insertedDigits >
        maxNationalDigits
      );
    };

    return (
      <Input
        ref={ref}
        className={className}
        onBeforeInput={(event) => {
          onBeforeInput?.(event);
          if (event.defaultPrevented) return;

          const inputEvent = event.nativeEvent as InputEvent;
          if (
            inputEvent.data &&
            wouldExceedLimit(event.currentTarget, inputEvent.data)
          ) {
            event.preventDefault();
          }
        }}
        onPaste={(event) => {
          onPaste?.(event);
          if (event.defaultPrevented) return;

          if (
            wouldExceedLimit(
              event.currentTarget,
              event.clipboardData.getData("text"),
            )
          ) {
            event.preventDefault();
          }
        }}
        {...props}
      />
    );
  },
);

ShadcnPhoneInput.displayName = "ShadcnPhoneInput";

type InternationalPhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  id?: string;
  placeholder?: string;
};

export function InternationalPhoneInput({
  value,
  onChange,
  invalid = false,
  id,
  placeholder = "Enter phone number",
}: InternationalPhoneInputProps) {
  const parsedCountry = value.startsWith("+")
    ? parsePhoneNumber(value)?.country
    : undefined;
  const [country, setCountry] = React.useState<Country>(parsedCountry ?? "PH");
  const [lengthError, setLengthError] = React.useState<string | null>(null);
  const maxNationalDigits = React.useMemo(() => {
    const metadata = new Metadata(phoneMetadata);
    metadata.selectNumberingPlan(country);
    const numberingPlan = metadata.numberingPlan as
      | NumberingPlanWithTypes
      | undefined;
    const mobileLengths = numberingPlan?.type("MOBILE")?.possibleLengths() ?? [];
    const fixedLineLengths =
      numberingPlan?.type("FIXED_LINE")?.possibleLengths() ?? [];
    const personalPhoneLengths = [
      ...new Set([...mobileLengths, ...fixedLineLengths]),
    ];
    const possibleLengths =
      personalPhoneLengths.length > 0
        ? personalPhoneLengths
        : (numberingPlan?.possibleLengths() ?? []);

    return possibleLengths.length > 0 ? Math.max(...possibleLengths) : 15;
  }, [country]);

  React.useEffect(() => {
    if (parsedCountry && parsedCountry !== country) {
      setCountry(parsedCountry);
    }
  }, [country, parsedCountry]);

  React.useEffect(() => {
    if (!value || value.startsWith("+")) return;

    const nationalDigits = value.replace(/\D/g, "").replace(/^0+/, "");
    if (nationalDigits) {
      onChange(`+${getCountryCallingCode(country)}${nationalDigits}`);
    }
  }, [country, onChange, value]);

  React.useEffect(() => {
    if (!value.startsWith("+")) return;

    const callingCode = getCountryCallingCode(country);
    const digits = value.replace(/\D/g, "");
    if (!digits.startsWith(callingCode)) return;

    const nationalDigits = digits.slice(callingCode.length);
    if (nationalDigits.length > maxNationalDigits) {
      onChange(`+${callingCode}${nationalDigits.slice(0, maxNationalDigits)}`);
    }
  }, [country, maxNationalDigits, onChange, value]);

  const internationalValue = value.startsWith("+")
    ? formatPhoneNumberIntl(value) || value
    : "";

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <Select
          value={country}
          onValueChange={(nextCountry) => {
            setCountry(nextCountry as Country);
            setLengthError(null);
            onChange("");
          }}
        >
          <SelectTrigger
            className={cn("w-[150px] shrink-0", invalid && "border-destructive")}
            aria-label="Country calling code"
            aria-invalid={invalid}
          >
            <SelectValue>
              <CountryFlag country={country} />
              <span>+{getCountryCallingCode(country)}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent position="popper" className="max-h-80 min-w-[280px]">
            {countries.map((option) => (
              <SelectItem key={option} value={option}>
                <CountryFlag country={option} />
                <span className="min-w-0 flex-1 truncate">
                  {countryLabels[option]}
                </span>
                <span className="text-muted-foreground">
                  +{getCountryCallingCode(option)}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <PhoneNumberInput
          id={id}
          country={country}
          value={value || undefined}
          onChange={(nextValue) => {
            if (!nextValue) {
              setLengthError(null);
              onChange("");
              return;
            }

            if (validatePhoneNumberLength(nextValue) === "TOO_LONG") {
              setLengthError(
                `That number is too long for ${countryLabels[country]}.`,
              );
              return;
            }

            setLengthError(null);
            onChange(nextValue);
          }}
          inputComponent={ShadcnPhoneInput}
          maxNationalDigits={maxNationalDigits}
          placeholder={placeholder}
          autoComplete="tel"
          aria-invalid={invalid || Boolean(lengthError)}
          className="min-w-0 flex-1"
        />
      </div>

      {lengthError ? (
        <p role="alert" className="text-xs text-destructive">
          {lengthError}
        </p>
      ) : internationalValue ? (
        <p className="text-xs text-neutral-500">
          International number: {internationalValue}
        </p>
      ) : null}
    </div>
  );
}
