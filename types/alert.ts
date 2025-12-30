export interface Alert {
  _id: string;
  factoryId: string;
  type: string;
  severity: string;
  message: string;
  source?: string;
  read: boolean;
  dismissedInDropdown?: boolean;
  deleted?: boolean;
  createdAt: string;
  date: string;
  value?: number;
  baseline?: number;
}
