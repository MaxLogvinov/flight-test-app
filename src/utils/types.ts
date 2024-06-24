export interface Airline {
  uid: string;
  caption: string;
}

export interface Price {
  amount: string;
  currency: string;
}

export interface Total {
  total: Price;
}

export interface DepartureAirport {
  uid: string;
  caption: string;
}

export interface DepartureCity {
  uid: string;
  caption: string;
}

export interface ArrivalAirport {
  uid: string;
  caption: string;
}

export interface ArrivalCity {
  uid: string;
  caption: string;
}

export interface Segment {
  departureAirport: DepartureAirport;
  departureCity: DepartureCity;
  departureDate: string;
  arrivalAirport: ArrivalAirport;
  arrivalCity: ArrivalCity;
  arrivalDate: string;
  travelDuration: number;
  stops: number;
  airline: { caption: string };
}

export interface Leg {
  duration: number;
  segments: Segment[];
}

export interface FlightDetail {
  carrier: Airline;
  price: Total;
  legs: Leg[];
}

export interface Flight {
  hasExtendedFare: boolean;
  flight: FlightDetail;
  flightToken: string;
}

export interface FlightResult {
  flights: Flight[];
}

export interface Results {
  result: FlightResult;
}
