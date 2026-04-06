// UC20: TypeScript interfaces for API DTOs

export interface QuantityDTO {
  value: number;
  unitName: string;
  measurementType: string;
}

export interface QuantityInputDTO {
  thisQuantityDTO: QuantityDTO;
  thatQuantityDTO?: QuantityDTO;
  targetUnit?: string;
}

export interface QuantityMeasurementDTO {
  thisValue: number;
  thisUnit: string;
  thisMeasurementType: string;
  thatValue: number;
  thatUnit: string;
  thatMeasurementType: string;
  operation: string;
  resultString: string;
  resultValue: number;
  resultUnit: string;
  resultMeasurementType: string;
  errorMessage: string;
  isError: boolean;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}

// Unit mappings matching backend enums
export const UNITS_MAP: { [key: string]: string[] } = {
  LENGTH: ['INCH', 'FEET', 'YARDS', 'CENTIMETERS'],
  WEIGHT: ['GRAM', 'KILOGRAM', 'POUND'],
  TEMPERATURE: ['CELSIUS', 'FAHRENHEIT'],
  VOLUME: ['LITRE', 'MILLILITRE', 'GALLON'],
};
