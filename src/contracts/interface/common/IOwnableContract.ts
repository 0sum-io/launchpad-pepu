import GenericContract from "./GenericContract";

export interface IOwnableContract extends GenericContract {
  owner(): Promise<string>;
}
