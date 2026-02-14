import type { AxiosError } from "axios";

export function getErrorMessage(err: unknown): string {
  const e = err as AxiosError<any>;
  const data = e?.response?.data;

  if(typeof data?.message === "string") {
    return data.message;
  }

  if(typeof data?.error === "string") {
    return data.error;
  }

  if(Array.isArray(data?.issues) && data.issues.length > 0) {
    const first = data.issues[0];
    if(typeof first?.message === "string") {
      return first.message;
    }
  }

  if(typeof e?.message === "string") {
    return e.message;
  }

  return "Something went wrong";
}
