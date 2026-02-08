import type { AxiosError } from "axios";

export function getErrorMessage(err: unknown): string {
  const e = err as AxiosError<any>;

  const message =
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    "Something went wrong";

  return typeof message === "string" ? message : "Something went wrong";
}
